const defaultEnv = 'development'
const envUrlMap = {
  mock: {
    url: 'http://yapi.qqten.com/mock/94',
    apis: []
  },
  development: {
    url: 'http://120.78.186.180:3000/mock/368/',
    apis: [
      '/get/fodderTab',
      '/get/tab/tags',
      '/get/tab/tags',
      '/get/fodder/list',
      '/get/message'
    ]
  },
  production: {
    url: 'http://yapi.qqten.com/mock/94',
    apis: []
  }
}
module.exports = {
  envUrlMap,
  defaultEnv
}
