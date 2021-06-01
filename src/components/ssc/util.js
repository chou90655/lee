import { handleRDChange } from '../../util/tools'
const handleDxdszh = (res, _, troggle) => {
  const code = _.playCode
  const pre = troggle ? '总和' : ''
  switch (true) {
    case code.includes('single') : _.name = pre + '单'; break
    case code.includes('double') : _.name = pre + '双'; break
    case code.includes('big') : _.name = pre + '大'; break
    case code.includes('small') : _.name = pre + '小'; break
    default: _.name = +code.slice(2); break
  }
  res.push(_)
}
const handleLs = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('bao') : _.name = '豹子'; break
    case code.includes('ban') : _.name = '半顺'; break
    case code.includes('shun') : _.name = '顺子'; break
    case code.includes('dui') : _.name = '对子'; break
    case code.includes('za') : _.name = '杂六'; break
  }
  res.push(_)
}
const handleDn = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('none') : _.name = '没牛'; break
    case code.includes('0') : _.name = '牛牛'; break
    case code.includes('big') : _.name = '牛大'; break
    case code.includes('small') : _.name = '牛小'; break
    case code.includes('single') : _.name = '牛单'; break
    case code.includes('double') : _.name = '牛双'; break
    default: _.name = '牛' + code[3]; break
  }
  res.push(_)
}
const handleSh = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('wt') : _.name = '五条'; break
    case code.includes('sit') : _.name = '四条'; break
    case code.includes('hl') : _.name = '葫芦'; break
    case code.includes('sant') : _.name = '三条'; break
    case code.includes('lt') : _.name = '两对'; break
    case code.includes('yd') : _.name = '一对'; break
    case code.includes('sz') : _.name = '顺子'; break
    case code.includes('sh') : _.name = '散号'; break
  }
  res.push(_)
}

export const filter = (data) => {
  if (!data) return
  let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], lhh: [], qsq: [], zsq: [], hsq: [], dn: [], sh: [] }
  const indexObj = { w: 1, q: 2, b: 3, s: 4, g: 5 }
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const code = _.playCode
    const tcode = _.typeCode
    switch (true) {
      case code[1] === '-' : handleDxdszh(res[indexObj[tcode[0]]], _); break // 一至五球
      case tcode.includes('sum'): handleDxdszh(res.sum, _, 1); break // 总和大小单双
      case tcode === 'lhh':_.name = code.includes('tiger') ? '虎' : code.includes('dragon') ? '龙' : '和'; res.lhh.push(_); break // 龙虎斗
      case tcode === 'qsq': handleLs(res.qsq, _); break // 前三球
      case tcode === 'zsq': handleLs(res.zsq, _); break // 中三球
      case tcode === 'hsq': handleLs(res.hsq, _); break // 后三球
      case tcode === 'dn': handleDn(res.dn, _); break // 斗牛
      case tcode === 'sh': handleSh(res.sh, _); break // 梭哈
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
      result.ball = data[1].filter(_ => _.typeCode === 'w')
      result.square = data[1].filter(_ => _.typeCode.indexOf('w-') === 0)
      result.checkbox = [{ name: '一球', id: 'w', value: 1 }, { name: '二球', id: 'q', value: 2 }, { name: '三球', id: 'b', value: 3 }, { name: '四球', id: 's', value: 4 }, { name: '五球', id: 'g', value: 5 }]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '万第一球', square: data[1].filter(_ => _.typeCode.indexOf('w-') === 0) })
      result.sort.push({ title: '千第二球', square: data[2].filter(_ => _.typeCode.indexOf('q-') === 0) })
      result.sort.push({ title: '百第三球', square: data[3].filter(_ => _.typeCode.indexOf('b-') === 0) })
      result.sort.push({ title: '十第四球', square: data[4].filter(_ => _.typeCode.indexOf('s-') === 0) })
      result.sort.push({ title: '个第五球', square: data[5].filter(_ => _.typeCode.indexOf('g-') === 0) })
      result.sort.push({ title: '总和/龙虎', square: [...data.sum, ...data.lhh] })
      break
    case '1':
      result.ball = data[1].filter(_ => _.typeCode === 'w')
      result.square = data[1].filter(_ => _.typeCode.indexOf('w-') === 0)
      break
    case '2':
      result.ball = data[2].filter(_ => _.typeCode === 'q')
      result.square = data[2].filter(_ => _.typeCode.indexOf('q-') === 0)
      break
    case '3':
      result.ball = data[3].filter(_ => _.typeCode === 'b')
      result.square = data[3].filter(_ => _.typeCode.indexOf('b-') === 0)
      break
    case '4':
      result.ball = data[4].filter(_ => _.typeCode === 's')
      result.square = data[4].filter(_ => _.typeCode.indexOf('s-') === 0)
      break
    case '5':
      result.ball = data[5].filter(_ => _.typeCode === 'g')
      result.square = data[5].filter(_ => _.typeCode.indexOf('g-') === 0)
      break
    case 'sq':
      result.sort = []
      result.sort.push({ title: '前三球', square: data.qsq })
      result.sort.push({ title: '中三球', square: data.zsq })
      result.sort.push({ title: '后三球', square: data.hsq })
      break
    case 'dn':result.square = data.dn; break
    case 'sh':result.square = data.sh; break
  }
  return handleRDChange(_this, result)
}
