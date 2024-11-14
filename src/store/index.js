import {createStore} from 'vuex'

const useStore = createStore({
  state: {
    auth: [
      { status: '', token: '', authRequested: false }
    ]
  },
  getters: {
    getAuth (state) {
      return state.auth
    }
  }
})
