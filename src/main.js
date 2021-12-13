import Vue from 'vue'
import App from './App'

import store from './store'
import plugins from './plugins'
import globalMix from './mixins/global'

Vue.config.productionTip = false

Vue.prototype.$store = store

Vue.use(plugins)
Vue.mixin(globalMix)

App.mpType = 'app'

const app = new Vue({
  store,
  ...App
})
app.$mount()
