// import axios from 'axios'

const state = {
  count: 0
}

const getters = {
  process: state => state.count
}

const actions = {
  SET_PROCESS (context, data) {
    context.commit('SET_PROCESS', data)
  }
}

const mutations = {
  SET_PROCESS (state, data) {
    if (state.process+data < 0)
      state.count = 0
    else
      state.count += data
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
