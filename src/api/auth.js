import axios from 'axios'
import {useUserStore} from '@/stores/user.js'
import {useAuthStore} from '@/stores/auth.js'
import { setCookie, deleteCookie } from '@/helpers/cookie'
import { USER_REQUEST } from '@/api/user'

export function AUTH_REQUEST (data) {
  // (async () => {
    const currentUser = useUserStore()
    const currentAuth = useAuthStore()
    axios.post('/api/login', data).then((response) => {
      if (response.data.success === true) {
        setCookie('api_token', response.data.api_token, { expires: 3600 * 24 * 365 })
        currentUser.login(response.data.api_token)
        // USER_REQUEST()
        // console.log('Set headers', axios.defaults.headers.common.Authorization)
      }
      else {
        currentAuth.setErrors(response.data.errors)
        console.log('set errors', response.data.errors)
        // store.dispatch('AUTH_ERROR', response.data.errors)
      }
    }).catch(error => {
      // currentUser.login('testtoken')
      currentAuth.setErrors(error.response.data.errors)
      console.log('set errors', error.response.data.errors)
      console.log('error', currentUser.isLoggedIn);
    })
  // })

}
