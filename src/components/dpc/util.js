
import { handleRDChange, chooseDataZh, copy, filt } from '../../util/tools'
const hdnb = (item, num = 10) => Array(num).fill(1).map((_, i) => ({ ...item, name: i, num: '' + i }))
const hddxds = (item) => ['大', '小', '单', '双'].map((_, i) => ({ ...item, name: _, num: '' + i }))
export const filter = (data) => {
  if (!data) return
  let res = {}
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    const sxArr = ['pl3zxfs', 'pl3zux3', 'pl3zux6', 'pl3zuxbd', 'pl3kd', 'pl3ymbdw', 'pl3rmbdw', 'pl3dwdfs'] // 三星
    const qeArr = ['pl3q2zxfs', 'pl3q2kd', 'pl3qx2fs', 'pl3q2zxbd'] // 前二 组选复式 跨度 直选复式 包胆
    const heArr = ['pl3h2zxfs', 'pl3h2kd', 'pl3hx2fs', 'pl3h2zxbd'] // h二 组选复式 跨度 直选复式 包胆
    switch (true) {
      case [...qeArr, ...heArr, ...sxArr].includes(tcode): res[tcode] = hdnb(_); break
      case ['pl3zxds', 'pl3zuxhh', 'pl3zsds', 'pl3zlds', 'pl3hx2ds', 'pl3h2zxds', 'pl3qx2ds', 'pl3q2zxds'].includes(tcode): res[_.playid] = [_]; break // 单式
      case ['pl3hzzx'].includes(tcode): res[tcode] = hdnb(_, 28); break // 三星直选和值
      case ['pl3zuxhz'].includes(tcode): res[tcode] = hdnb(_, 27).slice(1); break // 三星组选和值
      case ['pl3q2zuxhz', 'pl3h2zuxhz'].includes(tcode): res[tcode] = hdnb(_, 18).slice(1); break // 2组选和值
      case ['pl3q2zxhz', 'pl3h2zxhz'].includes(tcode): res[tcode] = hdnb(_, 19); break // 2直选和值
      case ['dxdsq2', 'dxdsh2'].includes(tcode): res[tcode] = hddxds(_); break // 大小单双
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  _this.storeData = data
  let oddk
  switch (key) {
    case 'he': // 'pl3hx2ds','pl3h2zxds','pl3qx2ds','pl3q2zxds'
      oddk = ['pl3hx2fs', 'pl3hx2ds', 'pl3h2zxhz', 'pl3h2kd', 'pl3h2zxfs', 'pl3h2zxds', 'pl3h2zuxhz', 'pl3h2zxbd']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '直选复式' }, { name: '直选单式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选单式' }, { name: '组选和值' }, { name: '包胆', bd: 1 }] // 前二
      result.sorts = []
      result.sorts.push(['十位', '个位'].map(title => ({ title, ball: copy(data.pl3hx2fs) }))) // 直选复式
      result.sorts.push([{ sg: 1, data: data.pl3hx2ds[0], l: 2 }]) // 单式
      result.sorts.push([{ ball: copy(data.pl3h2zxhz) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.pl3h2kd) }]) // 跨度
      result.sorts.push([{ ball: copy(data.pl3h2zxfs) }]) // 组选复式
      result.sorts.push([{ sg: 1, data: data.pl3h2zxds[0], l: 2 }]) // 单式
      result.sorts.push([{ ball: copy(data.pl3h2zuxhz) }]) // 前二 组选和值
      result.sorts.push([{ ball: copy(data.pl3h2zxbd) }]) // 包胆
      break
    case 'qe':
      oddk = ['pl3qx2fs', 'pl3qx2ds', 'pl3q2zxhz', 'pl3q2kd', 'pl3q2zxfs', 'pl3q2zxds', 'pl3q2zuxhz', 'pl3q2zxbd']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '直选复式' }, { name: '直选单式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选复式' }, { name: '组选单式' }, { name: '组选和值' }, { name: '包胆', bd: 1 }] // 前二
      result.sorts = []
      result.sorts.push(['百位', '十位'].map(title => ({ title, ball: copy(data.pl3qx2fs) }))) // 直选复式
      result.sorts.push([{ sg: 1, data: data.pl3qx2ds[0], l: 2 }]) // 单式
      result.sorts.push([{ ball: copy(data.pl3q2zxhz) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.pl3q2kd) }]) // 跨度
      result.sorts.push([{ ball: copy(data.pl3q2zxfs) }]) // 组选复式
      result.sorts.push([{ sg: 1, data: data.pl3q2zxds[0], l: 2 }]) // 单式
      result.sorts.push([{ ball: copy(data.pl3q2zuxhz) }]) // 前二 组选和值
      result.sorts.push([{ ball: copy(data.pl3q2zxbd) }]) // 包胆
      break
    case 'yx':
      result.remark = data.pl3dwdfs[0].remark
      result.sort = (['百位', '十位', '个位'].map(title => ({ title, ball: copy(data.pl3dwdfs) }))) // 1星复式
      break
    case 'bdw':
      oddk = ['pl3ymbdw', 'pl3rmbdw']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '一码' }, { name: '二码' }]
      result.sorts = []
      result.sorts.push([{ ball: copy(data.pl3ymbdw) }]) // 一码
      result.sorts.push([{ ball: copy(data.pl3rmbdw) }]) // 二码
      break
    case 'sx': // 'pl3zxds', 'pl3zuxhh', 'pl3zsds', 'pl3zlds'
      oddk = ['pl3zxfs', 'pl3zxds', 'pl3hzzx', 'pl3kd', 'pl3zuxhz', 'pl3zux3', 'pl3zux6', 'pl3zuxbd', 'pl3zuxhh', 'pl3zsds', 'pl3zlds']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '直选复式' }, { name: '直选单式' }, { name: '直选和值' }, { name: '跨度' }, { name: '组选和值' }, { name: '组三' }, { name: '组六' }, { name: '包胆', bd: 1 },
        { name: '混合组选' }, { name: '组三单式' }, { name: '组六单式' }]
      result.sorts = []
      result.sorts.push(['百位', '十位', '个位'].map(title => ({ title, ball: copy(data.pl3zxfs) }))) // 直选复式
      result.sorts.push([{ sg: 1, data: data.pl3zxds[0], l: 3 }]) // 单式
      result.sorts.push([{ ball: copy(data.pl3hzzx) }]) // 直选和值
      result.sorts.push([{ ball: copy(data.pl3kd) }]) // 跨度
      result.sorts.push([{ ball: copy(data.pl3zuxhz) }]) // 三星组选和值
      result.sorts.push([{ ball: copy(data.pl3zux3) }]) // 组三
      result.sorts.push([{ ball: copy(data.pl3zux6) }]) // 组六
      result.sorts.push([{ ball: copy(data.pl3zuxbd) }]) // 包胆
      result.sorts.push([{ sg: 1, data: data.pl3zuxhh[0], l: 3 }]) // 单式
      result.sorts.push([{ sg: 1, data: data.pl3zsds[0], l: 3 }]) // 单式
      result.sorts.push([{ sg: 1, data: data.pl3zlds[0], l: 3 }]) // 单式
      break
    case 'lm':
      oddk = ['dxdsq2', 'dxdsh2']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '前二' }, { name: '后二' }]
      result.sorts = []
      result.sorts.push(['百位', '十位'].map(title => ({ title, square: copy(data.dxdsq2) })))
      result.sorts.push(['十位', '个位'].map(title => ({ title, square: copy(data.dxdsh2) })))
      break
  }
  return handleRDChange(_this, result)
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
const sxzxhz = [1, 3, 6, 10, 15, 21, 28, 36, 45, 55, 63, 69, 73, 75, 75, 73, 69, 63, 55, 45, 36, 28, 21, 15, 10, 6, 3, 1]
const sxzxkd = [10, 54, 96, 126, 144, 150, 144, 126, 96, 54]
const sxzuxhz = [0, 1, 2, 2, 4, 5, 6, 8, 10, 11, 13, 14, 14, 15, 15, 14, 14, 13, 11, 10, 8, 6, 5, 4, 2, 2, 1]
const qezxhz = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1] // , zxhz2, zxkd2,zuxhz2
const qekd = [10, 18, 16, 14, 12, 10, 8, 6, 4, 2]
const qezuxhz = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 4, 4, 3, 3, 2, 2, 1, 1]
const zxdata = { sxzxhz, sxzxkd, sxzuxhz, qezxhz, qekd, qezuxhz }
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
  return { num, l: arr.map(_ => _.num || _.name).join() }
}
