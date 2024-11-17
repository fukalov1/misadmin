import axios from 'axios'
import {useUserStore} from '@/stores/user.js'
import { setCookie, deleteCookie } from '@/helpers/cookie'
import { USER_REQUEST } from '@/api/user'

export function AUTH_REQUEST (data) {
  // (async () => {
    const currentUser = useUserStore()
    axios.post('/api/login', data).then((response) => {
      if (response.data.success === true) {
        setCookie('api_token', response.data.api_token, { expires: 3600 * 24 * 365 })
        currentUser.login(response.data.api_token)
        // USER_REQUEST()
        console.log('Set headers', axios.defaults.headers.common.Authorization)
      }
      else {
        // store.dispatch('AUTH_ERROR', response.data.errors)
      }
    }).catch(error => {
      // currentUser.login('testtoken')
      console.log('error', currentUser.isLoggedIn);
    })
  // })

}
