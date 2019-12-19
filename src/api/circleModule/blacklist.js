/*
 * @Description: api -> circleModule -> blacklst
 * @Author: wangyun
 * @Date: 2019-08-30 21:27:49
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-18 14:07:05
 */
import request from '@/utils/request'


// 获取小黑屋列表
export function getblackList(data) {
  return request({
    url: '/apiUrl/api/community/black/list/list',
    method: 'post',
    data
  })
}

// 关进小黑屋
export function shutInBlackroom(data) {
  return request({
    url: '/apiUrl/api/community/black/list/pull',
    method: 'post',
    data
  })
}

// 移出小黑屋
export function shutOutBlackroom(data) {
  return request({
    url: '/apiUrl/api/community/black/list/cancel/pull',
    method: 'post',
    data
  })
}

// 获取用户小黑屋状态
export function getUserBlackState(data) {
  return request({
    url: '/apiUrl/api/community/black/list/black/info',
    method: 'post',
    data
  })
}

// 获取拉黑原因
export function getComplaintReason(data) {
  return request({
    url: '/apiUrl/api/common/getDictDataByDictName',
    method: 'post',
    data
  })
}