// @ts-ignore
import { deleteCookie, getCookie } from '@/helpers/cookie'
// @ts-ignore
import axios from 'axios'
// @ts-ignore
import router from '@/router'

const state = {
  status: '',
  token: getCookie('api_token') || '',
  authRequested: false,
  authRequestedType: 'email',
  error: ''
}

const getters = {
  status: state => state.status,
  error: state => state.error,
  isAuthenticated: state => !!state.token,
  authRequested: state => state.authRequested,
  authRequestedType: state => state.authRequestedType,
  authUserType: state => state.authUserType
}

const actions = {
  SET_AUTH_STATUS: (context, data) => {
    context.commit('SET_AUTH_STATUS', data)
  },
  AUTH_CONFIRM: (context, data) => {
    context.commit('AUTH_AUTO_CONFIRM', data)
    router.push({ name: 'Home' })
  },
  AUTH_CONFIRM_ACT: (context, data) => {
    // console.log('AUTH_CONFIRM_ACT', data);
    context.commit('AUTH_AUTO_CONFIRM', data.token)
    router.push({ name: 'Acts', params: {act: data.act, user_id: data.user_id} })
  },
  AUTH_CONFIRM_PAGE: (context, data) => {
    // console.log('AUTH_CONFIRM_ACT', data);
    context.commit('AUTH_AUTO_CONFIRM', data.token)
    let page = data.page;
    page = page.charAt(0).toUpperCase() + page.slice(1);
    router.push({ name: page })
  },
  AUTH_CANCEL: (context) => {
    context.commit('AUTH_CANCEL')
  },
  AUTH_LOGOUT: (context) => {
    deleteCookie('api_token')
    router.push('/')
    context.commit('AUTH_LOGOUT')
    window.location.reload()
  },
  AUTH_ERROR: (context, error) => {
    deleteCookie('api_token')
    context.commit('AUTH_ERROR', error)
  }
}

const mutations = {
  SET_AUTH_STATUS: (state, data) => {
    state.status = data
  },
  AUTH_AUTO_CONFIRM: (state, token) => {
    state.status = 'auth-success'
    state.token = token
    state.authRequested = true
    axios.defaults.headers.common.Authorization = `Bearer ${token}`
  },
  AUTH_CANCEL: (state) => {
    state.status = ''
    state.authRequested = false
  },
  AUTH_LOGOUT: (state) => {
    state.status = 'logout'
    state.token = ''
  },
  AUTH_ERROR: (state, error) => {
    state.status = 'error'
    state.error = error
    state.token = ''
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
