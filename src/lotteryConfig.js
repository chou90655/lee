import router from './router'
import store from './store'
import './cube-ui'
import 'amfe-flexible'
import './assets/style/basic.styl'
import './assets/theme/index.styl'
import './assets/theme'
import { icon, heade } from './components/components' // 引入彩票公共组件
import { mod } from './util/tools'
export default (Vue, Store, Router) => {
  Vue.config.productionTip = false
  Vue.use(icon)
  Vue.use(heade)
  Router.addRoutes(router) // 注册彩票路由
  Store.registerModule(mod, store) // 注册彩票store
}
