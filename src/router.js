import moreRoutes from './data/moreRoutes' // 利用此数据生成右侧划出列表路由
import { lotteryList } from './store'
import { createRouterFunction, mod } from './util/tools'

export default [
  {
    path: '/login/:token/:username'
  },
  ...createRouterFunction(lotteryList), // 初始化时用彩种列表生成彩票路由
  { // 生成右侧划出列表路由
    path: mod + '/more',
    component: () => import('./components/more/index.vue'),
    children: moreRoutes.filter(_ => _.to).map(_ => ({
      path: _.to,
      component: () => import('./components/more/' + _.to + '.vue'),
      children: _.children ? _.children.map(i => ({
        path: i.to,
        component: () => import('./components/more/' + i.to + '.vue')
      })) : []
    }))
  }
]
