/* eslint-disable no-unused-vars */
import Vue from 'vue'
import Vuex from 'vuex'
import {
  SET_ROLE,
  REMOVE_ROLE,
} from './mutations-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    accountInfo: {
      role: '',
      accountId: -1,
      username: ''
    }
  },
  getters: {
    getRole(state) {
      return state.accountInfo.role ? state.accountInfo.role : localStorage.getItem("role")
    },
  },
  mutations: {
    [SET_ROLE](state, {
      role,
      accountId,
      username
    }) {
      state.accountInfo.role = role
      state.accountInfo.accountId = accountId
      state.accountInfo.username = username
      localStorage.setItem("role", role)
      localStorage.setItem("accountId", accountId)
      localStorage.setItem("username", username)
    },
    [REMOVE_ROLE](state) {
      state.accountInfo.role = ''
      state.accountInfo.accountId = -1
      state.accountInfo.username = ''
      localStorage.clear()
    }
  },
})
