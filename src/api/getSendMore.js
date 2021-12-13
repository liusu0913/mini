import http from '@/libs/request'

export default {
  getSendMoreMsg(data) {
    return http.request({
      url: '/get/message',
      method: 'post',
      data
    })
  }
}
