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
      name: '',
      avatar: '',
      title: '',
      phone: ''
    },
    isLogin: !!uni.getStorageSync('mini_token')
  },
  mutations: {
    setUserInfo(state, info) {
      if (!info.avatar) {
        info.avatar = "https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/avator.png"
      }
      if (info.name) {
        state.info = info
        state.isLogin = true
      }
    },
    updateUserInfo(state, info) {
      state.info = {
        ...state.info,
        ...info
      }
    },
    setUserLogin(state, isLogin) {
      state.isLogin = isLogin
    }
  }
}
