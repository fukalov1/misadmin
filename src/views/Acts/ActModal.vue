<script setup>
import { computed } from 'vue'
import {ADDRESS} from "../../backserver";

const emit = defineEmits(['enableEditMode', 'deleteItem'])

const  props = defineProps({
  item: {
    type: Object
  }
})

function saveData() {
  emit('enableEditMode', false, props.item)
}

function cancelData() {
  emit('enableEditMode', false, null)
}


const srcJpg = computed(() => {
  console.log('jpg', props.item)
  if (props.item.date) {
    let str = 'act_' + props.item.name + '.jpg';
    let date = props.item.date;
    date = date.slice(0, 7);
    date = date.replace('-', '/');
    str = str.replace('photos/', '');
    str = '/photo/' + date + '/' + str;
    return `${ADDRESS}${str}`;
  }
  else
    return null;
})

const getSrcPhoto = (meter) => {
  console.log('meter' , meter)
  if (meter) {
    let str = meter.meter_photo;
    let date = meter.date;
    date = date.slice(0, 7);
    date = date.replace('-', '/');
    str = '/preview/' + date + '/' + str;
    return `${ADDRESS}${str}`;
  }
  else
    return null;
}

</script>

<template>
  <transition name="pdf-fade">
    <div class="pdfmodal">
      <CCol :xs="12">
      <CCardHeader>
        <CRow>
          <CCol sm="11">
          </CCol>
          <CCol sm="1">
            <CButton @click="cancelData" color="info">Закрыть</CButton>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCard class="mb-4">
        <CCardHeader>
          <strong>Данные акта</strong> <small></small>
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol sm="6">
              <CRow class="flex-fill">
                <h5>Акт № {{item.number_act}} от {{item.date}} г. </h5>
                <br/>
                <div>
                  На основании результатов метрологической поверки ИПУ, в количестве <strong>{{ item.meters.length }} шт.
                  признан<span v-if="item.meters.length > 1">ы</span> {{ item.type }}м<span v-if="item.meters.length > 1">и</span></strong> к дальнейшей эксплуатации.
                </div>

                <CTable striped>
                  <CTableRow>
                    <CTableDataCell>Владелец:</CTableDataCell>
                    <CTableDataCell>{{ item.miowner }}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Тип: </CTableDataCell>
                    <CTableDataCell>{{ item.type }} </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Передано в Аршин<sup>*</sup>: </CTableDataCell>
                    <CTableDataCell>{{ item.exported ? 'да' : 'нет' }} </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>ПИН: </CTableDataCell>
                    <CTableDataCell>{{ item.pin }} </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Примечание: </CTableDataCell>
                    <CTableDataCell>{{ item.address}} </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell>Поверено счетчиков: </CTableDataCell>
                    <CTableDataCell>
                      {{ count_meters }}
                    </CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col"  colspan="2">
                      <sup>*</sup> Внимание. Данные в Федеральный информационный фонд (ФИФ) могут передаваться до 40 дней.
                    </CTableDataCell>
                  </CTableRow>
                </CTable>
              </CRow>
              <CRow>
                <CTable>
                  <CTableRow v-for="(meter, index) in item.meters"
                             :key="index">
                    <CTableDataCell>
                      <img :src="getSrcPhoto(meter)" width="90%"/>
                    </CTableDataCell>
                    <CTableDataCell>
                      <ul>
                        <li>
                          Модификация: {{ meter.siType }} Номер в Госреестре: {{ meter.regNumber }}
                        </li>
                        <li>
                          Заводской номер: {{ meter.serialNumber }}
                        </li>
                        <li>
                          Дата поверки: {{ new Date(Date.parse(meter.created_at)).toLocaleDateString() }}
                          Действует до: {{ new Date(Date.parse(meter.nextTest)).toLocaleDateString() }}
                        </li>
                        <li>
                          Методика поверки: {{ meter.checkMethod }} Вода: {{ meter.waterType }}
                        </li>
                        <li>
                          Помещение: {{ meter.place }}
                        </li>
                        <li v-if="item.exported">
                          <a :href="`https://fgis.gost.ru/fundmetrology/cm/results?filter_mi_number=${meter.serialNumber}&filter_org_title=МС-РЕСУРС&activeYear=${new Date(Date.parse(item.date)).getFullYear()}`" target="_blank">
                            Проверить в ФИФ
                          </a> (в электронном реестре)
                        </li>
                      </ul>
                    </CTableDataCell>
                  </CTableRow>
                </CTable>
              </CRow>
            </CCol>
            <CCol sm="6" v-if="Object.keys(item).length">
              <img :src="srcJpg"/>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

    </CCol>
    </div>
  </transition>
</template>

<style scoped>

.noscroll{
  overflow: hidden !important;
}
.pdfmodal {
  position: fixed;
  z-index: 10000;
  background-color: #ffffff;
  top: 0;
  right: 0;
  height: 100vh;
  width: 90vw;
  padding: 30px 30px 30px 20px;
  -webkit-box-shadow: -4px 5px 8px 5px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: -4px 5px 8px 5px rgba(34, 60, 80, 0.2);
  box-shadow: -4px 5px 8px 5px rgba(34, 60, 80, 0.2);
}
.pdfmodal .close {
  font-size: 25px;
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
  z-index: 100;
}
.pdf-fade-enter-active, .pdf-fade-leave-active {
  transition: right 0.5s linear;
  right: 0;
}
.pdf-fade-enter, .pdf-fade-leave-to  {
  right: -100%;
}

body {
  margin: 0;
  padding: 0;
  background-color: #606f7b;
}
img {
  max-height: 100vh;
}
label.form {
  color: white;
  font-family: Monaco, 'Courier New', Courier, monospace;
  font-weight: bold;
  margin-bottom: 2em;
  display: block;
}
input {
  padding: 0.45em;
  font-size: 1em;
}
.error {
  border: 1px solid red;
  background: pink;
  color: red;
  padding: 0.5em 3em;
  display: inline;
}
a.icon {
  cursor: pointer;
  display: block;
  border: 1px #333 solid;
  background: white;
  color: #333;
  font-weight: bold;
  padding: 0.25em;
  width: 1em;
  height: 1em;
  font-size: 1.5em;
}
.box-shadow {
  box-shadow: 0 15px 30px 0 rgba(0, 0, 0, 0.11), 0 5px 15px 0 rgba(0, 0, 0, 0.08);
}
.overflow-hidden {
  overflow: hidden;
}
@media print {
  body {
    background-color: transparent;
  }
  #app {
    margin: 0;
    padding: 0;
  }
}
#meters-slider.carousel-control-prev, #meters-slider.carousel-control-next {
  color: #0b2e13;
}
</style>

