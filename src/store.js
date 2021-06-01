
import { toast } from './util/tools'
// import lotteryData from './data/lotteryData' // 本地保存的彩票赔率信息简化版数据
import { getToken, setToken, setSiteCode, setRequstInfo, getUrl, setLotteryList, getLotteryList, getLotteryData, setLotteryData, setCurrentLottery, getCurrentLottery } from './util/cach'
import { getGameList, queryOddsByCode, getChartList, getDewdropList } from './api/interface'
import { list, baselist } from './data/data'
export const lotteryList = getLotteryList() || list
export default {
  namespaced: true,
  state: {
    userInfo: {},
    lotteryList,
    currentLottery: getCurrentLottery() || {},
    openInfo: {},
    lotteryData: '',
    betData: [],
    isReset: 0,
    sealTime: [],
    status: '封盘',
    url: getUrl(),
    history: {}
  },
  getters: {
    lotterys(state) { // 将后台返回的彩票树扁平化成一维数组
      return state.lotteryList.reduce((ac, _) => ac.concat(_.children), [])
    }
  },
  mutations: {
    setUrl(state, val) {
      state.url = val
    },
    setHistory(state, val) {
      state.history = val
    },
    setStatus(state, val) {
      state.status = val
    },
    setSealTime(state, val) {
      state.sealTime = val
    },
    setIsReset(state, val) {
      state.isReset = val
    },
    setBetData(state, val) {
      state.betData = val
    },
    setOpenInfo(state, val) {
      state.openInfo = val
    },
    setUserInfo(state, val) {
      state.userInfo = val
    },
    setLotteryList(state, val) {
      setLotteryList(val)
      state.lotteryList = val
    },
    setLotteryData(state, val) {
      state.lotteryData = val
    },
    setCurrentLottery(state, val) {
      setCurrentLottery(val)
      state.currentLottery = val
    }
  },
  actions: {
    initLottery({ commit }, params) { // 获取彩种列表
      const { siteCode, token } = params
      setToken(token || '$2y$10$FMWa7Q.1/m0d5UadxMeq2ul04nkYMNGaMtex0ktndWwoukv5VHU9a')
      setSiteCode(siteCode)
      setRequstInfo(params)
      return getGameList().then(res => {
        if (Array.isArray(res)) {
          res.forEach(_ => {
            const item = baselist.find(i => i.code === _.typeid)
            if (item) item.children.push(_)
            _.path = _.typeid + '/' + _.name // 储存父级的code 用于后台传参
            _.fcode = _.typeid // 储存父级的code 用于后台传参
            _.lcode = _.name // 本地化code 用于添加类名 写样式
            _.icode = _.name // 前端处理后生成列表的父级code
            _.code = _.name // 前端处理后生成列表的父级code
            _.label = _.title // 前端处理后生成列表的父级code
            _.url = process.env.VUE_APP_LOTTERY_BASE_API + _.iconUrl // 前端处理后生成列表的父级code
          })
          commit('setLotteryList', baselist)
          return baselist
        } else {
          toast()
          return []
        }
      })
    },
    async getLotteryData({ commit, state }, { code, fcode }) { // 获取并设置赔率
      // const storeDate = lotteryData[lcode].map(_ => { const [playCode, typeCode] = _.split(' '); return { playCode, typeCode } })
      // commit('setLotteryData', storeDate)
      if (getToken()) {
        const data = getLotteryData(code) || await queryOddsByCode({ typeid: fcode }).then(res => {
          if (Array.isArray(res)) {
            setLotteryData(code, res)
            return res
          } else toast('网络不给力！', false, 5000)
        })
        data && state.currentLottery.code === code && commit('setLotteryData', data)
      }
    },
    getGameList({ state, commit }) { // 获取历史开奖和走珠信息
      const { code: lotteryCode, lcode } = state.currentLottery
      const par = { pageNumber: 1, pageSize: 20, lotteryCode }
      let hasDrop = ['c11x5', 'pk10', 'ssc', 'klsf'].includes(lcode) // 判断彩种是否有走珠信息
      commit('setHistory', { historyList: [], lcode, dropList: hasDrop ? 1 : '' })
      if (hasDrop) {
        Promise.all([getChartList(par), getDewdropList({ lotteryCode })]).then(res => {
          if (res) commit('setHistory', { historyList: res[0].list, dropList: res[1], lcode })
        })
      } else {
        getChartList(par).then(res => {
          if (res) commit('setHistory', { historyList: res.list, lcode })
        })
      }
    }
  }
}
