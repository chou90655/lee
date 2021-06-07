import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import lotteryConfigFunc from './lotteryConfig'
import createPersistedState from 'vuex-persistedstate'
import './plugins/vant.js'

Vue.use(Vuex)
Vue.use(Router)

const router = new Router({ routes: [] })
const store = new Vuex.Store({ plugins: [createPersistedState({ storage: window.sessionStorage })] })
lotteryConfigFunc(Vue, store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
