import http from '@/libs/request'

export default {
  list(data) {
    return http.request({
      url: '/get/user/list',
      method: 'post',
      data
    })
  },
  info(data) {
    return http.request({
      url: '/get/user/info',
      method: 'post',
      data
    })
  }
}
