/* eslint-disable object-property-newline */
import { handleRDChange, copy, filt, chooseDataZh } from '../../util/tools'
import { zxhz3, zxkd3, zuxhz3, zxhz2, zxkd2, zuxhz2 } from '../../data/data'
const zxdata = { zxhz3, zxkd3, zuxhz3, zxhz2, zxkd2, zuxhz2 }
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
const hddxds = (item) => {
  return ['大', '小', '单', '双'].map((_, i) => ({ ...item, name: _, num: i }))
}
const hdhl = (item) => {
  return ['龙', '虎', '和'].map((_, i) => ({ ...item, name: _, num: i }))
}
const yxfs = (item, i = 10) => {
  return Array(i).fill(1).map((_, i) => ({ ...item, name: i, num: i }))
}
export const filter = (data) => {
  if (!data) return
  let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], lhh: [], qsq: [], zsq: [], hsq: [], lm1: [], lm2: [], lm3: [], lm4: [], lm5: [], dwd: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
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
      case ['zhixhzhe', 'zhixhzqe'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二  和值直选
      case ['zhixhzhs', 'zhixhzqs', 'zhixhzzs'].includes(tcode): res[_.playid] = yxfs(_, 28); break // 前三 中三 后三 和值直选
      case ['zuxhzhe', 'zuxhzqe'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二  和值组选
      case ['sxzuxzsq', 'sxzuxzlq', 'sxzuxzsz', 'sxzuxzlz', 'sxzuxzsh', 'sxzuxzlh'].includes(tcode): res[_.playid] = yxfs(_); break // 前三 中三 后三  组三组六
      case ['zuxhzqs', 'zuxhzzs', 'zuxhzhs'].includes(tcode): res[_.playid] = yxfs(_, 27).slice(1); break // 前三 中三 后三 和值组选
      case ['zuxcebd', 'zuxhebd', 'zuxcsbd', 'zuxzsbd', 'zuxhsbd'].includes(tcode): res[_.playid] = yxfs(_); break // 后二 前二 前三 中三 后三 组选包胆
      case ['bdwqs', 'bdwzs', 'bdwhs', 'bdwqs2m', 'bdwzs2m', 'bdwhs2m'].includes(tcode): res[_.playid] = yxfs(_); break // 前三 中三 后三 不定位
      case ['dxdshe', 'dxdshs', 'dxdsqe', 'dxdsqs'].includes(tcode): res[_.playid] = hddxds(_); break // 大小单双
      case ['lhbg', 'lhbs', 'lhqb', 'lhqg', 'lhqs', 'lhsg', 'lhwb', 'lhwg', 'lhwq', 'lhws'].includes(tcode): res[_.playid] = hdhl(_); break // 龙虎
      case ['wxzhixfs', 'wxzxyel', 'wxzxls', 'wxzxsl', 'wxzxel', 'wxzxyl', 'wxzxw', 'bdw5x1m', 'bdw5x2m', 'bdw5x3m', 'qwyffs', 'qwhscs', 'qwsxbx', 'qwsjfc'].includes(tcode): res[_.playid] = yxfs(_); break // 五星
      case ['sixzhixfsh', 'hsizxes', 'hsizxye', 'hsizxl', 'hsizxs', 'bdw4x1m', 'bdw4x2m'].includes(tcode): res[_.playid] = yxfs(_); break // 四星
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  let oddk
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'sx':
      oddk = ['sixzhixfsh', 'hsizxes', 'hsizxye', 'hsizxl', 'hsizxs', 'bdw4x1m', 'bdw4x2m']
      result.rodio = ['复式', '组选24', '组选12', '组选6', '组选4', '一码不定位', '二码不定位'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.sorts = []
      result.odds = 1
      result.sorts.push(['千位', '百位', '十位', '个位'].map(_ => ({ title: _, ball: copy(data.sixzhixfsh) }))) // 复式
      result.sorts.push([{ ball: copy(data.hsizxes) }]) // 组选24
      result.sorts.push([{ ball: copy(data.hsizxye) }]) // 组选12
      result.sorts.push([{ ball: copy(data.hsizxl) }]) // 组选6
      result.sorts.push([{ ball: copy(data.hsizxs) }]) // 组选4
      result.sorts.push([{ ball: copy(data.bdw4x1m) }]) // 一码不定位
      result.sorts.push([{ ball: copy(data.bdw4x2m) }]) // 二码不定位
      break
    case 'wx':
      oddk = ['wxzhixfs', 'wxzxyel', 'wxzxls', 'wxzxsl', 'wxzxel', 'wxzxyl', 'wxzxw', 'bdw5x1m', 'bdw5x2m', 'bdw5x3m', 'qwyffs', 'qwhscs', 'qwsxbx', 'qwsjfc']
      result.rodio = ['复式', '组选120', '组选60', '组选30', '组选20', '组选10', '组选5', '一码不定位',
        '二码不定位', '三码不定位', '一帆风顺', '好事成双', '三星报喜', '四季发财'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.sorts = []
      result.odds = 1
      result.sorts.push(['万位', '千位', '百位', '十位', '个位'].map(_ => ({ title: _, ball: copy(data.wxzhixfs) }))) // 复式
      result.sorts.push([{ ball: copy(data.wxzxyel) }]) // 组选120
      result.sorts.push([{ title: '二重号位', ball: copy(data.wxzxls) }, { title: '单号位', ball: copy(data.wxzxls) }])// 组选60
      result.sorts.push([{ title: '二重号位', ball: copy(data.wxzxsl) }, { title: '单号位', ball: copy(data.wxzxsl) }])// 组选30
      result.sorts.push([{ title: '三重号位', ball: copy(data.wxzxel) }, { title: '单号位', ball: copy(data.wxzxel) }])// 组选20
      result.sorts.push([{ title: '三重号位', ball: copy(data.wxzxyl) }, { title: '二重号位', ball: copy(data.wxzxyl) }])// 组选10
      result.sorts.push([{ title: '四重号位', ball: copy(data.wxzxw) }, { title: '单号位', ball: copy(data.wxzxw) }])// 组选5
      result.sorts.push([{ ball: copy(data.bdw5x1m) }]) // 一码不定位
      result.sorts.push([{ ball: copy(data.bdw5x2m) }]) // 二码不定位
      result.sorts.push([{ ball: copy(data.bdw5x3m) }]) // 三码不定位
      result.sorts.push([{ ball: copy(data.qwyffs) }]) // 一帆风顺
      result.sorts.push([{ ball: copy(data.qwhscs) }]) // 好事成双
      result.sorts.push([{ ball: copy(data.qwsxbx) }]) // 三星报喜
      result.sorts.push([{ ball: copy(data.qwsjfc) }]) // 四季发财
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
      result.sorts.push([{ title: '万位', ball: copy(data.exzhixfsq) }, { title: '千位', ball: copy(data.exzhixfsq) }])
      result.sorts.push([{ ball: copy(data.zhixhzqe) }]) // 和值
      result.sorts.push([{ ball: copy(data.kuaduqe) }]) // 跨度
      result.sorts.push([{ ball: copy(data.exzuxfsq) }]) // 组选复式
      result.sorts.push([{ ball: copy(data.zuxhzqe) }]) // 和值
      result.sorts.push([{ ball: copy(data.zuxcebd) }]) // 包胆
      break
    case 'he':
      result.rodio = [{ name: '直选复式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选和值' }, { name: '组选包胆' }]
      result.sorts = []
      result.sorts.push([{ title: '十位', ball: copy(data.exzhixfsh) }, { title: '个位', ball: copy(data.exzhixfsh) }])
      result.sorts.push([{ ball: copy(data.zhixhzhe) }]) // 和值
      result.sorts.push([{ ball: copy(data.kuaduhe) }]) // 跨度
      result.sorts.push([{ ball: copy(data.exzuxfsh) }]) // 组选复式
      result.sorts.push([{ ball: copy(data.zuxhzhe) }]) // 和值
      result.sorts.push([{ ball: copy(data.zuxhebd) }]) // 包胆
      break
    case 'qs':
      oddk = ['sxzhixfsq', 'zhixhzqs', 'kuaduqs', 'zuxhzqs', 'sxzuxzsq', 'sxzuxzlq', 'zuxcsbd', 'bdwqs', 'bdwqs2m']
      result.rodio = ['直选复式', '直选和值', '跨度', '组选和值', '组选三', '组选六', '组选包胆', '一码不定位', '二码不定位'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.odds = 1
      result.sorts = []
      result.sorts.push([{ title: '万位', ball: copy(data.sxzhixfsq) }, { title: '千位', ball: copy(data.sxzhixfsq) }, { title: '百位', ball: copy(data.sxzhixfsq) }])
      result.sorts.push([{ ball: copy(data.zhixhzqs) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.kuaduqs) }]) // 跨度
      result.sorts.push([{ ball: copy(data.zuxhzqs) }]) // 组选和值
      result.sorts.push([{ ball: copy(data.sxzuxzsq) }]) // 组选三
      result.sorts.push([{ ball: copy(data.sxzuxzlq) }]) // 组选六
      result.sorts.push([{ ball: copy(data.zuxcsbd) }]) // 组选包胆
      result.sorts.push([{ ball: copy(data.bdwqs) }]) // 一码不定位
      result.sorts.push([{ ball: copy(data.bdwqs2m) }]) // 二码不定位
      break
    case 'zs':
      oddk = ['sxzhixfsz', 'zhixhzzs', 'kuaduzs', 'zuxhzzs', 'sxzuxzsz', 'sxzuxzlz', 'zuxzsbd', 'bdwzs', 'bdwzs2m']
      result.rodio = ['直选复式', '直选和值', '跨度', '组选和值', '组选三', '组选六', '组选包胆', '一码不定位', '二码不定位'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.odds = 1
      result.sorts = []
      result.sorts.push([{ title: '千位', ball: copy(data.sxzhixfsz) }, { title: '百位', ball: copy(data.sxzhixfsz) }, { title: '十位', ball: copy(data.sxzhixfsz) }])
      result.sorts.push([{ ball: copy(data.zhixhzzs) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.kuaduzs) }]) // 跨度
      result.sorts.push([{ ball: copy(data.zuxhzzs) }]) // 组选和值
      result.sorts.push([{ ball: copy(data.sxzuxzsz) }]) // 组选三
      result.sorts.push([{ ball: copy(data.sxzuxzlz) }]) // 组选六
      result.sorts.push([{ ball: copy(data.zuxzsbd) }]) // 组选包胆
      result.sorts.push([{ ball: copy(data.bdwzs) }]) // 一码不定位
      result.sorts.push([{ ball: copy(data.bdwzs2m) }]) // 二码不定位
      break
    case 'hs':
      oddk = ['sxzhixfsh', 'zhixhzhs', 'kuaduhs', 'zuxhzhs', 'sxzuxzsh', 'sxzuxzlh', 'zuxhsbd', 'bdwhs', 'bdwhs2m']
      result.rodio = ['直选复式', '直选和值', '跨度', '组选和值', '组选三', '组选六', '组选包胆', '一码不定位', '二码不定位'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.odds = 1
      result.sorts = []
      result.sorts.push([{ title: '百位', ball: copy(data.sxzhixfsh) }, { title: '十位', ball: copy(data.sxzhixfsh) }, { title: '个位', ball: copy(data.sxzhixfsh) }])
      result.sorts.push([{ ball: copy(data.zhixhzhs) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.kuaduhs) }]) // 跨度
      result.sorts.push([{ ball: copy(data.zuxhzhs) }]) // 组选和值
      result.sorts.push([{ ball: copy(data.sxzuxzsh) }]) // 组选三
      result.sorts.push([{ ball: copy(data.sxzuxzlh) }]) // 组选六
      result.sorts.push([{ ball: copy(data.zuxhsbd) }]) // 组选包胆
      result.sorts.push([{ ball: copy(data.bdwhs) }]) // 一码不定位
      result.sorts.push([{ ball: copy(data.bdwhs2m) }]) // 二码不定位
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
      result.sort.push({ title: '龙虎百个', square: data.lhbg })
      result.sort.push({ title: '龙虎百十', square: data.lhbs })
      result.sort.push({ title: '龙虎千百', square: data.lhqb })
      result.sort.push({ title: '龙虎千个', square: data.lhqg })
      result.sort.push({ title: '龙虎千十', square: data.lhqs })
      result.sort.push({ title: '龙虎十个', square: data.lhsg })
      result.sort.push({ title: '龙虎万百', square: data.lhwb })
      result.sort.push({ title: '龙虎万个', square: data.lhwg })
      result.sort.push({ title: '龙虎万千', square: data.lhwq })
      result.sort.push({ title: '龙虎万十', square: data.lhws })
      break
  }
  return handleRDChange(_this, result)
}

export const hdarrdl = (da) => {
  console.log(da)
  let data = []
  da.forEach(_ => {
    const it = filt(_.square || _.ball)
    if (it.length) data.push({ ..._, it })
  })
  if (!data.length) data.err = '至少选择一个号码'
  else data = data.map(_ => ({ ..._.it[0], number: _.it.map(i => i.num).join(), title: _.title, zhushu: _.it.length, label: _.it.map(i => i.name).join() }))
  return data
}
export const hdsprd = (da) => {
  const data = []
  da.forEach(_ => {
    const it = filt(_.square || _.ball)
    if (it.length) data.push(...it.map(i => ({ ...i, number: i.num || i.name, zhushu: 1 })))
  })
  if (!data.length) data.err = '至少选择一个号码'
  return data
}
export const hdwx = (da, yq, pls) => {
  const data = da.map(_ => filt(_.ball || _.square))
  const list = []
  const ei = yq.findIndex((_, i) => _.n > data[i].length)
  if (data.every(_ => !_.length))list.err = '至少选择一个号码'
  else if (ei > -1) list.err = `${da[ei].title || ''}至少选择${yq[ei].n}个`
  else {
    const d = data.map((_, i) => hditem(_, yq[i].n || 1, yq[i].t, yq[i].k, yq[i]))
    list.push({ ...data.find(_ => _.length)[0], zhushu: d.reduce((a, c) => pls ? (a + c.num) : (a * c.num), pls ? 0 : 1), number: d.map(_ => _.l).join('|') })
  }
  return list
}
const hditem = (arr, num1, type, key, yq) => {
  let num = 0
  if (type === 5) num = arr.reduce((a, c) => a + zxdata[key][(c.num || c.name)], 0)
  else {
    const combination = []
    chooseDataZh([...arr], num1, combination)
    num = combination.length
    if (type === 6) num *= 2
  }
  num = yq.num || num
  return { num, l: arr.map(_ => _.name || _.num).join() }
}
