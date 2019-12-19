/*
 * @Description: 打卡签到
 * @Author: wangyun
 * @Date: 2019-11-23 11:21:20
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-23 17:42:32
 */
import request from '@/utils/request'

// 获取打卡签到列表
export function getPunchList(params) {
  return request({
    url: '/apiUrl/api/community/sign/score/list',
    method: 'get',
    params
  })
}

// 获取打卡签到配置列表
export function getPunchSetList(params) {
  return request({
    url: '/apiUrl/api/community/sign/score/config/list',
    method: 'get',
    params
  })
}

export function addPunchSet(data) {
  return request({
    url: '/apiUrl/api/community/sign/score/config/add',
    method: 'post',
    data
  })
}

export function editPunchSet(data) {
  return request({
    url: '/apiUrl/api/community/sign/score/config/edit',
    method: 'post',
    data
  })
}

export function deletePunchSet(data) {
  return request({
    url: '/apiUrl/api/community/sign/score/config/delete',
    method: 'post',
    data
  })
}

