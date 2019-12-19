/*
 * @Description: api -> circleModule -> report
 * @Author: wangyun
 * @Date: 2019-11-14 17:54:08
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-14 17:56:15
 */
import request from '@/utils/request'

// 获取投诉列表
export function getReportList(data) {
  return request({
    url: '/apiUrl/api/community/complaint/list',
    method: 'post',
    data
  })
}

// 处理投诉
export function handleReportList(data) {
  return request({
    url: '/apiUrl/api/community/complaint/handle',
    method: 'post',
    data
  })
}