<script setup>
import { ref } from 'vue'
// import { AUTH_REQUEST, AUTH_CONFIRM } from '@/api/auth'
import axios from 'axios'

const resultReset = ref(false)
const email = ref(null)

function ResetPassword() {
      // console.log('email', email.value);
      axios.post('/api/restore-password', {email: email.value})
        .then(() => {
          resultReset.value = true;
        })
        .catch(error => {
            console.log('server error', error);
          }
        )
}


</script>

<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody v-if="!resultReset">
                <CForm @submit.prevent="ResetPassword">
                  <h1>МС-Ресурс</h1>
                  <p class="text-body-secondary">Восстановление пароля</p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                    placeholder="Email"
                    autocomplete="email пользователя"
                    required="required"
                    v-model="email"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CFormInput>
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6">
                      <CButton color="primary" type="submit" class="px-4">Отправить</CButton>
                    </CCol>
                    <CCol :xs="6">
                      <router-link to="/pages/login">Авторизация</router-link>
                      <CButton color="link" class="d-lg-none">Регистрация</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
              <CCardBody v-else>
                <h1>МС-Ресурс</h1>
                <p class="text-muted">На указанный email выслана ссылка для восстановления пароля</p>
              </CCardBody>
            </CCard>

          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
