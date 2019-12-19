/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-08-21 18:41:02
 * @LastEditTime: 2019-08-21 18:45:47
 */
const find = {
  state: {
    checkedList: []
  },
  mutations: {
    getCheckedList(state, payload) {
      state.checkedList.concat(payload)
    }
  },
  actions: {
  }
}

export default find