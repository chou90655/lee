import { handleRDChange, chooseDataZh, chooseDataPl } from '../../util/tools'
const handleDxdszh = (res, _, troggle) => {
  const code = _.playCode
  const pre = troggle ? '总和' : ''
  switch (true) {
    case code.includes('single') : _.name = pre + '单'; break
    case code.includes('double') : _.name = pre + '双'; break
    case code.includes('big') : _.name = pre + '大'; break
    case code.includes('small') : _.name = pre + '小'; break
    default: _.name = code.slice(2); break
  }
  res.push(_)
}
export const filter = (data) => {
  if (!data) return
  let res = { 1: [], 2: [], 3: [], 4: [], 5: [], sum: [], yzy: [], eze: [], szs: [], sizsi: [], wzw: [], lzw: [], qzw: [], bzw: [], zxqe: [], zxqs: [], zuxqe: [], zuxqs: [], lh: [] }
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const code = _.playCode
    const tcode = _.typeCode
    const ysqArr = ['1', '2', '3', '4', '5']
    switch (true) {
      case ysqArr.includes(tcode[0]) : handleDxdszh(res[tcode[0]], _); break // 一至五球
      case tcode === 'sum-b-s': handleDxdszh(res.sum, _, 1); break // 总和大小
      case tcode === 'sum-s-d': handleDxdszh(res.sum, _, 1); break // 总和单双
      case tcode === 'sum-w-b-s': _.name = code.includes('endbig') ? '总和尾大' : '总和尾小'; res.sum.push(_); break // 和尾数大小
      case tcode === 'zw': _.name = code.includes('single') ? '总和尾单' : '总和尾双'; res.sum.push(_); break // 和尾数单双
      case tcode === 'lh':_.name = code.includes('tiger') ? '虎' : '龙'; res.lh.push(_); break // 龙虎斗

      case tcode === 'rx-yzy': _.name = code.slice(7); res.yzy.push(_); break // 一中一
      case tcode === 'rx-eze': _.name = code.slice(7); res.eze.push(_); break // 二中二
      case tcode === 'rx-szs': _.name = code.slice(7); res.szs.push(_); break // 3中3
      case tcode === 'rx-sizsi': _.name = code.slice(9); res.sizsi.push(_); break // 4中4
      case tcode === 'rx-wzw': _.name = code.slice(7); res.wzw.push(_); break // 5中5
      case tcode === 'rx-lzw': _.name = code.slice(7); res.lzw.push(_); break // 6中5
      case tcode === 'rx-qzw': _.name = code.slice(7); res.qzw.push(_); break // 7中5
      case tcode === 'rx-bzw': _.name = code.slice(7); res.bzw.push(_); break // 8中5
      case tcode === 'zx-zxqe': _.name = code.slice(8); res.zxqe.push(_); break // 直选前二
      case tcode === 'zx-zxqs': _.name = code.slice(8); res.zxqs.push(_); break // 直选前3
      case tcode === 'zux-zuxqe': _.name = code.slice(10); res.zuxqe.push(_); break // 组选前2
      case tcode === 'zux-zuxqs': _.name = code.slice(10); res.zuxqs.push(_); break // 组选前三
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
      result.checkbox = [{ name: '一球', value: 1 }, { name: '二球', value: 2 }, { name: '三球', value: 3 }, { name: '四球', value: 4 }, { name: '五球', value: 5 }]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '第一球', square: data[1].filter(_ => _.typeCode.indexOf('1-') === 0) })
      result.sort.push({ title: '第二球', square: data[2].filter(_ => _.typeCode.indexOf('2-') === 0) })
      result.sort.push({ title: '第三球', square: data[3].filter(_ => _.typeCode.indexOf('3-') === 0) })
      result.sort.push({ title: '第四球', square: data[4].filter(_ => _.typeCode.indexOf('4-') === 0) })
      result.sort.push({ title: '第五球', square: data[5].filter(_ => _.typeCode.indexOf('5-') === 0) })
      result.sort.push({ title: '总和-龙虎和', square: [...data.sum, ...data.lh] })
      break
    case '1':
      result.ball = data[1].filter(_ => _.typeCode === '1')
      result.square = data[1].filter(_ => _.typeCode.indexOf('1-') === 0)
      break
    case '2':
      result.ball = data[2].filter(_ => _.typeCode === '2')
      result.square = data[2].filter(_ => _.typeCode.indexOf('2-') === 0)
      break
    case '3':
      result.ball = data[3].filter(_ => _.typeCode === '3')
      result.square = data[3].filter(_ => _.typeCode.indexOf('3-') === 0)
      break
    case '4':
      result.ball = data[4].filter(_ => _.typeCode === '4')
      result.square = data[4].filter(_ => _.typeCode.indexOf('4-') === 0)
      break
    case '5':
      result.ball = data[5].filter(_ => _.typeCode === '5')
      result.square = data[5].filter(_ => _.typeCode.indexOf('5-') === 0)
      break
    case 'zx':
      result.balls = [data.zxqe, data.zxqs]
      result.rodio = [{ name: '前二' }, { name: '前三' }]
      break
    case 'zux':
      result.balls = [data.zuxqe, data.zuxqs]
      result.rodio = [{ name: '前二' }, { name: '前三' }]
      break
    case 'rx':
      result.balls = [data.yzy, data.eze, data.szs, data.sizsi, data.wzw, data.lzw, data.qzw, data.bzw]
      result.rodio = [{ name: '一中一' }, { name: '二中二' }, { name: '三中三' }, { name: '四中四' }, { name: '五中五' }, { name: '六中五' }, { name: '七中五' }, { name: '八中五' }]
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
