
import { handleRDChange, chooseDataZh } from '../../util/tools'
const handleLs = (res, _) => {
  const code = _.playCode
  switch (true) {
    case code.includes('bao') : _.name = '豹子'; break
    case code.includes('ban') : _.name = '半顺'; break
    case code.includes('shun') : _.name = '顺子'; break
    case code.includes('dui') : _.name = '对子'; break
    case code.includes('za') : _.name = '杂六'; break
  }
  res.ls.push(_)
}
const prepbj = {
  bsh: '佰拾和',
  bgh: '佰个和',
  sgh: '拾个和'
}
const handleDxdszh = (res, _, trigger) => {
  const code = _.playCode
  let pre = trigger ? prepbj[_.typeCode] : ''
  switch (true) {
    case code.includes('single') : _.name = pre + '单'; break
    case code.includes('double') : _.name = pre + '双'; break
    case code.includes('big') : _.name = '大'; break
    case code.includes('small') : _.name = '小'; break
    case code.includes('zhi') : _.name = '质'; break
    case code.includes('sum') : _.name = '合'; break
  }
  res.push(_)
}
export const filter = (data) => {
  if (!data) return
  let res = { 1: [], 2: [], 3: [], dd: [], kd: [], ls: [], sum: [], lhh: [], bshws: [], bghws: [], sghws: [], bsghw: [], hsds: [] }
  Object.assign(res, { ezzh: [], szzh: [], bsdw: [], bgdw: [], gsdw: [], szdw: [] })
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const code = _.playCode
    const tcode = _.typeCode
    const ysqArr = ['1-b-s', '2-b-s', '3-b-s', '1-s-d', '2-s-d', '3-s-d', '1-z-h', '2-z-h', '3-z-h']
    const wsArr = ['bshws', 'bghws', 'sghws', 'bsghws', 'bshws-z-h', 'bghws-z-h', 'sghws-z-h', 'bsghws-z-h']
    const hsArr = ['bsh', 'bgh', 'sgh']
    const dwArr = ['ezdw-bsdw', 'ezdw-bgdw', 'ezdw-gsdw']
    const ezhsArr = ['bshs-ezhs', 'bghs-ezhs', 'sghs-ezhs', 'bshs-ws', 'bghs-ws', 'sghs-ws']
    const szhsArr = ['szhs', 'szhs-ws']
    switch (true) {
      case tcode === '1' || tcode === '2' || tcode === '3': _.name = code[2]; res[tcode].push(_); break // 一三球 数字
      case ysqArr.includes(tcode) : handleDxdszh(res[tcode[0]], _); break // 一三球 大小单双质合
      case tcode === 'dd':_.name = code[3]; res.dd.push(_); break // 独胆
      case tcode === 'kd':_.name = code[3]; res.kd.push(_); break // 跨度
      case tcode === 'ls': handleLs(res, _); break // 连3
      case tcode === 'sum-b-s': handleDxdszh(res.sum, _); break // 总和大小
      case tcode === 'sum-s-d': handleDxdszh(res.sum, _); break // 总和单双
      case tcode === 'lhh':_.name = code.includes('tiger') ? '虎' : code.includes('dragon') ? '龙' : '和'; res.lhh.push(_); break // 龙虎斗
      case wsArr.includes(tcode): handleDxdszh(res[tcode.slice(0, 5)], _); break // 和尾数
      case hsArr.includes(tcode): handleDxdszh(res.hsds, _, 1); break // 和数单双
      case tcode === 'ezzh': _.name = code.slice(-2); res.ezzh.push(_); break // 二字组合
      case tcode === 'szzh': _.name = code.slice(-3); res.szzh.push(_); break // 三字组合
      case dwArr.includes(tcode): _.name = code.slice(-2); res[tcode.slice(-4)].push(_); break // 二字定位
      case tcode === 'szdw': _.name = code.slice(-3); res.szdw.push(_); break // 三字定位
      case ezhsArr.includes(tcode):
        if (!res[tcode]) res[tcode] = []
        _.name = code.slice(tcode.length + 1); res[tcode].push(_); break // 二字和数 和数尾数
      case szhsArr.includes(tcode):
        if (!res[tcode]) res[tcode] = []
        _.name = code.slice(tcode.length + 1); res[tcode].push(_); break // 三字和数 和数尾数
      default:
        if (!res[tcode]) res[tcode] = []
        _.name = code.slice(tcode.length + 1); res[tcode].push(_); break // 组选系列
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
      result.checkbox = [{ name: '第一球', value: 1 }, { name: '第二球', value: 2 }, { name: '第三球', value: 3 }]
      break
    case 'lm':
      result.sort = []
      result.sort.push({ title: '百第一球', square: data[1].filter(_ => _.typeCode.indexOf('1-') === 0) })
      result.sort.push({ title: '十第二球', square: data[2].filter(_ => _.typeCode.indexOf('2-') === 0) })
      result.sort.push({ title: '个第三球', square: data[3].filter(_ => _.typeCode.indexOf('3-') === 0) })
      result.sort.push({ title: '龙虎和', square: data.lhh })
      result.sort.push({ title: '总和', square: data.sum })
      break
    case 'zsp':
      result.sort = []
      result.sort.push({ title: '百十和尾数', square: data.bshws })
      result.sort.push({ title: '百个和尾数', square: data.bghws })
      result.sort.push({ title: '十个和尾数', square: data.sghws })
      result.sort.push({ title: '百十个和尾数', square: data.bsghw })
      result.sort.push({ title: '和数单双', square: data.hsds })
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
    case 'zh':
      result.sort = []
      result.sort.push({ title: '跨度', ball: data.kd })
      result.sort.push({ title: '独胆', ball: data.dd })
      result.sort.push({ title: '连3', square: data.ls })
      break
    case 'ezzh':result.ball = data.ezzh; break
    case 'szzh':result.ball = data.szzh; break
    case 'ezdw':
      result.odds = 1
      result.balls = [data.bsdw, data.bgdw, data.gsdw]
      result.rodio = [{ name: '佰拾定位', odds: data.bsdw[0].odds },
        { name: '佰个定位', odds: data.bgdw[0].odds },
        { name: '拾个定位', odds: data.gsdw[0].odds }]
      break
    case 'szdw':
      result.odds = 1
      result.balls = [data.szdw.slice(0, 200), data.szdw.slice(200, 400), data.szdw.slice(400, 600), data.szdw.slice(600, 800), data.szdw.slice(800, 1000)]
      result.rodio = [
        { name: '000-199', odds: data.szdw[0].odds },
        { name: '200-399', odds: data.szdw[0].odds },
        { name: '400-599', odds: data.szdw[0].odds },
        { name: '600-799', odds: data.szdw[0].odds },
        { name: '800-999', odds: data.szdw[0].odds }]
      break
    case 'ezhs':
      result.rodio = [
        { name: '佰拾和数' },
        { name: '佰个和数' },
        { name: '拾个和数' }]
      result.sorts = [[], [], []]
      result.sorts[0].push({ title: '和数', square: data['bshs-ezhs'] })
      result.sorts[0].push({ title: '和数尾数', square: data['bshs-ws'] })
      result.sorts[1].push({ title: '和数', square: data['bghs-ezhs'] })
      result.sorts[1].push({ title: '和数尾数', square: data['bghs-ws'] })
      result.sorts[2].push({ title: '和数', square: data['sghs-ezhs'] })
      result.sorts[2].push({ title: '和数尾数', square: data['sghs-ws'] })
      break
    case 'szhs':
      result.sort = [
        { title: '三字和数', square: data['szhs'] },
        { title: '三字和数尾数', square: data['szhs-ws'] }
      ]
      break
    case 'zxs':
      result.odds = 1
      result.balls = [data['zxs-wws'], data['zxs-lws'], data['zxs-qws'], data['zxs-bws'], data['zxs-jws'], data['zxs-sws']]
      result.rodio = [
        { name: '5位数', odds: data['zxs-wws'][0].odds, value: 5 },
        { name: '6位数', odds: data['zxs-lws'][0].odds, value: 6 },
        { name: '7位数', odds: data['zxs-qws'][0].odds, value: 7 },
        { name: '8位数', odds: data['zxs-bws'][0].odds, value: 8 },
        { name: '9位数', odds: data['zxs-jws'][0].odds, value: 9 },
        { name: '10位数', odds: data['zxs-sws'][0].odds, value: 10 }]
      break
    case 'zxl':
      result.odds = 1
      result.balls = [data['zxl-sws'], data['zxl-wws'], data['zxl-lws'], data['zxl-qws'], data['zxl-bws']]
      result.rodio = [
        { name: '4位数', odds: data['zxl-sws'][0].odds, value: 4 },
        { name: '5位数', odds: data['zxl-wws'][0].odds, value: 5 },
        { name: '6位数', odds: data['zxl-lws'][0].odds, value: 6 },
        { name: '7位数', odds: data['zxl-qws'][0].odds, value: 7 },
        { name: '8位数', odds: data['zxl-bws'][0].odds, value: 8 }]
      break
  }
  return handleRDChange(_this, result)
}
export const handleZx = (data, index, list, type) => {
  const realIndex = index + (type ? 5 : 4)
  if (data.length >= realIndex) {
    const combination = []
    let { odds, typeCode, typeName } = data[0]
    chooseDataZh(data, realIndex, combination)
    list.push(...combination.map(_ => ({ odds, typeCode, typeName, name: _.map(i => i.name).join(), playCode: _.map(i => i.playCode).join('@') })))
  } else {
    list.err = '选择不能少于' + realIndex + '个'
  }
}
