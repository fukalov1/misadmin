import axios from 'axios'
import {useUserStore} from '@/stores/user.js'
import { getCookie } from '@/helpers/cookie'

export function USER_REQUEST (data) {
  const token = getCookie('api_token')
  if (token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  }
  const currentUser = useUserStore()
  axios.post('/api/user', data).then((response) => {
    if (response.data.success === true) {
      localStorage.setItem('user_id', response.data.user.id+'');
      localStorage.setItem('user_roles', JSON.stringify(response.data.user.roles));
      // console.log('Set user', response.data)
      currentUser.setUser(response.data.user)
      }
  }).catch(error => {
  })
}
