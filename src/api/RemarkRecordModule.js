import request from '@/utils/request'

export function getremarkRecord(params) { // 数据备注列表查询
  return request({
    url: '/apiUrl/api/remarkRecord/list',
    method: 'post',
    data: params
  })
} // config/detail

export function addRemarkRecord(params) { // 新增数据备注
  return request({
    url: '/apiUrl/api/remarkRecord/add',
    method: 'post',
    data: params
  })
} // config/detail
