import Request from 'luch-request'

import {
  envUrlMap, defaultEnv
} from '@/libs/request/envConfig'

function errorCreate(msg) {
  const err = new Error(msg)
  errorLog(err)
  throw err
}

// 记录和显示错误
function errorLog(err) {
  // 打印到控制台
  if (process.env.NODE_ENV === 'development') {
    console.error('>>>>>> Error >>>>>>')
    console.log(err)
  }
}

// 创建请求实例
const http = new Request()

// 请求拦截
http.interceptors.request.use(
  (config) => {
    const { header } = config
    config.header = {
      ...header,
      'Authorization': `Bearer ${uni.getStorageSync('mini_token')}`
    }
    const ENV = process.env.NODE_ENV
    let baseUrl = envUrlMap[defaultEnv].url
    // #ifdef H5
    baseUrl = `${window.location.origin}/eyao${defaultEnv}`
    // #endif
    if (ENV === 'production') {
      baseUrl = envUrlMap[ENV].url
    } else {
      Object.keys(envUrlMap).forEach((env) => {
        if (envUrlMap[env].apis.indexOf(config.url) > -1) {
          baseUrl = envUrlMap[env].url
          // #ifdef H5
          baseUrl = `${window.location.origin}/eyao${env}`
          // #endif
        }
      })
    }
    config.baseURL = baseUrl
    return config
  },
  (error) => {
    // 发送失败
    console.error(error)
    Promise.reject(error)
  }
)

// 响应拦截
http.interceptors.response.use(
  (response) => {
    // dataAxios 是 axios 返回数据中的 data
    const dataAxios = response.data
    // 这个状态码是和后端约定的
    let { code, message } = dataAxios
    code = Number(code)
    // 根据 code 进行判断
    if (code === undefined) {
      // 如果没有 code 代表这不是项目后端开发的接口
      errorCreate('未知错误码')
    } else {
      // 有 code 代表这是一个后端接口 可以进行进一步的判断
      switch (code) {
      case 0:
        // [ 示例 ] code === 0 代表没有错误
        return dataAxios.data
      case 1002:
        return dataAxios
      case 43004:
        uni.showToast({
          title: '请关注公众号',
          icon: 'none'
        })
        break
      default:
        if (code) {
          if ([100002, 10004, 10008].includes(code)) {
            uni.showToast({
              title: '登录状态失效，请重新登陆',
              icon: 'none'
            })
            uni.removeStorageSync('mini_token');
            uni.navigateTo({
              url: '/pages/login/index'
            })
          } else {
            uni.showToast({
              title: message,
              icon: 'none'
            })
          }
        } else {
          errorCreate(`${message}: ${response.config.url}`)
        }
        break
      }
    }
  },
  (error) => {
    if (error && error.response) {
      switch (error.response.status) {
      case 400:
        error.message = '请求错误'
        break
      case 401:
        error.message = '未授权，请登录'
        break
      case 403:
        error.message = '拒绝访问'
        break
      case 404:
        error.message = `请求地址出错: ${error.response.config.url}`
        break
      case 408:
        error.message = '请求超时'
        break
      case 500:
        error.message = '服务器内部错误'
        break
      case 501:
        error.message = '服务未实现'
        break
      case 502:
        error.message = '网关错误'
        break
      case 503:
        error.message = '服务不可用'
        break
      case 504:
        error.message = '网关超时'
        break
      case 505:
        error.message = 'HTTP版本不受支持'
        break
      default:
        break
      }
    }
    errorLog(error)
    return Promise.reject(error)
  }
)

export default http
