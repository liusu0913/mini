import http from '@/libs/request'

export default {
  list(data) {
    return http.request({
      url: '/mini/wxuser/list',
      // url: '/get/user/list',
      method: 'post',
      data
    })
  },
  getUserTags(data) {
    return http.request({
      url: '/mini/activeUsers/tags',
      method: 'post',
      data
    })
  },
  recommend(data) {
    return http.request({
      url: '/mini/activeUsers/recommend',
      method: 'post',
      data
    })
  },
  regular(data) {
    return http.request({
      url: '/mini/activeUsers/regular',
      method: 'post',
      data
    })
  },
  share(data) {
    return http.request({
      url: '/mini/activeUsers/share',
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
