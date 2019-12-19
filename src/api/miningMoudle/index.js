/*
* @Description: mining apis
* @Author: wangyun
* @Date: 2019-07-29 15:57:48
 * @LastEditTime: 2019-09-18 14:33:17
*/
import request from '@/utils/request'

export function getProfitList(data) {
  return request({
    url: '/apiUrl/api/monitor/mining/getProfitList',
    method: 'post',
    data,
    notLoading: true
  })
} // 挖矿收益列表记录

export function getProfitDetails(data) {
  return request({
    url: '/apiUrl/api/monitor/mining/getCoins',
    method: 'post',
    data,
    notLoading: true
  })
} // 详情

export function editProfit(data) {
  return request({
    url: '/apiUrl/api/monitor/mining/updateProfit',
    method: 'post',
    data,
    notLoading: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 编辑

export function sendProfit(data) {
  return request({
    url: '/apiUrl/api/monitor/mining/sendProfit',
    method: 'post',
    data,
    notLoading: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })
} // 发放收益