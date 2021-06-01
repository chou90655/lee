import { handleRDChange } from '../../util/tools'
const handleLm = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code === 'big' : _.name = '大'; break
    case code === 'small' : _.name = '小'; break
    case code === 'single' : _.name = '单'; break
    case code === 'double' : _.name = '双'; break
    case code === 'bigsingle' : _.name = '大单'; break
    case code === 'bigdouble' : _.name = '大双'; break
    case code === 'smallsingle' : _.name = '小单'; break
    case code === 'smalldouble' : _.name = '小双'; break
    case code === 'supbig' : _.name = '极大'; break
    case code === 'supsmall' : _.name = '极小'; break
  }
  res.push(_)
}
const handleSb = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code === 'red' : _.name = '红波'; break
    case code === 'green' : _.name = '绿波'; break
    case code === 'blue' : _.name = '蓝波'; break
    case code === 'bz' : _.name = '豹子'; break
  }
  res.push(_)
}

export const filter = (data) => { // ruleName
  if (!data) return
  let res = { sum: [], lm: [], sb: [], bsl: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const tcode = _.typeCode
    switch (true) {
      case tcode[1] === '-' : handleLm(res.lm, _); break // 大小单双
      case tcode === 'zh' : handleLm(res.lm, _); break // 组合 大小单双
      case tcode === 'jz' : handleLm(res.lm, _); break // 极值
      case tcode === 'color' : handleSb(res.sb, _); break // 色波
      case tcode === 'bz' : handleSb(res.sb, _); break // 豹子
      case tcode === 'sum': _.name = _.playCode; res.sum.push(_); break // 点数
      case tcode === 'tm-bs': _.name = _.playCode.slice(6); res.bsl.push(_); break // 特码包三
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'ds': result.ball = data.sum; break
    case 'lm': result.square = data.lm; break
    case 'sb':
      result.sort = []
      result.sort.push({ title: '色波/豹子', square: data.sb })
      result.sort.push({ title: '特码包三', ball: data.bsl })
      break
  }
  return handleRDChange(_this, result)
}
export const getColor = (n) => {
  switch (true) {
    case [1, 4, 7, 10, 16, 19, 22, 25].includes(n): return 'red_b'
    case [2, 5, 8, 11, 17, 20, 23, 26].includes(n): return 'blue_b'
    case [3, 6, 9, 12, 15, 18, 21, 24].includes(n): return 'green_b'
  }
}
