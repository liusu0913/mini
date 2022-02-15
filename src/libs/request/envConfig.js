const defaultEnv = 'development'
const envUrlMap = {
  mock: {
    url: 'http://localhost:3000/api',
    apis: []
  },
  development: {
    url: 'http://119.28.163.231:3000/api',
    apis: []
  },
  production: {
    url: 'https://marketing-tech.cn/api',
    apis: []
  }
}
module.exports = {
  envUrlMap,
  defaultEnv
}
