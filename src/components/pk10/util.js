import { handleRDChange, copy, chooseDataZh, filt } from '../../util/tools'
const handleGyj = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    default: _.name = _.playCode.slice(8, 10); break
  }
  res.push(_)
}
const handleYs = (res, _, tri) => {
  const code = _.playid
  switch (true) {
    case code.includes('da') : _.name = '大'; break
    case code.includes('xiao') : _.name = '小'; break
    case code.includes('dan') : _.name = '单'; break
    case code.includes('shuang') : _.name = '双'; break
    case code.includes('long') : _.name = '龙'; break
    case code.includes('hu') : _.name = '虎'; break
    default: _.name = tri ? _.playid.slice(6) : _.playid.split('m_hm').slice(-1)[0]; break
  }
  res.push(_)
}

const handleGy = (res, _) => {
  const code = _.playid
  switch (true) {
    case code.includes('big') : _.name = '冠亚大'; break
    case code.includes('small') : _.name = '冠亚小'; break
    case code.includes('single') : _.name = '冠亚单'; break
    case code.includes('double') : _.name = '冠亚双'; break
    default: _.name = _.playCode.slice(4, 6); break
  }
  res.push(_)
}
const ysArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
const hddfs = (item) => ysArr.map(_ => ({ ...item, name: _, num: _ }))
export const filter = (data) => { // ruleName
  if (!data) return
  let res = { gyh: [] }
  ysArr.forEach(_ => (res[_] = []))
  ysArr.forEach(_ => (res['hm' + _] = []))
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    switch (true) {
      case ['bjpk10qian1', 'bjpk10qian2', 'bjpk10qian3', 'bjpk10qian4', 'bjpk10qian5', 'bjpk10dwd'].includes(tcode): res[_.playid] = hddfs(_); break // 前1,2,3,4,5复式 定位胆
      case tcode[6] === '0': handleYs(res[10], _, 1); break // 十名 两面
      case ysArr.includes(tcode[5]): handleYs(res[tcode[5]], _); break // 一九名 两面
      case tcode.includes('gyh'): handleYs(res.gyh, _, 1); break // 冠亚和
      case tcode.includes('yzwm_d10'): handleYs(res.hm10, _); break // 十名
      case tcode.includes('yzwm_d'): handleYs(res['hm' + tcode[6]], _); break // 一九名
      // case tcode.includes('swh'): handleYs(res.swh, _, 1); break // 首尾和
      // case tcode.includes('gyj'): handleGyj(res.gyj, _); break // 冠亚季
      case tcode.includes('sum'): handleGy(res.sum, _); break // 冠亚
    }
  })
  return res
}
const rank = ['冠军', '亚军', '第三名', '第四名', '第五名', '第六名', '第七名', '第八名', '第九名', '第十名']
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  _this.storeData = data
  switch (key) { // ['bjpk10qian1', 'bjpk10qian2', 'bjpk10qian3', 'bjpk10qian4', 'bjpk10qian5', 'bjpk10dwd']
    case 'bjpk10qian1':result.ball = data[key]; break
    case 'bjpk10qian2':result.cqp = rank.slice(0, 2).map(title => ({ title, ball: copy(data[key]) })); break
    case 'bjpk10qian3':result.cqp = rank.slice(0, 3).map(title => ({ title, ball: copy(data[key]) })); break
    case 'bjpk10qian4':result.cqp = rank.slice(0, 4).map(title => ({ title, ball: copy(data[key]) })); break
    case 'bjpk10qian5':result.cqp = rank.slice(0, 5).map(title => ({ title, ball: copy(data[key]) })); break
    case 'bjpk10dwd':result.cqp = rank.map(title => ({ title, ball: copy(data[key]) })); break
    case '1z5':
      result.rodio = rank.slice(0, 5).map(name => ({ name }))
      result.balls = rank.slice(0, 5).map((_, i) => data['hm' + (i + 1)])
      break
    case '6z10':
      result.rodio = rank.slice(5, 10).map(name => ({ name }))
      result.balls = rank.slice(0, 5).map((_, i) => data['hm' + (i + 6)])
      break
    case 'swh':
      result.ball = data.swh.filter(_ => _.playid.includes('gyh_hm'))
      result.square = data.swh.filter(_ => !_.playid.includes('gyh_hm'))
      break
    case 'gyh':
      result.ball = data.gyh.filter(_ => _.playid.includes('gyh_hm'))
      result.square = data.gyh.filter(_ => !_.playid.includes('gyh_hm'))
      break
    case 'lm':
      result.sort = rank.map((_, i) => ({ title: _, square: data[i + 1] }))
      break
    case 'gyj':
      result.ball = data.gyj.filter(_ => _.typeCode === 'sum-gyj')
      result.square = data.gyj.filter(_ => _.typeCode.indexOf('sum-gyj-') === 0)
      break
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
    if (yq[0].t === 7) {
      const d = data.map((_, i) => hditem(_, yq[i].n || 1, yq[i].t, yq[i].k, yq[i]))
      list.push({ ...data[0][0], zhushu: hdqc(d.map(_ => _.l.split(','))), number: d.map(_ => _.l).join('|') })
    } else {
      const d = data.map((_, i) => hditem(_, yq[i].n))
      list.push({ ...data.find(_ => _.length)[0], zhushu: d.reduce((a, c) => pls ? (a + c.num) : (a * c.num), pls ? 0 : 1), number: d.map(_ => _.l).join('|') })
    }
  }
  return list
}
const hditem = (arr, num1) => {
  let num = 0
  const combination = []
  chooseDataZh([...arr], num1 || 1, combination)
  num = combination.length
  return { num, l: arr.map(_ => _.num || _.name).join() }
}

const hdqc = (arr) => {
  let arr1 = arr[0].map(_ => [_])
  arr.forEach((_, i) => {
    const ar = []
    if (i) {
      arr1.forEach(j => ar.push(..._.map(k => [...j, k])))
      arr1 = ar
    }
  })
  arr1 = arr1.map(_ => [...new Set(_)]).filter(_ => _.length >= arr.length)
  return arr1.length
}
