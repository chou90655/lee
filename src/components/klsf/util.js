import { handleRDChange } from '../../util/tools'
const handleYb = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('sumsingle') : _.name = '合数单'; break
    case code.includes('sumdouble') : _.name = '合数双'; break
    case code.includes('endbig') : _.name = '尾大'; break
    case code.includes('endsmall') : _.name = '尾小'; break
    case code.includes('east') : _.name = '東'; break
    case code.includes('south') : _.name = '南'; break
    case code.includes('west') : _.name = '西'; break
    case code.includes('noth') : _.name = '北'; break
    case code.includes('center') : _.name = '中'; break
    case code.includes('send') : _.name = '发'; break
    case code.includes('white') : _.name = '白'; break
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    case code.includes('dragon') : _.name = '龙'; break
    case code.includes('tiger') : _.name = '虎'; break
    default: _.name = _.playCode.slice(2, 4); break
  }
  res.push(_)
}

const handleSum = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('endbig') : _.name = '总和尾大'; break
    case code.includes('endsmall') : _.name = '总和尾小'; break
    case code.includes('big') : _.name = '总和大'; break
    case code.includes('small') : _.name = '总和小'; break
    case code.includes('single') : _.name = '总和单'; break
    case code.includes('double') : _.name = '总和双'; break
  }
  res.push(_)
}
export const filter = (data) => { // ruleName
  if (!data) return
  let res = { sum: [], zm: [] }
  const ysArr = ['1', '2', '3', '4', '5', '6', '7', '8']
  ysArr.forEach(_ => (res[_] = []))
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const tcode = _.typeCode
    switch (true) {
      case ysArr.includes(tcode[0]): handleYb(res[tcode[0]], _); break // 一八球
      case tcode.includes('sum'): handleSum(res.sum, _); break // 总和
      case tcode === 'zm': _.name = _.playCode.slice(3, 5); res.zm.push(_); break // 正码
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'kj':
      result.ball = data[1].filter(_ => _.typeCode === '1')
      result.square = data[1].filter(_ => _.typeCode.indexOf('1-') === 0)
      result.checkbox = [
        { name: '一球', value: 1 }, { name: '二球', value: 2 }, { name: '三球', value: 3 },
        { name: '四球', value: 4 }, { name: '五球', value: 5 }, { name: '六球', value: 6 },
        { name: '七球', value: 7 }, { name: '八球', value: 8 }
      ]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '第一球', square: data[1].filter(_ => _.typeCode.indexOf('1-') === 0) })
      result.sort.push({ title: '第二球', square: data[2].filter(_ => _.typeCode.indexOf('2-') === 0) })
      result.sort.push({ title: '第三球', square: data[3].filter(_ => _.typeCode.indexOf('3-') === 0) })
      result.sort.push({ title: '第四球', square: data[4].filter(_ => _.typeCode.indexOf('4-') === 0) })
      result.sort.push({ title: '第五球', square: data[5].filter(_ => _.typeCode.indexOf('5-') === 0) })
      result.sort.push({ title: '第六球', square: data[6].filter(_ => _.typeCode.indexOf('6-') === 0) })
      result.sort.push({ title: '第七球', square: data[7].filter(_ => _.typeCode.indexOf('7-') === 0) })
      result.sort.push({ title: '第八球', square: data[8].filter(_ => _.typeCode.indexOf('8-') === 0) })
      result.sort.push({ title: '总和', square: data.sum })
      break
    case 'zm':
      result.sort = []
      result.sort.push({ title: '总和', square: data.sum })
      result.sort.push({ title: '正码', square: data.zm })
      break
    default:
      result.ball = data[key] && data[key].filter(_ => _.typeCode === key)
      result.square = data[key] && data[key].filter(_ => _.typeCode.indexOf(key + '-') === 0)
      break
  }
  return handleRDChange(_this, result)
}
export const getColor = (n) => {
  switch (true) {
    case [1, 4, 7, 10, 13, 16, 19].includes(n): return 'red_b'
    case [2, 5, 8, 11, 14, 17, 20].includes(n): return 'blue_b'
    case [3, 6, 9, 12, 15, 18].includes(n): return 'green_b'
  }
}
