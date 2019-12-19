/*
 * @Description: wallet
 * @Author: wangyun
 * @Date: 2019-11-28 15:47:37
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-28 16:44:55
 */
import {
  fetchChainList
} from '@/utils/publicFetch'

const wallet = {
  state: {
    chainTypeOptions: []
  },
  mutations: {
    SET_CHAINS(state, payload) {
      state.chainTypeOptions = payload
    }
  },
  actions: {
    async setChains({ commit }) {
      let res = await fetchChainList()
      if (res.result) commit('SET_CHAINS', res.data)
    }
  }
}

export default wallet