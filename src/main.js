import Vue from 'vue'
import Router from 'vue-router'
import Vuex from 'vuex'
import App from './App.vue'
import lotteryConfigFunc from './lotteryConfig'

Vue.use(Vuex)
Vue.use(Router)

const router = new Router({ routes: [] })
const store = new Vuex.Store({})
lotteryConfigFunc(Vue, store, router)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
