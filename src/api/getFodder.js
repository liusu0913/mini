import http from '@/libs/request'

export default {
  getFodderList(data) {
    return http.request({
      url: '/get/fodder/list',
      method: 'post',
      data
    })
  },
  getFodderTab(params) {
    return http.request({
      url: '/get/fodderTab',
      method: 'get',
      params
    })
  },
  getTabTags(params) {
    return http.request({
      url: '/get/tab/tags',
      method: 'get',
      params
    })
  }
}
