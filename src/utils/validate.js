/*
 * @Description: 常用函数
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 14:15:36
 */

export function isvalidUsername(str) {
  const valid_map = ['admin', 'editor', 'test', 'test1']
  return valid_map.indexOf(str.trim()) >= 0
}

/* 合法uri*/
export function validateURL(textval) {
  const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/* 柚子街分类*/
export function getCotery(data, arr = [], list = 1, id) {
  data.map(i => {
    if (i.children && i.children.length > 0) {
      getCotery(i.children, arr, list + 1, i.id)
    }
    const obj = Object.assign({}, i)
    delete obj.children
    obj.list = list
    obj.parentId = id || i.id
    arr.push(obj)
  })
  arr.sort((a, b) => {
    if (a.parentId === b.parentId) return a.list - b.list
    return b.parentId - a.parentId
  })
  return arr
}

/* 商品添加分类*/
export function getCoteryDilt(data) {
  data.forEach(i => {
    if (i.children.length > 0) {
      getCoteryDilt(i.children)
    } else {
      delete i.children
    }
  })
  return data
}

export function rp(n) {
  var cnum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  var s = ''
  n = '' + n // 数字转为字符串
  for (var i = 0; i < n.length; i++) {
    s += cnum[parseInt(n.charAt(i))]
  }
  return s
}

// 给sessionStorage存值(已放到mixin)
export function setContextData(key, value) {
  if (typeof value == "string") {
    window.sessionStorage.setItem(key, value)
  } else {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }
}

// 从sessionStorage取值(已放到mixin)
export function getContextData(key) {
  const str = window.sessionStorage.getItem(key)
  if (typeof str == "string") {
    try {
      return JSON.parse(str)
    } catch (e) {
      return str
    }
  }
  return
}

export function checkSort(rule, value, callback) {
  const Rex = /^([0-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
  if (!value && value != 0) {
    return callback(new Error('请填入排序'))
  } else {
    if (!Rex.test(value)) {
      return callback(new Error('排序必须是数字值且不能小于0'))
    }
  }
}


