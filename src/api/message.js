import request from '@/utils/request'

export function getMeeageList(params) { // 消息列表查询
  return request({
    url: '/apiUrl/api/message/list',
    method: 'post',
    data: params
  })
} // config/detail

export function getMessageDetail(params) { // 获取消息详情
  return request({
    url: '/apiUrl/api/message/detail',
    method: 'post',
    data: params
  })
} // config/detail

export function sendMessage(params) { // 发送消息
  return request({
    url: '/apiUrl/api/message/send',
    method: 'post',
    data: params
  })
} // config/detail
