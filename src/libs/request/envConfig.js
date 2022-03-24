const defaultEnv = 'development'
const envUrlMap = {
  mock: {
    url: 'http://localhost:3000/api',
    apis: []
  },
  development: {
    // url: 'https://marketing-tech.cn/api',
    url: 'http://localhost:3000/api',
    apis: []
  },
  production: {
    url: 'https://marketing-tech.cn/api',
    // url: 'http://localhost:3000/api',
    apis: []
  }
}
module.exports = {
  envUrlMap,
  defaultEnv
}
