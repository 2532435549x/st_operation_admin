import request from '@/utils/request'

export function dictionaryData(params) { // 字典列表
  return request({
    url: '/apiUrl/api/dictionaryData/list',
    method: 'post',
    data: params
  })
} // dictionaryData

export function editDictData(params) { // 编辑列表
    return request({
      url: '/apiUrl/api/dictionaryData/editDictData',
      method: 'post',
      data: params
    })
  } // editDictData
  