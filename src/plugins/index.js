import directives from './directives'
import filters from './filters'

export default {
  install(Vue, options) {
    // 小程序不支持指令
    Object.keys(directives).forEach((key) => {
      Vue.directive(key, directives[key])
    })
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key])
    })
  }
}
