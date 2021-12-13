import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
const modules = {
}
const storeFiles = require.context('.', true, /\.js$/)
storeFiles.keys().forEach((fileName) => {
  if (fileName !== './index.js') {
    const store = require(`${fileName}`)
    const modleName = fileName.slice(2).split('/')[0]
    modules[modleName] = store.default
  }
})

const state = {
}
const getters = {
}
const mutations = {
}
const actions = {
}

const store = new Vuex.Store({
  modules,
  state,
  mutations,
  getters,
  actions
})

export default store
