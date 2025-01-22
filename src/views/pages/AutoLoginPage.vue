<script setup>
import {onMounted} from "vue";
import { setCookie, deleteCookie } from '@/helpers/cookie'
import {useUserStore} from '@/stores/user.js'

const  props = defineProps({
  token: {
    type: String,
  },
})

onMounted(() => {
  const currentUser = useUserStore()
  if (props.token) {
    console.log('start auto login', props.token)
    setCookie('api_token', props.token, { expires: 3600 * 24 * 365 })
    currentUser.login(props.token)
  }
})

</script>

<template>
  <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
    <CContainer>
      <CRow class="justify-content-center">
        <CCol :md="6">
          <div class="clearfix">
            <h4 class="pt-3">Авторизация</h4>
            <p class="text-body-secondary float-start">
              подождите, осущестляется вход в систему Поверка Дома
            </p>
          </div>
        </CCol>
      </CRow>
    </CContainer>
  </div>
</template>
