import { handleRDChange, copy, filt, chooseDataZh } from '../../util/tools'
const handleSg = (res, _) => {
  const code = _.playid
  switch (true) {
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('odd') : _.name = '单'; break
    case code.includes('even') : _.name = '双'; break
    default: _.name = _.playid.slice(4); break
  }
  res.push(_)
}
const dl = [11, 22, 33, 44, 55, 66]
const sg = [1, 2, 3, 4, 5, 6]
const k3sthdx = (item) => [111, 222, 333, 444, 555, 666].map((name, i) => ({ ...item, name, num: name }))
const k3ethfx = (item) => dl.map((name, i) => ({ ...item, name, num: name }))
const k3slhdx = (item) => [123, 234, 345, 456].map((name, i) => ({ ...item, name, num: name }))
const k3sbthbz = (item) => sg.map((name, i) => ({ ...item, name, num: name }))
const k3ethdx = (item) => {
  const arr = []
  dl.forEach((_, i) => {
    const sg1 = [...sg]
    sg1.splice(i, 1)
    arr.push(...sg1.map(j => '' + _ + j))
  })
  return arr.map((name, i) => ({ ...item, name, num: name }))
}
export const filter = (data) => { // ruleName
  if (!data) return
  const res = { k3hz: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    switch (true) {
      case tcode.includes('k3hz'): handleSg(res.k3hz, _); break // 和值
      case ['k3slhdx'].includes(tcode): res[tcode] = k3slhdx(_); break //  三连号单选
      case ['k3sthtx'].includes(tcode): res[tcode] = [{ ..._, name: '通选', num: '三同号通选' }]; break //  三同号通选
      case ['k3sbthbz'].includes(tcode): res[tcode] = k3sbthbz(_); break //  三不同号
      case ['k3sthdx'].includes(tcode): res[tcode] = k3sthdx(_); break //  三同号单选
      case ['k3ebthbz'].includes(tcode): res[tcode] = k3sbthbz(_); break //  二不同号标准
      case ['k3ethfx'].includes(tcode): res[tcode] = k3ethfx(_); break //  二同号复选
      case ['k3ethdx'].includes(tcode): res[tcode] = k3ethdx(_); break //  二同号单选
      case ['k3slhtx'].includes(tcode): res[tcode] = [{ ..._, name: '通选', num: '三连号通选' }]; break //  三连号通选
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  const result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'eth':
      result.rodio = [{ name: '复选' }, { name: '单选', hc: 1 }]
      result.sorts = [[{ ball: copy(data.k3ethfx) }], [{ ball: copy(data.k3ethdx) }]]
      break // 二同号
    case 'ebth':result.ball = data.k3ebthbz; break // 二不同号标准
    case 'hz':result.square = data.k3hz; break // 和值
    case 'sht':result.ball = [...data.k3sthdx, ...data.k3sthtx]; break // 三同号
    case 'sbth':result.ball = data.k3sbthbz; break // 三不同号
    case 'slh':result.ball = [...data.k3slhdx, ...data.k3slhtx]; break // 三连号
    case 'wq':result.ball = data.ws; break // 三同号
  }
  return handleRDChange(_this, result)
}

export const hdwx = (da, yq, pls) => {
  let data = da.map(_ => filt(_.ball || _.square))
  let list = []
  const ei = yq.findIndex((_, i) => _.n > data[i].length)
  if (data.every(_ => !_.length)) list.err = '至少选择一个号码'
  else if (ei > -1) list.err = `${da[ei].title || ''}至少选择${yq[ei].n}个`
  else {
    const hastx = data[0].findIndex(_ => ['k3slhtx', 'k3sthtx'].includes(_.playid))
    if (pls) {
      data = data[0].map(_ => [_])
      const d3 = data.map((_, i) => hditem(_, 1))
      list = data.map((_, i) => ({ ..._[0], zhushu: d3[i].num, number: d3[i].l }))
    } else if (hastx > -1) {
      const d1 = data[0].splice(hastx, 1)
      data = [data[0], d1].filter(_ => _.length)
      const d2 = data.map((_, i) => hditem(_, 1))
      list = data.map((_, i) => ({ ..._[0], zhushu: d2[i].num, number: d2[i].l }))
    } else {
      const d = data.map((_, i) => hditem(_, yq[i].n))
      list.push({ ...data[0][0], zhushu: d.reduce((a, c) => a * c.num, 1), number: d.map(_ => _.l).join('|') })
    }
  }
  return list
}
const hditem = (arr, num1) => {
  let num = 0
  const combination = []
  chooseDataZh([...arr], num1, combination)
  num = combination.length
  return { num, l: arr.map(_ => _.num || _.name).join('#') }
}
