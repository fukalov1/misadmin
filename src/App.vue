<script setup>
import { storeToRefs } from 'pinia'
import { onBeforeMount, watch } from 'vue'
import { useColorModes } from '@coreui/vue'
import router from '@/router'
import axios from 'axios'

import { useThemeStore } from '@/stores/theme.js'
import { useUserStore } from '@/stores/user.js'

const { isColorModeSet, setColorMode } = useColorModes(
  'coreui-free-vue-admin-template-theme',
)
const currentTheme = useThemeStore()
const currentUser = useUserStore()
const { isLoggedIn } = storeToRefs(currentUser)

onBeforeMount(() => {
  // console.log('start app auth=', isLoggedIn)
  const urlParams = new URLSearchParams(window.location.href.split('?')[1])
  let theme = urlParams.get('theme')

  if (theme !== null && theme.match(/^[A-Za-z0-9\s]+/)) {
    theme = theme.match(/^[A-Za-z0-9\s]+/)[0]
  }

  if (theme) {
    setColorMode(theme)
    return
  }

  if (isColorModeSet()) {
    return
  }

  setColorMode(currentTheme.theme)

})

watch(isLoggedIn, () => {
  // console.log('wathces is loggin ',isLoggedIn)
  if (isLoggedIn) {
    router.push({path: '/dashboard'})
  }
})

</script>

<template>
  <router-view />
</template>

<style lang="scss">
// Import Main styles for this application
@import 'styles/style';
// We use those styles to show code examples, you should remove them in your application.
@import 'styles/examples';
</style>
