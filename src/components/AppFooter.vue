<script setup>
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
                <li><span class="mastercard"></span>
                </li>
                <li><span class="paykeeper"></span>
                </li>
                <li>
                  <span class="visa"></span>
                </li>
                <li>
                  <span class="mir"></span>
                </li>
                <li>
                  <span class="sb"></span>
                </li>
                <li>
                  <span class="cbp"></span>
                </li>
              </ul>
            </div>
  </CFooter>
</template>
