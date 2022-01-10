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
  readSopTips(data) {
    return http.request({
      url: '/mini/remindTime/create',
      method: 'post',
      data
    })
  },
  getSopTips() {
    return http.request({
      url: '/mini/activeRemind/getMsgCount',
      method: 'post'
    })
  },
  getFriendTips() {
    return http.request({
      url: '/friend/tips',
      method: 'get'
    })
  }

}
