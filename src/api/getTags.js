import http from '@/libs/request'

export default {
  list(data) {
    return http.request({
      url: '/mini/tags/list',
      method: 'post',
      data
    })
  }
}

