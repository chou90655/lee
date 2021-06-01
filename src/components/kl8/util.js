import { handleRDChange } from '../../util/tools'
const handleZh = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('bigsingle') : _.name = '总大单'; break
    case code.includes('bigdouble') : _.name = '总大双'; break
    case code.includes('smallsingle') : _.name = '总小单'; break
    case code.includes('smalldouble') : _.name = '总小双'; break
    case code.includes('-big') : _.name = '总和大'; break
    case code.includes('-small') : _.name = '总和小'; break
    case code.includes('-single') : _.name = '总和单'; break
    case code.includes('-double') : _.name = '总和双'; break
    case code.includes('-810') : _.name = '总和810'; break
  }
  res.push(_)
}
const handleQhh = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('headmore') : _.name = '前(多)'; break
    case code.includes('endmore') : _.name = '后(多)'; break
    case code.includes('sum') : _.name = '前后(和)'; break
  }
  res.push(_)
}
const handleDsh = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('singlemore') : _.name = '单(多)'; break
    case code.includes('doublemore') : _.name = '双(多)'; break
    case code.includes('sum') : _.name = '单双(和)'; break
  }
  res.push(_)
}
const handleWx = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('glod') : _.name = '金'; break
    case code.includes('wood') : _.name = '木'; break
    case code.includes('water') : _.name = '水'; break
    case code.includes('fire') : _.name = '火'; break
    case code.includes('soil') : _.name = '土'; break
  }
  res.push(_)
}
export const filter = (data) => {
  if (!data) return
  let res = { zm: [], zh: [], qhh: [], dsh: [], wx: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const code = _.playCode
    const tcode = _.typeCode
    switch (true) {
      case tcode === 'zm': _.name = code.slice(3); res.zm.push(_); break // 正码
      case tcode.includes('sum') : handleZh(res.zh, _); break // 总和 过关
      case tcode === 'qhh': handleQhh(res.qhh, _); break // 前后和
      case tcode === 'dsh': handleDsh(res.dsh, _); break // 单双和
      case tcode === 'wx': handleWx(res.wx, _); break // 五行
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'zm':
      result.odds = data.zm[0].odds
      result.ball = data.zm
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '总和、总和过关', square: data.zh })
      result.sort.push({ title: '前后和', square: data.qhh })
      result.sort.push({ title: '单双和', square: data.dsh })
      result.sort.push({ title: '五行', square: data.wx })
      break
  }
  return handleRDChange(_this, result)
}
export const getColor = (n) => {
  switch (n % 3) {
    case 1: return 'red_b'
    case 2: return 'blue_b'
    case 0: return 'green_b'
  }
}
