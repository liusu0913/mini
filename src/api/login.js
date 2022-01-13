import http from '@/libs/request'

export default {
  login(data) {
    return http.request({
      url: '/mini/login/login',
      method: 'post',
      data
    })
  },
  sendSms(data) {
    return http.request({
      url: '/mini/login/sendSms',
      method: 'post',
      data
    })
  }
}
