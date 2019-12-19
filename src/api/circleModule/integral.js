/*
 * @Description: api -> circleModule -> integral
 * @Author: wangyun
 * @Date: 2019-09-02 17:14:15
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-14 18:00:40
 */

import request from '@/utils/request'

// 获取积分列表
export function getIntegralConfList(data) {
  return request({
    url: '/apiUrl/api/community/score/config/list',
    method: 'post',
    data
  })
}


// 添加积分
export function addIntegralConf(data) {
  return request({
    url: '/apiUrl/api/community/score/config/add',
    method: 'post',
    data
  })
}

// 编辑积分
export function editIntegralConf(data) {
  return request({
    url: '/apiUrl/api/community/score/config/edit',
    method: 'post',
    data
  })
}


// 删除积分
export function deleteIntegralConf(data) {
  return request({
    url: '/apiUrl/api/community/score/config/delete',
    method: 'post',
    data
  })
}


// 积分管理(列表)
export function getIntegralAwardList(data) {
  return request({
    url: '/apiUrl/api/community/score/award/list',
    method: 'post',
    data
  })
}
