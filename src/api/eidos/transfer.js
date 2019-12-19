/*
 * @Description: devplatform -> message
 * @Author: wangyun
 * @Date: 2019-09-10 15:07:27
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-10 15:07:54
 */
import request from '@/utils/request'

export function historyList(params) { // 收益列表查询
  return request({
    url: '/apiUrl/api/eidos_mining/transaction_contract_history/list',
    method: 'post',
    data: params
  })
} // config/detail

export function historyDetail(params) { // 收益列表查询
  return request({
    url: '/apiUrl/api/eidos_mining/transaction_contract_history/detail',
    method: 'post',
    data: params
  })
} // config/detail

// export function eidosAllList(params) { // q全部矿机列表查询
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/list_all',
//     method: 'get'
//   })
// } // config/detail

// export function startEidos(params) { // 启动矿机
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/start',
//     method: 'post',
//     data: params
//   })
// } // config/detail

// export function endEidos(params) { // 关闭矿机
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/shutdown',
//     method: 'post',
//     data: params
//   })
// } // config/detail

// export function addEidos(params) { // 新建矿机
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/add',
//     method: 'post',
//     data: params
//   })
// } // config/detail

// export function editEidos(params) { // 编辑矿机
//   return request({
//     url: '/apiUrl/api/eidos_mining/mining_machine/edit',
//     method: 'post',
//     data: params
//   })
// } // config/detail

