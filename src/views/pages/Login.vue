<script setup>
import { AUTH_REQUEST } from '@/api/auth'
import { ref, computed } from 'vue'
import AppFooter from '@/components/AppFooter.vue'
import {useAuthStore} from '@/stores/auth.js'

const currAuthStore = useAuthStore()

const email = ref('')
const error = ref('')
const password = ref('')
const id1 = ref('')
const id2 = ref('')
const id3 = ref('')
const pin = ref('')

function Authentication() {
  // console.log('auth', email, password);
  AUTH_REQUEST({ email: email.value, password: password.value })
}

const id = computed( () => {
  return `${id1.value}-${id2.value}-${id3.value}`;
})

function checkAct() {
  document.location = `https://pin.poverkadoma.ru/up?id=${id.value}&pin=${pin.value}`;
}

</script>

<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody>
                <CForm>
                  <h1>МС-Ресурс</h1>
                  <p class="text-body-secondary">Личный кабинет
                    поверителя</p>
                  <CRow>
                    <CCol class="text-center text-danger">
                      {{ currAuthStore.errors }}
                    </CCol>
                  </CRow>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Логин"
                      autocomplete="username"
                      v-model="email"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-4">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Пароль"
                      autocomplete="current-password"
                      v-model="password"
                    />
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" class="px-4" @click="Authentication"> Вход </CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <router-link :to="{name: 'forgot-password'}"><CButton color="link" class="px-0">
                                    Забыли пароль?
                                  </CButton></router-link>
                      <CButton color="link" class="d-lg-none">Регистрация</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5">
              <CCardBody class="text-center">
                <CForm>
                  <h2>Поиск акта</h2>
                  <p>
                    введите номер акта и пин-код
                  </p>
                  <CInputGroup class="mb-3">
                    <CFormInput
                      type="number"
                      aria-valuemax="3"
                      v-model="id1"
                      placeholder="***"
                    />
                    <CFormInput
                      type="number"
                      size="2"
                      v-model="id2"
                      placeholder="**"
                    />
                    <CFormInput
                      type="number"
                      size="6"
                      v-model="id3"
                      placeholder="****"
                    />
                  </CInputGroup>
                  <CInputGroup class="mb-3">
                    <CFormInput
                      placeholder="пин-код"
                      type="number"
                      v-model="pin"
                    />
                  </CInputGroup>
                  <CInputGroup>
                    <CButton color="secondary" class="px-4" @click="checkAct"> Найти </CButton>
                  </CInputGroup>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
      <br/>
      <AppFooter/>
    </CContainer>
  </div>
</template>
