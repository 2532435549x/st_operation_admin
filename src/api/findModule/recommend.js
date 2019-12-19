/*
 * @Description: api -> findModule -> recommend
 * @Author: wangyun
 * @Date: 2019-08-15 16:11:22
 * @LastEditTime: 2019-08-16 09:08:02
 */
import request from '@/utils/request'

export function getRecommendList(data) {
  return request({
    url: '/apiUrl/api/boutique/list',
    method: 'post',
    data
  })
}

export function addRecommend(data) {
  return request({
    url: '/apiUrl/api/boutique/add',
    method: 'post',
    data
  })
}

export function editRecommend(data) {
  return request({
    url: '/apiUrl/api/boutique/edit',
    method: 'post',
    data
  })
}

export function deleteRecommend(data) {
  return request({
    url: '/apiUrl/api/boutique/delete',
    method: 'post',
    data
  })
}
