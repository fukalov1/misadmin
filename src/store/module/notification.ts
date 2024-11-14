// import axios from 'axios'

const state = {
  contracts: {},
  cars: {},
  orders: {}
}

const getters = {
  notificationContracts: state => state.contracts,
  notificationCars: state => state.cars,
  notificationOrders: state => state.orders
}

const actions = {
  SET_NOTIFICATION_CONTRACTS (context, data) {
    context.commit('SET_NOTIFICATION_CONTRACTS', data)
  },
  SET_NOTIFICATION_CARS (context, data) {
    context.commit('SET_NOTIFICATION_CARS', data)
  },
  SET_NOTIFICATION_ORDERS (context, data) {
    context.commit('SET_NOTIFICATION_ORDERS', data)
  }
}

const mutations = {
  SET_NOTIFICATION_CONTRACTS (state, data) {
    state.contracts = data
  },
  SET_NOTIFICATION_CARS (context, data) {
    state.cars = data
  },
  SET_NOTIFICATION_ORDERS (context, data) {
    state.orders = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
