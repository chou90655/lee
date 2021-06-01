import { handleRDChange } from '../../util/tools'
const handleYs = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    case code.includes('zhi') : _.name = '质'; break
    case code.includes('sum') : _.name = '合'; break
    default: _.name = _.playCode.slice(2, 4); break
  }
  res.push(_)
}

const handleWs = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('bsgsum-big') : _.name = '和数大'; break
    case code.includes('bsgsum-small') : _.name = '和数小'; break
    case code.includes('big') : _.name = '尾数大'; break
    case code.includes('small') : _.name = '尾数小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    case code.includes('endzhi') : _.name = '尾数质'; break
    case code.includes('endsum') : _.name = '尾数合'; break
  }
  res.push(_)
}
export const filter = (data) => { // ruleName
  if (!data) return
  const res = { sum: [], bssum: [], lhh: [], kd: [], bgsum: [], bsgsum: [], sgsum: [] }
  const ysArr = ['1', '2', '3']
  ysArr.forEach(_ => (res[_] = []))
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const tcode = _.typeCode
    switch (true) {
      case ysArr.includes(tcode[0]): handleYs(res[tcode[0]], _); break // 一三球
      case tcode === 'lhh': _.name = _.playCode.includes('dragon') ? '龙' : _.playCode.includes('tiger') ? '虎' : '和'; res.lhh.push(_); break // 龙虎和
      case tcode === 'kd': _.name = _.playCode.slice(-1); res.kd.push(_); break // 正码
      case tcode.includes('bsgsum'): handleWs(res.bsgsum, _); break // 百十个和
      case tcode.includes('bssum'): handleWs(res.bssum, _); break // 百十和
      case tcode.includes('bgsum'): handleWs(res.bgsum, _); break // 百个和数
      case tcode.includes('sgsum'): handleWs(res.sgsum, _); break // 十个和
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  const result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'kj':
      result.ball = data[1].filter(_ => _.typeCode === '1')
      result.square = data[1].filter(_ => _.typeCode.indexOf('1-') === 0)
      result.checkbox = [{ name: '第一球', value: 1 }, { name: '第二球', value: 2 }, { name: '第三球', value: 3 }]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '百第一球', square: data[1].filter(_ => _.typeCode.indexOf('1-') === 0) })
      result.sort.push({ title: '十第二球', square: data[2].filter(_ => _.typeCode.indexOf('2-') === 0) })
      result.sort.push({ title: '个第三球', square: data[3].filter(_ => _.typeCode.indexOf('3-') === 0) })
      result.sort.push({ title: '龙虎和', square: data.lhh })
      break
    case 'sz':
      result.sort = []
      result.sort.push({ title: '百第一球', ball: data[1].filter(_ => _.typeCode === '1') })
      result.sort.push({ title: '十第二球', ball: data[2].filter(_ => _.typeCode === '2') })
      result.sort.push({ title: '个第三球', ball: data[3].filter(_ => _.typeCode === '3') })
      break
    case 'kd': result.ball = data.kd; break
    case 'hs':
      result.sort = []
      result.sort.push({ title: '百十和数', square: data.bssum })
      result.sort.push({ title: '百个和数', square: data.bgsum })
      result.sort.push({ title: '十个和数', square: data.sgsum })
      result.sort.push({ title: '百十个和数', square: data.bsgsum })
      break
    default:
      result.ball = data[key] && data[key].filter(_ => _.typeCode === key)
      result.square = data[key] && data[key].filter(_ => _.typeCode.indexOf(key + '-') === 0)
      break
  }
  return handleRDChange(_this, result)
}
