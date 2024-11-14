// import axios from 'axios'

const state = {
  user: {},
  worker: null,
  user_type: 1,
  roles: [1],
  billing: 0
}

const getters = {
  user: state => state.user,
  worker: state => state.worker,
  user_type: state => state.user_type,
  roles: state => state.roles,
  billing: state => state.billing
}

const actions = {
  SET_USER (context, data) {
    context.commit('SET_USER', data)
  },
  SET_WORKER (context, data) {
    context.commit('SET_WORKER', data)
  },
}

const mutations = {
  SET_USER (state, data) {
    state.user = data;
    state.billing = data.partner.billing;
    state.user_type = data.partner.type_distribution;
    state.roles = data.roles.map((item) => item.id);
  },
  SET_WORKER (state, data) {
    state.worker = data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
