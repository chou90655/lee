import request from './request'
export function getUser() {
  return request({
    url: '/member.getPersonalInfo.do',
    method: 'post'
  })
}

// 获取彩种列表
export function getGameList(data) {
  return request({
    url: '/index.getLotteryHall.do',
    method: 'post',
    data
  })
}
// 获取赔率及页面渲染相关的
export function queryOddsByCode(data) {
  return request({
    url: '/game.getCpDetails.do',
    method: 'post',
    data
  })
}

// 获取走珠 长龙等
export function getDewdropList(data) {
  return request({
    url: '/web/result/getDewDrop',
    method: 'post',
    data
  })
}

// 获取开奖历史
export function getChartList(data) {
  return request({
    url: '/apijiekou.getLotteryOpencodes.do',
    method: 'post',
    data
  })
}

// 获取开奖信息
export function getLotterytimes(data) {
  return request({
    url: '/apijiekou.getLotterytimes.do',
    method: 'post',
    data
  })
}

// 获取用户余额
export function userAmount(data) {
  return request({
    url: '/game/userManager/userAmount',
    method: 'post',
    data
  })
}

// 投注接口
export function lotteryBet(data) {
  return request({
    url: '/apijiekou.getCpBuy.do',
    method: 'post',
    data
  })
}

// 实时查询停售状态
export function getStatus(data) {
  return request({
    url: '/web/lottery/getStatus',
    method: 'post',
    data
  })
}

// 即时投注
export function getBetReport(data) {
  return request({
    url: '/web/bet/getBetReport',
    method: 'post',
    data
  })
}

// 今日输赢
export function getWinOrLoseTodayByGameId(data) {
  return request({
    url: 'task/lotteryGameKgController/getWinOrLoseTodayByGameId',
    method: 'post',
    data
  })
}
// 盘口信息
export function limitList(data) {
  return request({
    url: '/web/limit/list',
    method: 'post',
    data
  })
}
// 投注记录
export function betList(data) {
  return request({
    url: '/web/bet/listPage',
    method: 'post',
    data
  })
}
