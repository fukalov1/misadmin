import { ref } from 'vue'
import { defineStore } from 'pinia'
import { deleteCookie } from '@/helpers/cookie'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    errorAuth: null,
    token: '',
    role: null,
    roles: null,
    user: {}
  }),
  getters: {
    isLoggedInAndHasToken({isLoggedIn, token}) {
      return isLoggedIn && token
    },
    isErrorAuth(errorAuth) {
      return errorAuth
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
      this.roles = null
      deleteCookie('api_token')
      delete localStorage.user_roles
      delete localStorage.user_id
      document.location = '/'
    },
    setRole(_role) {
      this.role = _role
    },
    setUser(_user) {
      this.user = _user
      this.roles = _user.roles
    },
    setErrorAuth(error) {
      this.errorAuth = error
    }
  }
})

