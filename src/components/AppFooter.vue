<script setup>
import mastercard from '@/assets/images/mastercard.png'
import visa from '@/assets/images/visa.png'
import mir from '@/assets/images/mir.png'
import sbp from '@/assets/images/sbp.png'
// import sber from '@/assets/images/sber.png'
import paykeeper from '@/assets/images/paykeeper.png'
import {computed} from 'vue'
import {APP_VERSION} from "@/environments/app-version";
import router from '@/router'
import {useUserStore} from '@/stores/user.js'
const currentUser = useUserStore();

const isResponsible = computed(() => {
  if (currentUser.roles)
    return currentUser.roles.indexOf(2)==-1 ? false : true;
  else
    return false
})

const showPaycards = computed(() => {
  if (router.currentRoute.value.fullPath === '/payment' || router.currentRoute.value.fullPath === '/'
    || router.currentRoute.value.fullPath === '/pages/login' )
    return true
  else
    return  false
})

</script>

<template>
  <CFooter class="px-4">
    <div>
      <a href="https://poverkadoma.ru" target="_blank">ИП Кузнецов</a>
      <span class="ms-1"
        >&copy; {{ new Date().getFullYear() }} Все права защищены.</span
      >
    </div>
    <div class="ms-auto">
      <span @click="router.push('/pages/privacy')">Политика конфиденциальности</span> |
      <span @click="router.push('/pages/info')">Условия пользования платными услугами </span> |
      <span @click="router.push('/pages/offer')" v-if="isResponsible">Оферта</span>
      {{ APP_VERSION }}
    </div>
    <div class="pay-sys" v-if="showPaycards">
              <ul>
                <li>
                  <img :src="mastercard"/>
                </li>
                <li>
                  <img :src="paykeeper"/>
                </li>
                <li>
                  <img :src="visa"/>
                </li>
                <li>
                  <img :src="mir"/>
                </li>
<!--                <li>-->
<!--                  <img :src="sber"/>-->
<!--                </li>-->
                <li>
                  <img :src="sbp"/>
                </li>
              </ul>
            </div>
  </CFooter>
</template>
