/*
 * @Description: api -> findModule -> banner
 * @Author: wangyun
 * @Date: 2019-08-15 16:10:36
 * @LastEditTime: 2019-09-05 17:07:52
 */

import request from '@/utils/request'

export function getBannerList(data) {
  return request({
    url: '/apiUrl/api/banner/list',
    method: 'post',
    data
  })
}

export function addBanner(data) {
  return request({
    url: '/apiUrl/api/banner/add',
    method: 'post',
    data
  })
}

export function editBanner(data) {
  return request({
    url: '/apiUrl/api/banner/edit',
    method: 'post',
    data
  })
}

export function deleteBanner(data) {
  return request({
    url: '/apiUrl/api/banner/delete',
    method: 'post',
    data
  })
}
