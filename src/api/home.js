import http from '@/libs/request'

export default {
  getRank() {
    return http.request({
      url: '/mini/visitor/rank',
      method: 'post'
    })
  },
  getNewAdd() {
    return http.request({
      url: '/mini/visitor/visitor',
      method: 'post'
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
  }
}
