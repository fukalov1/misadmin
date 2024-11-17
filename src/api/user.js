import axios from 'axios'
import {useUserStore} from '@/stores/user.js'
import { getCookie } from '@/helpers/cookie'

export function USER_REQUEST (data) {
  // (async () => {
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  const currentUser = useUserStore()
  axios.post('/api/user', data).then((response) => {
    if (response.data.success === true) {
      console.log('Set user', response.data)
      currentUser.setUser(response.data.user)
      }
  }).catch(error => {
      // currentUser.login('testtoken')
  })
  // })

}
