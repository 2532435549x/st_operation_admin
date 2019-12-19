import request from '@/utils/request'

export function uploadImg() { // 图片上传
  return request({
    url: '/apiUrl/api/common/uploadImage',
    method: 'post'
  })
} // uploadImg
