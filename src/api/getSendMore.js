import http from '@/libs/request'

export default {
  getSendMoreMsg(data) {
    return http.request({
      url: '/mini/activeRemind/list',
      method: 'post',
      data
    })
  }
}
