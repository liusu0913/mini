import http from '@/libs/request'

export default {
  sendMsg(data) {
    return http.request({
      url: '/admin/msg/sendMsg',
      method: 'post',
      data
    })
  },
  getActiveList(data) {
    return http.request({
      url: '/mini/active/list',
      method: 'post',
      data
    })
  },
  getActiveInfo(data) {
    return http.request({
      url: '/mini/active/info',
      method: 'post',
      data
    })
  },
  getTags(params) {
    return http.request({
      url: '/get/tags',
      method: 'get',
      params
    })
  },
  getActiveData(data) {
    return http.request({
      url: '/mini/active/data',
      method: 'post',
      data
    })
  }
}
