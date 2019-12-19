/*
 * @Description: axios
 * @Author: wangyun
 * @LastEditTime: 2019-11-28 16:33:21
 */
import axios from 'axios'
import { Message, MessageBox, Loading } from 'element-ui'
import router from '@/router'
import store from '../store'
import { getToken } from '@/utils/auth'
import qs from 'qs'

const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 10000
})
let loadingInstance

// qs格式化白名单
const witeUrl = ['/apiUrl/api/tweet/add', '/apiUrl/api/tweet/edit',
  '/miningUrl/dashboard/api/monitor/mining/sendProfit', '/apiUrl/api/eosmall/file/ue/uploadImage', '/apiUrl/api/eosmall/file/uploadImage', '/mindkingUrl/api/answer/game/question/add', '/mindkingUrl/api/answer/game/question/update', '/mindkingUrl/api/answer/game/list/add', '/mindkingUrl/api/answer/game/list/update', '/mindkingUrl/api/answer/game/question/game/add', '/mindkingUrl/api/answer/game/question/game/del', '/turntableUrl/api/turntable/prize/update', '/turntableUrl/api/turntable/prize/add', '/turntableUrl/api/turntable/prize/game/update'
]
service.interceptors.request.use(
  config => {
    if (!config.notLoading) {
      loadingInstance = Loading.service({
        lock: true,
        text: '拼命加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
    }
    // 对发收益的接口单独处理
    if (config.url == '/apiUrl/api/eidos_mining/profit_issue_record/issue_profit') {
      config.timeout = 30000
    }
    if (config.data) {
      if (witeUrl.indexOf(config.url) < 0) {
        config.data = qs.stringify(config.data, { arrayFormat: 'indices', allowDots: true }) // 序列化请求参数
      }
    }
    if (store.getters.token) {
      // config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    setTimeout(() => {
      if (loadingInstance) loadingInstance.close()
    }, 200)
    console.log(error)
    Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    setTimeout(() => {
      if (loadingInstance) loadingInstance.close()
    }, 200)

    let error = ''
    const res = response.data

    // 对文件流进行处理
    if (response.config.responseType && response.config.responseType == 'blob') {
      return res
    }

    if (res.code === 1000) {
      return response.data
    } else if (res.code === 4001) {
      error = '您没有此功能访问及操作权限'
      Message.warning(error)

      return Promise.reject(error)
    } else if (res.code == 4002 || res.code == -4002) {
      error = '登录失败'
      Message.warning(error)

      return Promise.reject(error)
    } else if (res.code == 4003 || res.code == -4003) {
      error = ' 登录已过期，请重新登录'
      Message.warning(error)
      router.currentRoute.path != '/login' && setTimeout(() => {
        store.dispatch('resetToken').then(() => {
          window.location.reload()
        })
      }, 1000)
    } else if (res.code === -9999 || res.code === 9999) {
      error = '系统故障，请稍后再试'
      Message.warning(error)

      return Promise.reject(error)
    } else {
      Message({
        message: res.message,
        type: 'error',
        duration: 5 * 1000
      })

      return Promise.reject(res.message)
    }
  },
  error => {
    setTimeout(() => {
      loadingInstance.close()
    }, 200)
    console.log('err' + error)
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
