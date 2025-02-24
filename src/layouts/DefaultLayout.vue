<script setup>
import {watch} from "vue";
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'

import { useUserStore } from '@/stores/user.js'
import {computed} from "vue";
const currentUser = useUserStore();
// console.log('Roles current user in default layout', currentUser.roles)

const roles = computed(() => {
  return currentUser.roles ? currentUser.roles : null;
})

watch(roles, () => {
  if (roles === null)
    currentUser.logout()
})

</script>

<template>
  <div>
    <AppSidebar/>
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-4" lg>
          <router-view />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>

<style scoped>
@media (min-width: 1400px) {
  .container-xxl, .container-xl, .container-lg, .container-md, .container-sm, .container {
    max-width: 1820px;
  }
}
</style>
