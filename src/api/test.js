import http from '@/libs/request'

export default {
  list() {
    return http.request({
      url: '/mpapi/patient/feature/slideshow/list',
      method: 'post',
      data: {
        count: 10,
        disabled: 0,
        envVersion: 'develop',
        isPrivate: 0,
        login_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDkxM2JiNGFlNjllYTZhNDY1OGRhYmU4Njg4NzBmYWQiLCJhcHBpZCI6Ind4NzVhMjA2MDZiYmQ0YTAyZSIsIm9wZW5pZCI6Im9yX1VHNXF2Yy1qSkdjd284M1pLc0xzTDJHT2ciLCJzZXNzaW9uX2tleSI6IldVK3djZ3VDY3lKKytsaFNJcVNwUGc9PSIsImxhc3RMb2dpblRpbWUiOjE2MDUwNjYwODA3OTIsImlhdCI6MTYwNTA2NjA4MCwiZXhwIjoxNjA1MjM4ODgwfQ.hQSMFkOt9nBQY_X3W-t9T_0hOow2_wdIbRyn4r9qAPo',
        offset: 0
      }
    })
  },
  info() {
    return http.request({
      url: '/mpapi/patient/feature/live/list',
      method: 'post',
      data: {
        count: 10,
        disabled: 0,
        envVersion: 'develop',
        login_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMDkxM2JiNGFlNjllYTZhNDY1OGRhYmU4Njg4NzBmYWQiLCJhcHBpZCI6Ind4NzVhMjA2MDZiYmQ0YTAyZSIsIm9wZW5pZCI6Im9yX1VHNXF2Yy1qSkdjd284M1pLc0xzTDJHT2ciLCJzZXNzaW9uX2tleSI6IldVK3djZ3VDY3lKKytsaFNJcVNwUGc9PSIsImxhc3RMb2dpblRpbWUiOjE2MDUwNjYwODA3OTIsImlhdCI6MTYwNTA2NjA4MCwiZXhwIjoxNjA1MjM4ODgwfQ.hQSMFkOt9nBQY_X3W-t9T_0hOow2_wdIbRyn4r9qAPo',
        offset: 0
      }
    })
  },
  create(data) {
    return http.request({
      url: '/api/test/add',
      method: 'post',
      data
    })
  },
  update(data) {
    return http.request({
      url: '/api/test/update',
      method: 'post',
      data
    })
  },
  delete(data) {
    return http.request({
      url: '/api/test/delete',
      method: 'post',
      data
    })
  }
}
