import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const isLoggin = ref(true)
  const errors = ref(null)

  const toggleisLoggin = (_isLoggin) => {
    isLoggin.value = _isLoggin
  }

  const role = ref(null)

  const toggleRole = (_role) => {
    role.value = _role
  }

  const setErrors = (_errors) => {
    errors.value = _errors
  }

  return { isLoggin, toggleisLoggin, role, toggleRole, setErrors, errors }
})
