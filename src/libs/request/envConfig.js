const defaultEnv = 'development'
const envUrlMap = {
  mock: {
    url: 'http://localhost:3000/api',
    apis: []
  },
  development: {
    url: 'http://150.158.237.132/api',
    apis: []
  },
  production: {
    url: 'http://150.158.237.132/api',
    apis: []
  }
}
module.exports = {
  envUrlMap,
  defaultEnv
}
