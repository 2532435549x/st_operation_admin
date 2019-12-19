/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-09-02 10:38:25
 */
import {
  login,
  logout,
  getInfo,
  getQuanXian
} from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  removeTokenAuth
} from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    name: 'test',
    avatar: '',
    roles: ['admin']
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // remove token
    resetToken({
      commit
    }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve()
      })
    },

    // 登录
    Login({
      commit
    }, userInfo) {
      const username = userInfo.username.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password).then(response => {
          const data = response.data
          setToken(data)
          commit('SET_TOKEN', data)
          commit('SET_NAME', data.userName)
          commit('SET_AVATAR', data.userAvatar)
          resolve(response.data)
        }).catch(error => {
          reject(error)
          console.log(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getQuanXian().then(response => {
          const data = response.data
          commit('SET_NAME', data.userDetail.userName)
          commit('SET_ROLES', data.userDetail.roleName)
          resolve(data)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      removeTokenAuth()
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    // FedLogOut({ commit }) {
    //   return new Promise(resolve => {
    //     commit('SET_TOKEN', '')
    //     removeToken()
    //     resolve()
    //   })
    // }
  }
}

export default user
