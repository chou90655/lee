import { handleRDChange } from '../../util/tools'
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
  const code = _.playCode
  switch (true) {
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('single') : _.name = '单'; break
    case code.includes('double') : _.name = '双'; break
    case code.includes('dragon') : _.name = '龙'; break
    case code.includes('tiger') : _.name = '虎'; break
    default: _.name = tri ? _.playCode.slice(3, 5) : _.playCode.slice(2, 4); break
  }
  res.push(_)
}

const handleGy = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('big') : _.name = '冠亚大'; break
    case code.includes('small') : _.name = '冠亚小'; break
    case code.includes('single') : _.name = '冠亚单'; break
    case code.includes('double') : _.name = '冠亚双'; break
    default: _.name = _.playCode.slice(4, 6); break
  }
  res.push(_)
}
export const filter = (data) => { // ruleName
  if (!data) return
  let res = { sum: [], gyj: [], 10: [] }
  const ysArr = ['1', '2', '3', '4', '5', '6', '7', '8', '9']
  ysArr.forEach(_ => (res[_] = []))
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const tcode = _.typeCode
    switch (true) {
      case tcode[1] === '0': handleYs(res[10], _, 1); break // 十名
      case ysArr.includes(tcode[0]): handleYs(res[tcode[0]], _); break // 一九名
      case tcode.includes('gyj'): handleGyj(res.gyj, _); break // 冠亚季
      case tcode.includes('sum'): handleGy(res.sum, _); break // 冠亚
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
      result.ball = data[1].filter(_ => _.typeCode === '1')
      result.square = data[1].filter(_ => _.typeCode.indexOf('1-') === 0)
      result.checkbox = [
        { name: '冠军', value: 1 }, { name: '亚军', value: 2 }, { name: '第三名', value: 3 },
        { name: '第四名', value: 4 }, { name: '第五名', value: 5 }, { name: '第六名', value: 6 },
        { name: '第七名', value: 7 }, { name: '第八名', value: 8 }, { name: '第九名', value: 9 },
        { name: '第十名', value: 10 }
      ]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '冠军', square: data[1].filter(_ => _.typeCode.indexOf('1-') === 0) })
      result.sort.push({ title: '亚军', square: data[2].filter(_ => _.typeCode.indexOf('2-') === 0) })
      result.sort.push({ title: '第三名', square: data[3].filter(_ => _.typeCode.indexOf('3-') === 0) })
      result.sort.push({ title: '第四名', square: data[4].filter(_ => _.typeCode.indexOf('4-') === 0) })
      result.sort.push({ title: '第五名', square: data[5].filter(_ => _.typeCode.indexOf('5-') === 0) })
      result.sort.push({ title: '第六名', square: data[6].filter(_ => _.typeCode.indexOf('6-') === 0) })
      result.sort.push({ title: '第七名', square: data[7].filter(_ => _.typeCode.indexOf('7-') === 0) })
      result.sort.push({ title: '第八名', square: data[8].filter(_ => _.typeCode.indexOf('8-') === 0) })
      result.sort.push({ title: '第九名', square: data[9].filter(_ => _.typeCode.indexOf('9-') === 0) })
      result.sort.push({ title: '第十名', square: data[10].filter(_ => _.typeCode.indexOf('10-') === 0) })
      result.sort.push({ title: '冠、亚军和', square: data.sum.filter(_ => _.typeCode.indexOf('sum-') === 0) })
      break
    case 'hz':
      result.ball = data.sum.filter(_ => _.typeCode === 'sum')
      result.square = data.sum.filter(_ => _.typeCode.indexOf('sum-') === 0)
      break
    case 'gyj':
      result.ball = data.gyj.filter(_ => _.typeCode === 'sum-gyj')
      result.square = data.gyj.filter(_ => _.typeCode.indexOf('sum-gyj-') === 0)
      break
    default:
      result.ball = data[key] && data[key].filter(_ => _.typeCode === key)
      result.square = data[key] && data[key].filter(_ => _.typeCode.indexOf(key + '-') === 0)
      break
  }
  return handleRDChange(_this, result)
}
