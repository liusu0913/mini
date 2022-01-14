import http from '@/libs/request'

export default {
  login(data) {
    return http.request({
      url: '/user/login',
      method: 'post',
      data
    })
  },
  getCosConfig(data) {
    return http.request({
      url: '/common/getCosConfig',
      method: 'post',
      data
    })
  },
  getUnionid(data) {
    return http.request({
      url: '/mini/common/getUnionid',
      method: 'post',
      data
    })
  }
  
}
