import http from '@/libs/request'

export default {
  login(data) {
    return http.request({
      url: '/user/login',
      method: 'post',
      data
    })
  }
}
