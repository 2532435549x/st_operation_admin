/*
 * @Description: api -> circleModule -> bannerTop
 * @Author: wangyun
 * @Date: 2019-09-02 11:20:54
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-02 11:22:55
 */
import request from '@/utils/request'

export function getBannerTopList(data) {
  return request({
    url: '/apiUrl/api/community/banner/list',
    method: 'post',
    data
  })
}

export function addBannerTop(data) {
  return request({
    url: '/apiUrl/api/community/banner/add',
    method: 'post',
    data
  })
}

export function editBannerTop(data) {
  return request({
    url: '/apiUrl/api/community/banner/edit',
    method: 'post',
    data
  })
}

export function deleteBannerTop(data) {
  return request({
    url: '/apiUrl/api/community/banner/delete',
    method: 'post',
    data
  })
}