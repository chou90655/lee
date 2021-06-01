export function getFormateDate(dateTime, fmt) {
  return format.call(dateTime ? new Date(dateTime) : new Date(), fmt)
}
function format(fmt) {
  const o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'h+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length))
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)))
    }
  }
  return fmt
}
function getLastDayYYYYMMDDStr(nextGameResultNum) {
  const perIssueDate = `${nextGameResultNum.substr(0, 4)}/${nextGameResultNum.substr(4, 2)}/${nextGameResultNum.substr(6, 2)}`
  const lastDateTime = new Date(perIssueDate).getTime() - 24 * 60 * 60 * 1000
  return getFormateDate(lastDateTime, 'yyyyMMdd')
}

function getLastDayYYMMDDStr(nextGameResultNum) {
  const perIssueDate = `${nextGameResultNum.substr(0, 4)}/${nextGameResultNum.substr(4, 2)}/${nextGameResultNum.substr(6, 2)}`
  const lastDateTime = new Date(perIssueDate).getTime() - 24 * 60 * 60 * 1000
  return getFormateDate(lastDateTime, 'yyMMdd')
}
export function gerLoteryNum(nextIssue, period, lotteryType) {
  let perIssue = ''
  let issue = nextIssue.substr(nextIssue.length - period.length, nextIssue.length)
  if ((Number(issue) - 1) === 0) {
    if (lotteryType === 1) { // 为yyyyMMdd xxx 3位数
      perIssue = period.length > 2 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 3) { // yyMMdd xxx 3位数
      perIssue = period.length > 2 ? `${getLastDayYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 6) {
      perIssue = period.length > 3 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else if (lotteryType === 7) {
      perIssue = period.length > 1 ? `${getLastDayYYYYMMDDStr(nextIssue)}${period}` : `${getLastDayYYYYMMDDStr(nextIssue)}0${period}`
    } else {
      perIssue = `${(Number(nextIssue) - 1)}`
    }
  } else {
    perIssue = `${(Number(nextIssue) - 1)}`
  }
  let flag = false
  if (nextIssue.split('')[0] === 0) {
    flag = true
  }
  if (flag) {
    perIssue = `0${perIssue}`
  }
  return perIssue
}
