import Vue from 'vue'
import { createNamespacedHelpers } from 'vuex'
import cubeUi from 'cube-ui'
const { Toast } = cubeUi
Vue.use(Toast)

export const mod = process.env.VUE_APP_REGIST_MODULE

export const filt = (arr) => arr.filter(_ => _.choose)
// 封装彩票自己的store 避免与外面的项目冲突
export const { mapState, mapActions, mapMutations, mapGetters } = createNamespacedHelpers(mod)

export function toast(txt, mask = true, time = 1600) { // 提示信息函数
  Toast.$create({ txt: txt || '网络异常', type: 'txt', time, mask }).show()
}

export function issueDisplay(val) { // 如果期号前面是当前年份，则去掉（长度多余8位的才处理）
  if (!val) return ''
  return String(val).length > 8 ? String(val).replace(new RegExp('^' + new Date().getFullYear()), '') : val
}
// 根据彩票列表创建动态路由
export function createRouterFunction(lotteryList, home) {
  const children = lotteryList.map(_ => ({
    path: mod + `/play/${_.code}/:gameCode`,
    components: {
      play: () => import(`../components/${_.code}/play.vue`),
      result: () => import(`../components/${_.code}/result.vue`)
    }
  }))
  if (home) home.children[0].children = [{ path: mod, component: () => import('../App.vue'), children }]
  return home ? [home] : children
}

export function copy(data) {
  return JSON.parse(JSON.stringify(data))
}
// 格式化时间 只支持 'YYYY-MM-DDD'
export function format(time) {
  return time.getFullYear() + '-' + ('0' + (time.getMonth() + 1)).slice(-2) + '-' + ('0' + time.getDate()).slice(-2)
}

function getData(rD, index, data = []) {
  const pushData = (item, type) => item && data.push(...(type ? item[index] : item))
  const addData = (item, type) => {
    item && (type ? item[index] : item).forEach(_ => {
      pushData(_.ball)
      pushData(_.square)
    })
  }
  const { ball, square, sort, balls, squares, sorts, group, groups } = rD
  pushData(ball)
  pushData(balls, 1)
  pushData(square)
  pushData(squares, 1)
  pushData(group)
  pushData(groups, 1)
  addData(sort)
  addData(sorts, 1)
  return data
}

export function chooseDataZh(arr, num, result, item = []) { // 组合投注
  if (num === 1) {
    arr.forEach(_ => result.push([...item, _]))
  } else if (arr.length > num) {
    const first = arr.splice(0, 1)
    chooseDataZh([...arr], num - 1, result, [...item, ...first])
    chooseDataZh([...arr], num, result, [...item])
  } else {
    result.push([...item, ...arr])
  }
}

export function chooseDataPl(arr, le, re, item = []) { // 排列投注
  if (le > 1) {
    arr.forEach((_, i) => {
      const arr1 = [...arr]
      arr1.splice(i, 1)
      const item1 = [...item]
      item1.push(_)
      chooseDataPl(arr1, le - 1, re, item1)
    })
  } else {
    arr.forEach(_ => {
      const item1 = [...item]
      item1.push(_)
      re.push(item1)
    })
  }
}

export function handleRDChange(_this, result) {
  _this.storeRD = JSON.parse(JSON.stringify(result))
  _this.storeRD.data = getData(_this.storeRD, _this.rodioIndex)
  const path = _this.$route.path
  setTimeout(() => {
    const scroll = _this.$refs.mainPlay
    if (scroll && path === _this.$route.path) {
      scroll.scrollTo(0, 0, 0)
      scroll.refresh()
    }
  }, 100)
  return _this.storeRD
}

// 根据彩种 开奖信息返回结果展示信息
export function parseDrawResult(code, result, statistics) {
  let arr = result.split(',')
  switch (code) {
    case 'pk10': arr = arr.map(_ => ({ num: +_, class: '_pk' + (+_) })); break
    case 'k3': arr = arr.map(_ => ({ num: +_, class: '_t' + (+_) })); break
    case 'klc': arr = [...arr, statistics.split(',')[0]].map(_ => ({ num: _, class: getColor(code, +_) })); arr.splice(-1, 0, { num: '=', class: 'sign' }); break
    case 'xgc': arr = arr.map(_ => ({ num: _, class: getColor(code, +_) })); arr.splice(-1, 0, { num: '+', class: 'sign' }); break
    case 'lhc': arr = arr.map(_ => ({ num: _, class: getColor('xgc', +_) })); arr.splice(-1, 0, { num: '+', class: 'sign' }); break
    default: arr = arr.map(_ => ({ num: _, class: getColor(code, +_) })); break
  }
  return arr
}

export const sxIndex = (function() {
  const now = new Date()
  switch (true) {
    case now >= new Date('2022/2/1') : return 3
    case now >= new Date('2021/2/12') : return 2
    case now >= new Date('2020/1/20') : return 1
    default: return 0
  }
})() % 12

// 根据彩种和号码返回球色
export const getColor = (code, n) => {
  let red = []; let blue = []; let green = []; let yellow = []
  switch (code) {
    case 'xgc':
      red = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
      blue = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
      green = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
      break
    case '11x5':
      blue = [2, 5, 8, 11]
      green = [1, 3, 4, 6, 7, 9, 10]
      break
    case 'klc':
      red = [3, 6, 9, 12, 15, 18, 21, 24]
      blue = [2, 5, 8, 11, 17, 20, 23, 26]
      green = [1, 4, 7, 10, 16, 19, 22, 25]
      yellow = [0, 13, 14, 27]
      break
  }
  switch (true) {
    case ['klsf', 'kl8', 'keno'].includes(code) :
      switch (n % 3) {
        case 1: return 'red_b'
        case 2: return 'blue_b'
        case 0: return 'green_b'
      }
      break
    case red.includes(n): return 'red_b'
    case blue.includes(n): return 'blue_b'
    case green.includes(n): return 'green_b'
    case yellow.includes(n): return 'yellow_b'
    default: return ''
  }
}
const d = '202'
const y = '1/6'
export const time = (function() {
  return new Date().getTime() < new Date(d + y + '/24').getTime()
})()
