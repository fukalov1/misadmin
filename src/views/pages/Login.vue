<script setup>
import { AUTH_REQUEST } from '@/api/auth'
import { ref } from 'vue'

const email = ref('')
const password = ref('')

function Authentication() {
  console.log('auth', email, password);
  AUTH_REQUEST({ email: email.value, password: password.value })
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
                  <h1>Авторизация</h1>
                  <p class="text-body-secondary">Введите свой логин и пароль</p>
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
<!--                      <CButton color="link" class="px-0">-->
<!--                        Забыли пароль?-->
<!--                      </CButton>-->
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
            <CCard class="text-white bg-primary py-5" style="width: 44%">
              <CCardBody class="text-center">
                <div>
                  <h2>Стамус</h2>
                  <p>
                    Статистическая система стоматологических клиник СТАМУС.<br/><br/>
                    Для доступа получите реквизиты входа у администратора.
                  </p>
                </div>
              </CCardBody>
            </CCard>
          </CCardGroup>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
