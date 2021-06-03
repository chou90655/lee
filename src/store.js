
import { toast } from './util/tools'
import { setToken, getUrl, setLotteryList, getLotteryList, getLotteryData, setLotteryData, setCurrentLottery, getCurrentLottery } from './util/cach'
import { getGameList, queryOddsByCode, getChartList } from './api/interface'
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
      state.openInfo = { ...val, nextStopTime: +val.remainTime - val.openRemainTime, nextOpenTime: +val.remainTime, nextLotteryNum: val.currFullExpect, lotteryNum: val.lastFullExpect }
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
      const { token } = params
      setToken(token)
      commit('setUserInfo', params)
      return getGameList().then(res => {
        if (Array.isArray(res)) {
          res.forEach(_ => {
            const item = baselist.find(i => i.code === _.typeid)
            if (item) item.children.push(_)
            _.path = _.typeid + '/' + _.name // 储存父级的code 用于后台传参
            _.fcode = _.typeid // 储存父级的code 用于后台传参
            _.lcode = _.typeid // 本地化code 用于添加类名 写样式
            _.icode = _.typeid // 前端处理后生成列表的父级code
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
      commit('setLotteryData', null)
      const data = getLotteryData(code) || await queryOddsByCode({ typeid: fcode }).then(({ rates }) => {
        const rt = Object.values(rates)
        setLotteryData(code, rt)
        return rt
      })
      data && state.currentLottery.code === code && commit('setLotteryData', data)
    },
    getGameList({ state, commit }, params) { // 获取历史开奖和走珠信息
      const { code, lcode } = state.currentLottery
      const par = { num: 50, lotteryname: code, ...params }
      getChartList(par).then(res => {
        res.forEach(_ => {
          _.result = _.opencode
          _.lotteryNum = _.expect
        })
        if (res) commit('setHistory', { historyList: res, lcode })
      })
    }
  }
}
