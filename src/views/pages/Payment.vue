<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

const file = ref(null);
const uploadForm = ref();

const payer = ref(0);
const payment_types = ref([
  'Оплата через СБП. Мгновенное зачисление. Комиссия банка 0,7%',
  'Оплата картой. Мгновенное зачисление. Комиссия банка ',
  'На банковскую карту',
  'Безналичный перевод на счёт. <strong>Зачисление 1-2 раб. дня</strong>. Без комиссии',
  'Другое. Свяжитесь с менеджером для уточнения способа оплаты']);

const payment_type = ref( 0)
const meter_prices = ref( [])
const meter_price = ref( null)
const price = ref( 0)
const count = ref( 10)
const comment = ref( null)
const process = ref( false)
const order = ref( null)
const link = ref( null)
const Images = ref({})

function loadData() {
      payer.value = currentUser.user.payer;
      payment_types.value[1] = 'Оплата картой. Мгновенное зачисление. Комиссия банка '+acquiringCommission.value+'%'
    }

function getMeterPrices() {
      const token = getCookie('api_token')
        if (token) {
          axios.defaults.headers.common.Authorization = `Bearer ${token}`
          axios.get(`/api/v1/meter-price`)
          .then((resp) => {
            meter_prices.value = resp.data.data
          });
        }
}

function createTransaction() {
      order.value = null;
      const token = getCookie('api_token')
        let payment_type_ = parseInt(payment_type.value);
        if (parseInt(payment_type_)<2)
          payment_type_ = 1;
        else
          payment_type_ = payment_type_ -1;
        if (token) {
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
          axios.post(`/api/v1/transaction`, {
            'price': amount.value,
            'count': count.value,
            'comment': comment.value,
            'payment_type': payment_type_,
            'meter_price': meter_prices.value[meter_price.value].id
          })
          .then((resp) => {
            if (resp.data.success) {
              order.value = resp.data.data
              if (payment_type_ < 2) {
                paymentTransaction();
              }
            }
          });
        }
      }

function paymentTransaction() {
      // console.log('payment transaction');
      link.value = null;
      process.value = true;
      const token = getCookie('api_token')

      let payment_type_ = parseInt(payment_type.value);
      if (payment_type_<2)
        payment_type_ = 1;
      else
        payment_type_ = payment_type_ -1;

        if (token) {
          let data = {
            'order': order.value.id,
            'price': amount.value,
            'count': count.value,
            'payment_type': payment_type_,
            'meter_price': meter_prices.value[meter_price.value].id
          };
        // console.log('data', data);
        axios.defaults.headers.common.Authorization = `Bearer ${token}`
          axios.post(`/api/v1/payment-transaction`, data)
          .then((resp) => {
            if (resp.data.success) {
              let type_pay = null;
              if (payment_type.value === 0)
                type_pay = '?pstype=sbp_default';
              else if (payment_type.value === 1)
                type_pay = '';

              link.value = resp.data.data
              document.location = link.value+type_pay
              process.value = false;
            }
          });
        }
}

    const uploadFile = (event) => {
      const target = event.target;
      if (target && target.files) {
        file.value = target.files[0];
      }
    }

    const submitFile = async () => {
      let payment_type_ = parseInt(payment_type.value);
      if (payment_type_ < 2)
        payment_type_ = 1;
      else
        payment_type_ = payment_type_ -1;

      if (file.value) {
        try {
          const formdata = new FormData();
          const token = getCookie('api_token')
          formdata.append('file', file.value);
          formdata.append('price', amount.value);
          formdata.append('payment_type', payment_type_);
          formdata.append('count', count.value);
          formdata.append('comment', comment.value);
          formdata.append('meter_price', meter_prices.value[meter_price.value].id);
          const endpoint = `/api/v1/transaction`;
          axios.defaults.headers.common.Authorization = `Bearer ${token}`
          const response = await axios.post(endpoint, formdata);
          // console.log(response.data);
          if (response.data.success) {
            let message = payment_type_ === 2 ? 'Платеж будет зачислен в течение двух рабочих дней'
              : 'Платеж успешно передан!';
            alert(message)
          }
          else {
            alert('Ошибка передачи платежа!')
          }

        } catch (error) {
          console.error(error);
          alert('Ошибка передачи платежа! '+error)
          uploadForm.value?.reset();
          file.value = null;
        } finally {
          process.value = true;
        }
      }
      else {
        alert('Ошибка передачи платежа! Файл не  передан!')
      }
    }

    const acquiringCommission = computed(() => {
      if (currentUser.user.config)
        return currentUser.user.config.acquiring_commission;
      else
        return 2.3;
    })

    const  amount = computed(() => {
      let price_ = price.value;
      if (payment_type.value === 0)
        price_ = price_+price_*0.7/100;
      else if (payment_type.value === 1) {
        price_ = price_ + price_ * parseFloat(acquiringCommission.value) / 100;
      }
      return price_;
    })

    watch(() => meter_price.value, (val, oldVal) => {
      if (meter_prices.value[val].package == 1) {
        count.value = meter_prices.value[val].count;
      }
      else {
        count.value = 10;
      }
      price.value = count.value*meter_prices.value[val].price;
    });

    watch(() => count.value, (val, oldVal) => {
      price.value = val*meter_prices.value[meter_price.value].price
    });

    const checkAmount = () => {
      if(count.value > 10000 || count.value < 10) { count.value = 10 }
      price.value = val*meter_prices.value[meter_price].price
    }

    const sendPayment = () => {
        createTransaction();
        process.value = true
    }

