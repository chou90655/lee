import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import lotteryConfigFunc from './lotteryConfig'

Vue.use(Vuex)

// const router = new Router({ routes: [] })
const store = new Vuex.Store({})
lotteryConfigFunc(Vue, store)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
