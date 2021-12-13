import http from '@/libs/request'

export default {
  getActiveList(data) {
    return http.request({
      url: '/get/activeList',
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
  getActiveData(params) {
    return http.request({
      url: '/get/activeData',
      method: 'get',
      params
    })
  }
}