onMounted(() => {
  loadData()
  getMeterPrices()
})

</script>

<template xmlns="http://www.w3.org/1999/html">
  <div>
    <CForm @submit.prevent="sendPayment">
      <CRow v-if="payer">
        <CCol sm="10" v-if="process">
          <CCard>
            <CCardHeader>
              <strong>
                Оплата за обработку и передачу данных о поверках счетчиков
              </strong><small></small>
            </CCardHeader>
            <CCardBody>
              <div v-if="payment_type < 2">
                <h5 v-if="process">
                  Пожалуйста подождите, формируется ссылка для оплаты...
                </h5>
                <h5 v-else-if="link">
                  Сейчас Вы будете перенаправлены на оплату платежа<br/><br/>
                </h5>
                <h5 v-else class="text-danger">
                  Возникла ошибка при формировании ссылки для оплаты услуг. Обратитесь к администратору системы.<br/><br/>
                </h5>
              </div>
              Историю оплаты Вы можете увидеть в <router-link to="/payments">разделе "Платежи"</router-link><br/>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol sm="10" v-else>
          <CCard>
            <CCardHeader>
              <strong>
                Оплата за обработку и передачу данных о поверках счетчиков
              </strong><small></small>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol sm="12">
                  <CCard>
                    <CCardTitle>Шаг 1. Выберите пакет</CCardTitle>
                    <CCardBody>
                      <CRow
                        v-for="(item, index) in meter_prices" :key="index">
                        <CCol>
                          <input class="payment-radio" type="radio" v-model="meter_price" :value="index">
                          <label>
                            {{ item.comment }}
                          </label>
                        </CCol>
                      </CRow>
                      <CRow v-if="meter_prices[meter_price]">
                        <CCol sm="3">
                          <label>Количество поверок</label>
                        </CCol>
                        <CCol sm="2">
                          <input type="number"
                                 class="form-control"
                                 v-on:blur="checkAmount"
                                 v-model="count"
                                 v-if="meter_prices[meter_price].package==0"/>
                          <span v-else>
                          {{ count }}
                        </span>
                        </CCol>
                        <CCol sm="2">
                          стоимость
                        </CCol>
                        <CCol sm="2" v-if="meter_price!==null">
                          {{ price }} руб.
                        </CCol>
                      </CRow>
                      <CRow>
                        <CCol>
                          * Для покупки пакета - 5 000 счетчиков и более, свяжитесь с менеджером для уточнения индивидуальных условий
                        </CCol>
                      </CRow>
                    </CCardBody>
                    <!--                  <CCardFooter>-->
                    <!--                          <div class="text-primary" v-if="meter_price!==null">-->
                    <!--                            Стоимость: {{ price }} руб.-->
                    <!--                          </div>-->
                    <!--                  </CCardFooter>-->
                  </CCard>
                </CCol>
              </CRow>
              <CRow v-if="amount!==0">
                <CCol sm="12" class="form-group">
                  <CCard>
                    <CCardTitle>Шаг 2. Выберите тип оплаты</CCardTitle>
                    <CCardBody>
                      <!--                    {{ currentUser.user.user_payment_card.length }}-->
                      <div v-for="(item, index) in payment_types" :key="index">
                        <div v-if="currentUser.user.user_payment_card.length===0 && index===2">
                        </div>
                        <div v-else>
                          <input class="payment-radio" type="radio" v-model="payment_type" :value="index">
                          <label>
                            <div v-html="item" />
                          </label><br/>
                        </div>
                      </div>
                    </CCardBody>
                    <CCardFooter v-if="amount">
                      <div class="text-primary">
                        К оплате: {{ amount }} руб.<span v-if="payment_type<2">*</span>
                        <div v-if="payment_type < 2" class="text-dark">* Сумма включает в себя комиссию банка.
                          После успешной оплаты чек будет автоматически выслан на {{ currentUser.user.email}}<br/>
                          По всем вопросам, пожалуйста, обратитесь к менеджеру по телефону: <a href="tel:+79608374000">+7 (960) 837-40-00</a> или через мессенджеры
                          <ul class="cib-messenger">
                            <li>
                              <a href="https://t.me/ms_resurs_bot">
                                <div class="telegram"></div>
                              </a>
                            </li>
                            <li>
                              <a href="https://wa.me/79608374000">
                                <div class="whatsapp"></div>
                              </a>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <p>
                        Перед совершением покупки просим Вас ознакомиться с условиями договора оферты. Нажимая кнопку "Оплатить",
                        Вы подтверждаете своё согласие с <router-link to="/pages/offer">условиями оферты</router-link>.
                      </p>
                      <div v-if="payment_type < 2">
                        <CButton color="info" class="mb-2" @click="sendPayment">
                          Оплатить
                        </CButton>
                      </div>
                      <div v-if="payment_type > 1">
                        <br/>
                        <div v-if="payment_type === 2">
                          Сделайте перевод на сумму <b>{{ price }} руб </b>  на банковскую карту
                          №  <b>{{ currentUser.user.user_payment_card[0].card }}</b>, прикрепите чек
                          и затем нажмите кнопку <b>Оплачено.</b>
                          <br/><br/>
                        </div>
                        <div v-if="payment_type === 3">
                          Оплатите безналичный перевод
                          <a target="_blank"
                             :href="`/get-file/bill-payment/${currentUser.user.partner.code}/${count}/${price}`">
                            по счету
                          </a>
                          , прикрепите чек  и затем нажмите кнопку <b>Оплачено.</b>
                          <br/><br/>
                          <label>Комментарий к платежу</label>
                          <CTextarea v-model="comment"></CTextarea>
                        </div>
                        <div v-else-if="payment_type === 4">
                          Прикрепите чек об оплате суммы <b>{{ price }} руб </b>и затем нажмите кнопку <b>Оплачено.</b>
                          <br/><br/>
                          *оплата производится по номеру карты, который вы можете уточнить у вашего менеджера.
                          При переводе, не забудьте указать ваш код партнера - <b>{{ currentUser.user.partner.code}}</b>
                          По всем вопросам, пожалуйста, обратитесь к менеджеру по телефону: <a href="tel:+79608374000">+7 (960) 837-40-00</a> или через мессенджеры
                          <ul class="cib-messenger">
                            <li>
                              <a href="https://t.me/ms_resurs_bot">
                                <div class="telegram"></div>
                              </a>
                            </li>
                            <li>
                              <a href="https://wa.me/79608374000">
                                <div class="whatsapp"></div>
                              </a>
                            </li>
                          </ul>
                          <br/><br/>
                          <label>Комментарий к платежу</label>
                          <CTextarea v-model="comment"></CTextarea>
                        </div>
                        <form novalidate @submit.prevent="submitFile">
                          <input
                            type="file"
                            name="file"
                            @change="uploadFile($event)"
                          />
                          <!--                        <button type="submit" class="btn btn-info">Отправить</button>-->
                          <CButton type="submit"  color="info" class="mb-2">
                            Оплачено
                          </CButton>
                        </form>
                        <br/>
                      </div>
                    </CCardFooter>
                  </CCard>
                </CCol>
              </CRow>
              <CRow v-if="currentUser.user.external">
                <CCol sm="12">
                  <CButton type="submit" color="primary" class="mb-2">
                    Сохранить
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow v-else>
        <h3>Пополнение лимита поверок будет доступно после активации администратором системы</h3>
      </CRow>
    </CForm>
  </div>
</template>

<style scoped>
.payment-radio {
  margin: 5px;
}
.card-title {
  margin: 1.5rem 1.5rem 0 1.5rem;
}
.cib-messenger {
  display: flex;
  li {
    list-style: none;
    float: left;

    span {
      height: 39px;
      display: inline-block;
    }
  }
}
</style>
