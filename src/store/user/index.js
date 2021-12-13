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
      name: 'fesuliu',
      img: 'https://rocket-dev.woa.com/images/rocket.png',
      title: '前端开发工程师',
      phone: '15811240124'
    },
    isLogin: false
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
