import http from '@/libs/request'
import { update } from 'lodash'

export default {
  info() {
    return http.request({
      url: '/mini/user/info',
      method: 'post'
    })
  },
  update(data) {
    return http.request({
      url: '/mini/user/update',
      method: 'post',
      data
    })
  }
}
