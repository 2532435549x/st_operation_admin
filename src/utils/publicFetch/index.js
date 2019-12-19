/*
 * @Description: public functions
 * @Author: wangyun
 * @Date: 2019-11-28 16:34:59
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-28 16:39:26
 */
import { getChainsList } from '@/api/publicModule'

export async function fetchChainList() {
  let res = await getChainsList()
  if (res) {
    let payload = []
    res.data.forEach(v => {
      let obj = {}
      obj.label = v.description
      obj.value = v.name
      payload.push(obj)
    })
    return { result: true, data: payload }
  }
}