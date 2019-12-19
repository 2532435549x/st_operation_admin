/*
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-10-23 11:04:42
 */
import request from '@/utils/request'

export function login(userName, userPass) {
  return request({
    url: '/apiUrl/api/user/login',
    method: 'post',
    data: {
      userName,
      userPass
    },
    notLoading: true
  })
}

export function getInfo() {
  return request({
    url: '/apiUrl/api/getUserInfo',
    method: 'get',
    notLoading: true
  })
}

export function logout() {
  return request({
    url: '/apiUrl/api/user/logout',
    method: 'get',
    notLoading: true
  })
}

export function creatCode() {
  return request({
    url: '/apiUrl/api/user/2fa/generatorTotpSecret',
    method: 'post',
    notLoading: true
  })
}

export function secondaryLogin(params) {
  return request({
    url: '/apiUrl/api/user/2fa/secondaryLogin',
    method: 'post',
    data: params,
    notLoading: true
  })
}

// 获取当前用户权限列表
export function getQuanXian(params) {
  return request({
    url: '/apiUrl/api/permission/getUserPermission',
    method: 'post',
    data: params,
    notLoading: true
  })
}
