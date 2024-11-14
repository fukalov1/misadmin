import { ref } from 'vue'
import { defineStore } from 'pinia'
import { deleteCookie } from '@/helpers/cookie'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    token: '',
    role: null
  }),
  getters: {
    isLoggedInAndHasToken({isLoggedIn, token}) {
      return isLoggedIn && token
    }
  },
  actions: {
    login(token) {
      this.isLoggedIn = true
      this.token = token
      this.role = 1
    },
    logout() {
      this.isLoggedIn = false
      this.token = null
      this.role = null
      deleteCookie('api_token')
      document.location = '/'
    },
    setRole(_role) {
      this.role = _role
    }
  }
})

