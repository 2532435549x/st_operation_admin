/*
 * @Description: api -> walletTolModule -> market
 * @Author: wangyun
 * @Date: 2019-09-16 11:51:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:59:24
 */
import request from '@/utils/request'

/**
 * @description: MarketChain apis
 */

export function getMarketChainList(data) {
  return request({
    url: '/apiUrl/api/market/chain/type/list',
    method: 'post',
    data
  })
}

export function getMarketChainDetail(data) {
  return request({
    url: '/apiUrl/api/market/chain/type/detail',
    method: 'post',
    data
  })
}

export function addMarketChain(data) {
  return request({
    url: '/apiUrl/api/market/chain/type/add',
    method: 'post',
    data
  })
}

export function editMarketChain(data) {
  return request({
    url: '/apiUrl/api/market/chain/type/edit',
    method: 'post',
    data
  })
}

export function deleteMarketChain(data) {
  return request({
    url: '/apiUrl/api/market/chain/type/delete',
    method: 'post',
    data
  })
}


/**
 * @description: MarketRecommend apis
 */

export function getMarketRecommendList(data) {
  return request({
    url: '/apiUrl/api/market/recommend/list',
    method: 'post',
    data
  })
}

export function getMarketRecommendDetail(data) {
  return request({
    url: '/apiUrl/api/market/recommend/detail',
    method: 'post',
    data
  })
}

export function addMarketRecommend(data) {
  return request({
    url: '/apiUrl/api/market/recommend/add',
    method: 'post',
    data
  })
}

export function editMarketRecommend(data) {
  return request({
    url: '/apiUrl/api/market/recommend/edit',
    method: 'post',
    data
  })
}

export function deleteMarketRecommend(data) {
  return request({
    url: '/apiUrl/api/market/recommend/delete',
    method: 'post',
    data
  })
}