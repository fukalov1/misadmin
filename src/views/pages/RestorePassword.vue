<script setup>

import {defineProps, onMounted, ref} from 'vue'
import axios from "axios"

const  props = defineProps({
  email: {
    type: String,
  },
  token: {
    type: String,
  },
})

const  restoreData = ref({
        email: '',
        token: '',
        password: ''
      })

const errors = ref({
        message: '',
        email: '',
        password: '',
        util: '',
        auth: null,
      })

const status = ref(null)
const success = ref()
const resultRestore = ref(null)
const visibility = ref(false)

onMounted(() => {
  restoreData.value.email = atob(props.email);
  restoreData.value.token = props.token;
})


function restorePassword() {

      // this.errors.auth = null;

      axios.post('/api/reset-password', {
        email: restoreData.value.email,
        token: restoreData.value.token,
        password: restoreData.value.password
      })
        .then((response) => {
          resultRestore.value = true;
          // this.status = response.data.status;
          // this.success = response.data.success;
        })
        .catch(error => {
            console.log('server error', error);
            // this.errors.auth = true;
            // if (error.response !== undefined && error.response.status === 408) {
            //   this.errors.email   = error.return.data.errors.message.email;
            // } else
            //   this.errors.message = 'Не верный email пользователя';
          }
        )
}

    // checkEmail() {
    //   //проверим email
    //   if (this.restoreData.email === '') {
    //     this.errors.email = 'Email не может быть пустым';
    //     return false;
    //   } else if (!validEmail(this.restoreData.email)) {
    //     this.errors.email = 'Ошибка восстановления пароля';
    //     return false;
    //   }
    //   return true;
    // },

function formLogin() {
      // this.$router.push({name: 'FormLogin'});
      this.$router.push('/pages/login');
    }

function toggleShowPassword() {
      visibility.value != visibility.value
}

</script>

<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="8">
          <CCardGroup>
            <CCard class="p-4">
              <CCardBody v-if="resultRestore">
                <h1>МС-Ресурс</h1>
                <p class="text-body-secondary">
                  Пароль успешно изменен.<br/><br/>
                  <router-link to="/pages/login">Войдите в личный кабинет.</router-link>
                </p>
              </CCardBody>
              <CCardBody v-else>
                <CForm @submit.prevent="restorePassword">
                  <h1>МС-Ресурс</h1>
                  <p class="text-body-secondary">Восстановление пароля</p>
                  <p class="auth-form-error text-danger" v-if="errors.auth">
                    {{ errors.message }}
                  </p>
                  <CInputGroup class="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cib-code" />
                    </CInputGroupText>
                    <CFormInput
                    placeholder="Введите новый пароль"
                    autocomplete="Введите новый пароль"
                    id="floatingPassword"
                    v-model="restoreData.password"
                  >
                    <template #prepend-content><CIcon name="cil-user"/></template>
                  </CFormInput>
                  </CInputGroup>
                  <CRow>
                    <CCol :xs="6" class="text-left">
                      <CButton color="primary" type="submit" class="px-4">Отправить</CButton>
                    </CCol>
                    <CCol :xs="6" class="text-right">
                      <router-link to="/pages/login">Авторизация</router-link>
                      <CButton color="link" class="d-lg-none">Регистрация</CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
