import http from '@/libs/request'

export default {
  getRank() {
    return http.request({
      url: '/get/ranking',
      method: 'get'
    })
  },
  getNewAdd() {
    return http.request({
      url: '/get/newAdd',
      method: 'get'
    })
  },
  getSopTips() {
    return http.request({
      url: '/sop/tips',
      method: 'get'
    })
  },
  getFriendTips() {
    return http.request({
      url: '/friend/tips',
      method: 'get'
    })
  }

}
