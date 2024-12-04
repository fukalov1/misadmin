<script setup>

import { ref, onMounted, watch, computed } from 'vue'
import axios from 'axios'
import { getCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const currentUser = useUserStore();

const ideal = ref(null)
const ci_as_ideal = ref(null)
const get = ref(null)
const hour_zone = ref(0)
const tools = ref([])

function loadData() {
      ideal.value = currentUser.user.ideal;
      ci_as_ideal.value = currentUser.user.ci_as_ideal;
      get.value = currentUser.user.get;
      hour_zone.value = currentUser.user.hour_zone;
      tools.value = currentUser.user.user_tools;
    }

const  check_online = computed(() => {
  return currentUser.user.check_online ? 'включены' : 'отключены';
})

const all_meters = computed(() => {
  return currentUser.user.partner.limit_credit + currentUser.user.partner.count_meters
})

onMounted(() => {
  loadData()
})

function saveProfile() {
  axios.post(`/api/save-profile`,
    {
      ideal: ideal.value,
      ci_as_ideal: ci_as_ideal.value,
      get: get.value,
      hour_zone: hour_zone.value,
      tools: tools.value
    })
    .then((resp) => {
      // USER();
    });
}

function addTools() {
  tools.value.push({typeNum: '', manufactureNum: ''});
}

function removeTools(index, id) {
  if (confirm('Запись о средстве измерения будет удалена. Вы хотите продолжить?')) {
    if (id) {
      axios.delete(`/api/profile/tool/${id}`,
        {})
        .then((resp) => {
          tools.value.splice(index, 1);
        });
    }
    else {
      tools.value.splice(index, 1);
    }
  }
}


</script>

<template>
  <div>
    <CForm @submit.prevent="saveProfile">
    <CRow v-if="currentUser">
      <CCol sm="6">
        <CCard>
          <CCardHeader>
            <strong>Данные поверителя</strong><small></small>
          </CCardHeader>
          <CCardBody>
            <CFormInput
              label="ФИО"
              placeholder="Фамилия Имя Отчество"
              :value="currentUser.user.name"
              disabled
            />
            <CRow>
              <CCol sm="4">
                <CFormInput
                  label="Код партнера"
                  placeholder="Код партнера"
                  :value="currentUser.user.partner.code"
                  disabled
                />
              </CCol>
              <CCol sm="4">
                <CFormInput
                  label="ID поверителя"
                  placeholder="Идентификатор поверителя"
                  :value="currentUser.user.code"
                  disabled
                />
              </CCol>
              <CCol sm="4">
                <CFormInput
                  label="Онлайн чеки"
                  :value="check_online"
                  disabled
                />
              </CCol>
            </CRow>
            <CFormInput
              label="Email"
              placeholder="Email"
              :value="currentUser.user.email"
              disabled
            />
            <CFormInput
              label="Примечание"
              placeholder="Примечание"
              :value="currentUser.user.comment"
              disabled
            />
            <CCard class="form-control">
              <CCardBody>
            <CRow v-if="currentUser.user.check_online" >
              <CCol sm="6">
                <label>Онлайн-касса</label>
                <strong>
                  включена
                </strong>
              </CCol>
              <CCol sm="6">
                <label>Лимит про чекам </label>
                <strong>
                  {{ currentUser.user.partner.limit }} руб.
                </strong>
              </CCol>
            </CRow>
            <CRow v-if="currentUser.user.partner.billing">
              <CCol sm="6">
                <label>Биллинг</label>
                <strong>
                  включен
                </strong>
              </CCol>
              <CCol sm="6">
                <label>Кредитный лимит поверок</label>
                <strong>
                  {{ currentUser.user.partner.limit_credit }}
                  (остаток {{ all_meters }})
                </strong>
              </CCol>
            </CRow>
              </CCardBody>
            </CCard>
            <CRow>
              <CCol sm="6">
                <CFormInput
                  label="Часовой пояс"
                  placeholder="Часовой пояс"
                  required="required"
                  v-model="hour_zone"
                  class=""
                  :disabled="!currentUser.user.external"
                />
              </CCol>
              <CCol sm="6">
                <CFormInput
                  label="Тип"
                  placeholder="Тип"
                  :value="currentUser.user.type"
                  disabled
                />
              </CCol>
            </CRow>
            <CRow>
              <CCol sm="4">
                <CFormInput
                  label="Эталон"
                  placeholder="Эталон"
                  required="required"
                  v-model="ideal"
                  :disabled="!currentUser.user.external"
                />
              </CCol>
              <CCol sm="4">

                  <CFormInput
                    label="СИ, как эталон"
                    placeholder="СИ, как эталон"
                    required="required"
                    v-model="ci_as_ideal"
                    :disabled="!currentUser.user.external"
                  />
              </CCol>
              <CCol sm="4">
                  <CFormInput
                    label="ГЭТ"
                    placeholder="ГЭТ"
                    required="required"
                    v-model="get"
                    :disabled="!currentUser.user.external"
                  />
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
      <CCol sm="6">
        <CCard v-if="currentUser.user.external">
          <CCardHeader>
            <strong>Средства измерений, применяемые при поверке</strong> <small></small>
          </CCardHeader>
          <CCardBody>
            <CRow v-for="(item, index) in tools" :key="index">
              <CCol sm="6">
                <CFormInput
                  label="Регистрационный номер типа СИ"
                  placeholder="Регистрационный номер типа СИ"
                  v-model="item.typeNum"
                />
              </CCol>
              <CCol sm="5">
                <CFormInput
                  label="Заводской номер СИ"
                  placeholder="Заводской номер СИ"
                  v-model="item.manufactureNum"
                />
              </CCol>
              <CCol sm="1">
                <span @click="removeTools(index, item.id)">x</span>
              </CCol>
            </CRow>
            <CRow v-if="currentUser.user.external">
              <CCol sm="12">
                <CButton @click="addTools" color="primary" class="mb-2">
                  Добавить
                </CButton>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
    <CRow v-else>
      <CCol sm="6">
        <CCard>
          Идет получение данных, подождите пожалуйста.
        </CCard>
      </CCol>
    </CRow>
    </CForm>
  </div>
</template>

