export default {
  namespaced: true,
  getters: {
    info(state) {
      return state.info
    },
    isLogin(state) {
      return state.isLogin
    }
  },
  state: {
    info: {
      name: '刘先生',
      img: 'https://rocket-dev.woa.com/images/rocket.png',
      title: '前端开发工程师',
      phone: '15811240124'
    },
    isLogin: true
  },
  mutations: {
    setUserInfo(state, info) {
      if (info.name) {
        state.info = info
        state.isLogin = true
      }
    }
  }
}
