import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggin = ref(true)

  const toggleisLoggin = (_isLoggin) => {
    isLoggin.value = _isLoggin
  }

  const role = ref(null)

  const toggleRole = (_role) => {
    role.value = _role
  }

  return { isLoggin, toggleisLoggin, role, toggleRole }
})
