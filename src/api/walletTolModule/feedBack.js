/*
 * @Description: api -> walletTolModule -> feedBack
 * @Author: wangyun
 * @Date: 2019-11-12 15:49:45
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-12 15:53:06
 */
import request from '@/utils/request'

// 反馈列表
export function getFeedBackList(params) {
  return request({
    url: '/apiUrl/api/feedbackRecord/list',
    method: 'get',
    params
  })
}

// 反馈类型列表
export function getFeedBackTypeList(params) {
  return request({
    url: '/apiUrl/api/feedbackRecord/type/list',
    method: 'get',
    params
  })
}

// 标记已读
export function readFeedBack(data) {
  return request({
    url: '/apiUrl/api/feedbackRecord/read',
    method: 'post',
    data
  })
}
