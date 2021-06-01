import { handleRDChange } from '../../util/tools'
const handleSg = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    default: _.name = _.playCode.slice(-1); break
  }
  res.push(_)
}

export const filter = (data) => { // ruleName
  if (!data) return
  const res = { ds: [], sg: [], ws: [], cp: [], dp: [], slh: [], sbth: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const tcode = _.typeCode
    switch (true) {
      case tcode === 'sg': handleSg(res.sg, _); break // 三军 和值
      case tcode === 'ws': _.name = _.playCode.slice(-3); res.ws.push(_); break // 围骰
      case tcode === 'qs': _.name = '全骰'; res.ws.push(_); break // 全骰
      case tcode === 'ds': _.name = _.playCode.slice(3, 6) + '点'; res.ds.push(_); break // 点数
      case tcode === 'cp': _.name = _.playCode.slice(3, 6); res.cp.push(_); break // 长牌
      case tcode === 'dp': _.name = _.playCode.slice(3, 6); res.dp.push(_); break // 短牌
      case tcode === 'slh': _.name = _.playCode === 'slh-qb' ? '全包顺子' : _.playCode.slice(4, 7); res.slh.push(_); break // 三连号
      case tcode === 'sbth': _.name = _.playCode.slice(5, 8); res.sbth.push(_); break // 三不同号
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  const result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'ds':result.square = [...data.sg.filter(_ => _.playCode.length > 4), ...data.ds]; break // 和值
    case 'sg':result.ball = data.sg.filter(_ => _.playCode.length === 4); break // 单号
    case 'dp':result.ball = data.dp; break // 二同号
    case 'cp':result.ball = data.cp; break // 二不同号
    case 'wq':result.ball = data.ws; break // 三同号
    case 'slh':result.ball = data.slh; break // 三连号
    case 'sbth':result.ball = data.sbth; break // 三不同号
  }
  return handleRDChange(_this, result)
}
