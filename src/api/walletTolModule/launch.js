/*
 * @Description: api -> walletTolModule -> launch
 * @Author: wangyun
 * @Date: 2019-09-12 17:28:09
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 12:00:30
 */
import request from '@/utils/request'

/**
 * @description: Advert apis
 */

export function getAdvertList(data) {
  return request({
    url: '/apiUrl/api/advert/list',
    method: 'post',
    data
  })
}

export function addAdvert(data) {
  return request({
    url: '/apiUrl/api/advert/add',
    method: 'post',
    data
  })
}

export function editAdvert(data) {
  return request({
    url: '/apiUrl/api/advert/edit',
    method: 'post',
    data
  })
}

export function deleteAdvert(data) {
  return request({
    url: '/apiUrl/api/advert/delete',
    method: 'post',
    data
  })
}


/**
 * @description: Guide apis
 */