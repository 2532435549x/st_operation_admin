/*
 * @Description: circle
 * @Author: wangyun
 * @Date: 2019-11-21 11:43:13
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-21 15:44:01
 */
const circle = {
  state: {
    fieldType: '',
    cachePageNum: null
  },
  mutations: {
    setCachePageNum(state, payload) {
      state.cachePageNum = payload.cachePageNum,
        state.fieldType = payload.fieldType
    }
  }
}

export default circle