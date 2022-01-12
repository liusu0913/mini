const defaultEnv = 'development'
const envUrlMap = {
  mock: {
    url: 'http://localhost:3000',
    apis: [
      '/mini/active/info',
      '/mini/user/update',
      '/common/getCosConfig',
      '/mini/user/info',
      '/mini/wxuser/info',
      '/mini/wxuser/visitHistroy',
      '/mini/activeRemind/getMsgCount',
      '/mini/remindTime/create',
      '/mini/activeRemind/list',
      '/mini/fodder/list', 
      '/mini/tags/list',
       '/mini/active/list', 
       '/mini/active/data']
  },
  development: {
    url: 'http://120.78.186.180:3000/mock/368/',
    apis: []
  },
  production: {
    url: 'http://120.78.186.180:3000/mock/368/',
    apis: []
  }
}
module.exports = {
  envUrlMap,
  defaultEnv
}
