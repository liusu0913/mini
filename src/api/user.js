import http from '@/libs/request'

export default {
  info() {
    return http.request({
      url: '/mini/user/info',
      method: 'post'
    })
  },
  update(data, ...res) {
    console.log(...res)
    return http.request({
      url: '/mini/user/update',
      method: 'post',
      data,
      ...res
    })
  }
}
