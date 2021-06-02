/* eslint-disable object-property-newline */
import { handleRDChange, copy } from '../../util/tools'
const handleDxdszh = (res, _) => {
  const code = _.playid
  switch (true) {
    case code.includes('_dan') : _.name = '单'; break
    case code.includes('_shuang') : _.name = '双'; break
    case code.includes('_da') : _.name = '大'; break
    case code.includes('_xiao') : _.name = '小'; break
    default: _.name = +code.slice(10); break
  }
  res.push(_)
}
const handleLs = (res, _) => {
  const code = _.playid
  switch (true) {
    case code.includes('bz') : _.name = '豹子'; break
    case code.includes('bs') : _.name = '半顺'; break
    case code.includes('sz') : _.name = '顺子'; break
    case code.includes('dz') : _.name = '对子'; break
    case code.includes('z6') : _.name = '杂六'; break
  }
  res.push(_)
}
const handleDn = (res, _) => {
  const code = _.playid
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
const hddxds = (item) => {
  return ['大', '小', '单', '双'].map((_, i) => ({ ...item, name: _, num: i }))
}
const hdhl = (item) => {
  return ['龙', '虎', '和'].map((_, i) => ({ ...item, name: _, num: i }))
}
const yxfs = (item, i = 10) => {
  return Array(i).fill(1).map((_, i) => ({ ...item, name: i, num: i }))
}
export const filter = (data1) => {
  if (!data1) return
  const data = Object.values(data1)
  let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], lhh: [], qsq: [], zsq: [], hsq: [], dn: [], sh: [], lm1: [], lm2: [], lm3: [], lm4: [], lm5: [],
    lh: [], dxds: [], dwd: []
  }
  // const indexObj = { w: 1, q: 2, b: 3, s: 4, g: 5 }
  data.forEach(_ => {
    _.choose = false
    _.odds = +_.rate ? _.rate : _.maxjj
    const tcode = _.playid
    switch (true) {
      case tcode.includes('dan_d'): handleDxdszh(res[tcode[5]], _); break // 一至五球
      case tcode.includes('lmp_d'): handleDxdszh(res['lm' + tcode[5]], _); break // 一至五球 大小单双
      case tcode.includes('lmp_zongh'): handleDxdszh(res.sum, _); break // 总和大小单双
      case tcode.includes('lmp_lh'):_.name = tcode.includes('hu') ? '虎' : tcode.includes('he') ? '和' : '龙'; res.lhh.push(_); break // 龙虎斗
      case tcode.includes('lmp_qs'): handleLs(res.qsq, _); break // 前三球
      case tcode.includes('lmp_zs'): handleLs(res.zsq, _); break // 中三球
      case tcode.includes('lmp_hs'): handleLs(res.hsq, _); break // 后三球
      case tcode.includes('dweid'):res.dwd = yxfs(_); break // 定位胆
      case ['exzhixfsh', 'exzhixfsq', 'sxzhixfsz', 'sxzhixfsq', 'sxzhixfsh', 'sxzhixdsh', 'sxzhixdsq', 'sxzhixdsz'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三
      case ['kuaduqe', 'exzuxfsh'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 组选
      case ['exzuxfsq', 'kuaduhe', 'kuaduhs', 'kuaduqs', 'kuaduzs'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 跨度
      case ['zhixhzhe', 'zhixhzqe', 'zhixhzhs', 'zhixhzqs', 'zhixhzzs'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 和值直选
      case ['zuxhzhe', 'zuxhzqe', 'zuxhzhs', 'zuxhzqs', 'zuxhzzs'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 和值组选
      case ['zuxzsbd', 'zuxqsbd', 'zuxhsbd', 'zuxcebd', 'zuxhebd'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 包胆
      case ['dxdshe', 'dxdshs', 'dxdsqe', 'dxdsqs'].includes(tcode): res[_.playid] = hddxds(_); break // 大小单双
      case ['lhbg', 'lhbs', 'lhqb', 'lhqg', 'lhqs', 'lhsg', 'lhwb', 'lhwg', 'lhwq', 'lhws'].includes(tcode): res[_.playid] = hdhl(_); break // 龙虎
      // case tcode === 'dn': handleDn(res.dn, _); break // 斗牛
      // case tcode === 'sh': handleSh(res.sh, _); break // 梭哈
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  console.log(data)
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
      result.sort.push({ title: '万第一球', square: data.lm1 })
      result.sort.push({ title: '千第二球', square: data.lm2 })
      result.sort.push({ title: '百第三球', square: data.lm3 })
      result.sort.push({ title: '十第四球', square: data.lm4 })
      result.sort.push({ title: '个第五球', square: data.lm5 })
      result.sort.push({ title: '总和', square: data.sum })
      break
    case '1':
      result.ball = data[1]
      break
    case '2':
      result.ball = data[2]
      break
    case '3':
      result.ball = data[3]
      break
    case '4':
      result.ball = data[4]
      break
    case '5':
      result.ball = data[5]
      break
    case 'dxds':
      result.rodio = [{ name: '前二' }, { name: '后二' }, { name: '前三' }, { name: '后三' }]
      result.sorts = []
      result.sorts.push([{ title: '个位', square: copy(data.dxdsqe) }, { title: '十位', square: copy(data.dxdsqe) }])
      result.sorts.push([{ title: '千位', square: copy(data.dxdshe) }, { title: '万位', square: copy(data.dxdshe) }])
      result.sorts.push([{ title: '个位', square: copy(data.dxdsqs) }, { title: '十位', square: copy(data.dxdsqs) }, { title: '百位', square: copy(data.dxdsqs) }])
      result.sorts.push([{ title: '百位', square: copy(data.dxdshs) }, { title: '千位', square: copy(data.dxdshs) }, { title: '万位', square: copy(data.dxdshs) }])
      break
    case 'qe':
      result.rodio = [{ name: '直选复式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选和值' }, { name: '组选包胆' }]
      result.sorts = []
      result.sorts.push([{ title: '个位', ball: copy(data.exzhixfsq) }, { title: '十位', ball: copy(data.exzhixfsq) }])
      result.sorts.push([{ ball: copy(data.zhixhzqe) }]) // 和值
      result.sorts.push([{ ball: copy(data.kuaduqe) }]) // 跨度
      result.sorts.push([{ title: '个位', ball: copy(data.exzuxfsq) }, { title: '十位', ball: copy(data.exzuxfsq) }])
      result.sorts.push([{ ball: copy(data.zuxhzqe) }]) // 和值
      result.sorts.push([{ ball: copy(data.zuxcebd) }]) // 包胆
      break
    case 'he':
      result.rodio = [{ name: '直选复式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选和值' }, { name: '组选包胆' }]
      result.sorts = []
      result.sorts.push([{ title: '个位', ball: copy(data.exzhixfsh) }, { title: '十位', ball: copy(data.exzhixfsh) }])
      result.sorts.push([{ ball: copy(data.zhixhzhe) }]) // 和值
      result.sorts.push([{ ball: copy(data.kuaduhe) }]) // 跨度
      result.sorts.push([{ title: '个位', ball: copy(data.exzuxfsh) }, { title: '十位', ball: copy(data.exzuxfsh) }])
      result.sorts.push([{ ball: copy(data.zuxhzhe) }]) // 和值
      result.sorts.push([{ ball: copy(data.zuxhebd) }]) // 包胆
      break
    case 'qs':
      result.rodio = [{ name: '直选复式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选和值' }, { name: '组选包胆' }]
      result.sorts = []
      result.sorts.push([{ title: '个位', square: copy(data.exzhixfsq) }, { title: '十位', square: copy(data.exzhixfsq) }])
      result.sorts.push([{ title: '千位', square: copy(data.dxdshe) }, { title: '万位', square: copy(data.dxdshe) }])
      result.sorts.push([{ title: '个位', square: copy(data.dxdsqs) }, { title: '十位', square: copy(data.dxdsqs) }, { title: '百位', square: copy(data.dxdsqs) }])
      result.sorts.push([{ title: '百位', square: copy(data.dxdshs) }, { title: '千位', square: copy(data.dxdshs) }, { title: '万位', square: copy(data.dxdshs) }])
      break
    case 'qzh':
      result.sort = []
      result.sort.push({ title: '前三球', square: data.qsq })
      result.sort.push({ title: '中三球', square: data.zsq })
      result.sort.push({ title: '后三球', square: data.hsq })
      result.sort.push({ title: '龙虎', square: data.lhh })
      break
    case 'dwd':
      result.sort = []
      result.sort.push({ title: '个位', ball: copy(data.dwd) })
      result.sort.push({ title: '十位', ball: copy(data.dwd) })
      result.sort.push({ title: '百位', ball: copy(data.dwd) })
      result.sort.push({ title: '千位', ball: copy(data.dwd) })
      result.sort.push({ title: '万位', ball: copy(data.dwd) })
      break
    case 'lh':
      result.sort = []
      result.sort.push({ title: '百个', square: data.lhbg })
      result.sort.push({ title: '百十', square: data.lhbs })
      result.sort.push({ title: '千百', square: data.lhqb })
      result.sort.push({ title: '千个', square: data.lhqg })
      result.sort.push({ title: '千十', square: data.lhqs })
      result.sort.push({ title: '十个', square: data.lhsg })
      result.sort.push({ title: '万百', square: data.lhwb })
      result.sort.push({ title: '万个', square: data.lhwg })
      result.sort.push({ title: '万千', square: data.lhwq })
      result.sort.push({ title: '万十', square: data.lhws })
      break
    case 'dn':result.square = data.dn; break
    case 'sh':result.square = data.sh; break
  }
  return handleRDChange(_this, result)
}
