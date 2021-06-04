import { handleRDChange, chooseDataZh, chooseDataPl, copy, filt } from '../../util/tools'
const yxfs = (item, i = 11) => {
  return Array(i).fill(1).map((_, i) => ({ ...item, name: i + 1, num: i + 1 }))
}
const hddds = (item, odd) => ['5单0双', '4单1双', '3单2双', '2单3双', '1单4双', '0单5双'].map((_, i) => ({ ...item, name: _, num: i + 1, odds: (+odd[i]).toFixed(2) }))
const hdczw = (item) => Array(7).fill(1).map((_, i) => ({ ...item, name: i + 3, num: i + 3 }))
export const filter = (data) => {
  if (!data) return
  let res = { }
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    switch (true) {
      case ['x5qsfs', 'x5qszx', 'x5qsdt'].includes(tcode): res[tcode] = yxfs(_); break // 前三直选复式 前三组选复式 前三组选胆拖
      case ['x5qezx', 'x5qezx', 'x5qedt'].includes(tcode): res[tcode] = yxfs(_); break // 前二直选复式  前二组选复式 前二组选胆拖 // em
      case ['x5bdwqs', 'x5dwd'].includes(tcode): res[tcode] = yxfs(_); break // 前三不定位 定位胆// em
      case ['x5dds'].includes(tcode): res[tcode] = hddds(_, _.maxjj.split('|')); break //  定单双
      case ['x5czw'].includes(tcode): res[tcode] = hdczw(_); break //  猜中位
      case tcode.includes('x5rx') && !tcode.includes('x5rxds'): res[tcode] = yxfs(_); break // 任选复式
      case tcode.includes('x5dt'): res[tcode] = yxfs(_); break // 胆拖
    }
  })
  return res
}
export const hndleData = (_this, data, key) => {
  let result = {}
  console.log(data)
  let oddk
  if (!data) return result
  _this.storeData = data
  switch (key) { // dwd
    case 'rxdt':
      oddk = ['x5dt2z2', 'x5dt3z3', 'x5dt4z4', 'x5dt5z5', 'x5dt6z5', 'x5dt7z5', 'x5dt8z5']
      result.rodio = ['二中二', '三中三', '四中四', '五中五', '六中五', '七中五', '八中五'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.odds = 1
      result.sorts = oddk.map(_ => [{ title: '胆码', ball: copy(data[_]) }, { title: '拖码', ball: copy(data[_]) }])
      break
    case 'rxfs':
      oddk = ['x5rx1z1', 'x5rx2z2', 'x5rx3z3', 'x5rx4z4', 'x5rx5z5', 'x5rx6z5', 'x5rx7z5', 'x5rx8z5']
      result.rodio = ['一中一', '二中二', '三中三', '四中四', '五中五', '六中五', '七中五', '八中五'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.odds = 1
      result.sorts = oddk.map(_ => [{ ball: copy(data[_]) }])
      break
    case 'qwx':
      oddk = ['x5dds', 'x5czw']
      result.rodio = ['定单双', '猜中位'].map((name, i) => ({ name }))
      result.sorts = []
      result.sorts.push([{ square: copy(data.x5dds) }])
      result.sorts.push([{ ball: copy(data.x5czw) }])
      break
    case 'dwd':
      result.odds = data.x5dwd[0].odds
      result.sort = ['第一位', '第二位', '第三位'].map(_ => ({ title: _, ball: copy(data.x5dwd) })) // 定位胆
      break
    case 'bdw':
      result.odds = data.x5bdwqs[0].odds
      result.ball = copy(data.x5bdwqs) // 前三不定位
      break
    case 'em':
      oddk = ['x5qezx', 'x5qezx', 'x5qedt']
      result.rodio = ['直选复式', '组选复式', '组选胆拖'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.sorts = []
      result.odds = 1
      result.sorts.push(['第一位', '第二位'].map(_ => ({ title: _, ball: copy(data.x5qezx) }))) // 直选复式
      result.sorts.push([{ ball: copy(data.x5qezx) }]) // 组选复式
      result.sorts.push(['胆码', '拖码'].map(_ => ({ title: _, ball: copy(data.x5qedt) }))) // 组选胆拖
      break
    case 'sm':
      oddk = ['x5qsfs', 'x5qszx', 'x5qsdt']
      result.rodio = ['直选复式', '组选复式', '组选胆拖'].map((name, i) => ({ name, odds: data[oddk[i]][0].odds }))
      result.sorts = []
      result.odds = 1
      result.sorts.push(['第一位', '第二位', '第三位'].map(_ => ({ title: _, ball: copy(data.x5qsfs) }))) // 直选复式
      result.sorts.push([{ ball: copy(data.x5qszx) }]) // 组选复式
      result.sorts.push(['胆码', '拖码'].map(_ => ({ title: _, ball: copy(data.x5qsdt) }))) // 组选胆拖
      break
  }
  return handleRDChange(_this, result)
}
export const handleZx = (data, index, list, type) => {
  if (data.length >= index) {
    const combination = []
    const { odds, typeCode, typeName } = data[0]
    type ? chooseDataPl(data, index, combination) : chooseDataZh(data, index, combination)
    list.push(...combination.map(_ => ({ odds, typeCode, typeName, name: _.map(i => i.name).join(), playCode: _.map(i => i.playCode).join('@') })))
  } else {
    list.err = '选择不能少于' + index + '个'
  }
}
export const getColor = (n) => {
  switch (true) {
    case [2, 5, 8, 11].includes(n): return 'blue_b'
    case [1, 3, 4, 6, 7, 9, 10].includes(n): return 'green_b'
  }
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
  else if (yq[0].t === 7) {
    const d = data.map((_, i) => hditem(_, yq[i].n || 1, yq[i].t, yq[i].k, yq[i]))
    list.push({ ...data[0][0], zhushu: hdqc(d.map(_ => _.l.split(','))), number: d.map(_ => _.l).join('|') })
  } else {
    const d = data.map((_, i) => hditem(_, yq[i].n || 1, yq[i].t, yq[i].k, yq[i]))
    list.push({ ...data[0][0], zhushu: d.reduce((a, c) => pls ? (a + c.num) : (a * c.num), pls ? 0 : 1), number: d.map(_ => _.l).join('|') })
  }
  return list
}
const hdqc = (arr) => {
  let arr1 = arr[0].map(_ => [_])
  arr.forEach((_, i) => {
    const ar = []
    if (i) {
      arr1.forEach(j => {
        ar.push(..._.map(k => [...j, k]))
      })
      arr1 = ar
    }
  })
  arr1 = arr1.map(_ => [...new Set(_)]).filter(_ => _.length >= arr.length)
  return arr1.length
}
const hditem = (arr, num1, type, key, yq) => {
  let num = 0
  if (type === 5) num = arr.length
  else {
    const combination = []
    chooseDataZh(arr, num1, combination)
    num = combination.length
    if (type === 6) num *= 2
  }
  num = yq.num || num
  return { num, l: arr.map(_ => _.name || _.num).join() }
}
