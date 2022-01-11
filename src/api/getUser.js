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
      url: '/mini/wxuser/info',
      method: 'post',
      data
    })
  },
  activeHistroy(data) {
    return http.request({
      url: '/mini/wxuser/visitHistroy',
      method: 'post',
      data
    })
  }
}
