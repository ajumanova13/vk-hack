import Vue from 'vue'
import Vuex from 'vuex'
import { SET_INFO, SET_EVENT, SET_FILTERS } from '../common/mutation-types'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    info: null,
    event: null,
    raw_api_result: null,
    filters: null
  },
  mutations: {
    [SET_INFO] (state, newInfo) {
      if (state.info === null) {
        state.info = newInfo
        state.raw_api_result = newInfo.api_result
        state.info.api_result = JSON.parse(state.info.api_result).response[0]
      }
    },
    [SET_EVENT] (state, newEvent) {
      state.event = newEvent
    },
    [SET_FILTERS] (state, newFilters) {
      state.filters = newFilters
    }
  }
})

export default store
