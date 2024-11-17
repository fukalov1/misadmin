<script setup>
import { CContainer } from '@coreui/vue'
import AppFooter from '@/components/AppFooter.vue'
import AppHeader from '@/components/AppHeader.vue'
import AppSidebar from '@/components/AppSidebar.vue'
</script>

<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CContainer class="px-xxl-0" xxl>
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
