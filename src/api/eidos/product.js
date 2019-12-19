/*
 * @Description: devplatform -> message
 * @Author: wangyun
 * @Date: 2019-09-10 15:07:27
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-10 15:07:54
 */
import request from '@/utils/request'

export function productList(params) { // 产品列表查询
  return request({
    url: '/apiUrl/api/eidos_mining/period_configuration/list',
    method: 'post',
    data: params
  })
} // config/detail

export function productAllList(params) { // 所有产品列表查询
  return request({
    url: '/apiUrl/api/eidos_mining/period_configuration/list_all',
    method: 'get',
    data: params
  })
} // config/detail

export function detailProduct(params) { // 挖矿产品详情
  return request({
    url: '/apiUrl/api/eidos_mining/period_configuration/detail',
    method: 'post',
    data: params
  })
} // config/detail

export function addProduct(params) { // 添加挖矿产品
  return request({
    url: '/apiUrl/api/eidos_mining/period_configuration/add',
    method: 'post',
    data: params
  })
} // config/detail

export function editProduct(params) { // 修改挖矿产品
  return request({
    url: '/apiUrl/api/eidos_mining/period_configuration/edit',
    method: 'post',
    data: params
  })
} // config/detail

// export function editEidos(params) { // 编辑矿机
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/edit',
//     method: 'post',
//     data: params
//   })
// } // config/detail

