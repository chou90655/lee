import { handleRDChange, chooseDataZh, sxIndex } from '../../util/tools'
const dxdsObj = {
  supbig: '特大',
  supsmall: '特小',
  supsingle: '特单',
  supdouble: '特双',
  supsumbig: '特合大',
  supsumsmall: '特合小',
  supsumsingle: '特合单',
  supsumdouble: '特合双',
  supbigdouble: '特大双',
  supsmalldouble: '特小双',
  supbigsingle: '特大单',
  supsmallsingle: '特小单',
  supendbig: '特尾大',
  supendsmall: '特尾小',
  red: '红波',
  blue: '绿波',
  green: '蓝波'
}
const sxObj = {
  rat: { name: '鼠', beast: 1 },
  cow: { name: '牛' },
  tiger: { name: '虎', beast: 1 },
  rabbit: { name: '兔', beast: 1 },
  dragon: { name: '龙', beast: 1 },
  snake: { name: '蛇', beast: 1 },
  horse: { name: '马' },
  sheep: { name: '羊' },
  monkey: { name: '猴', beast: 1 },
  chicken: { name: '鸡' },
  dog: { name: '狗' },
  pig: { name: '猪' }
}
const zhObj = {
  sumbig: '总和大',
  sumsmall: '总和小',
  sumsingle: '总和单',
  sumdouble: '总和双'
}
const wxObj = {
  gold: { name: '金', numbers: [5, 6, 19, 20, 27, 28, 35, 36, 49] },
  wood: { name: '木', numbers: [1, 2, 9, 10, 17, 18, 31, 32, 39, 40, 47, 48] },
  water: { name: '水', numbers: [7, 8, 15, 16, 23, 24, 33, 38, 45, 46] },
  fire: { name: '火', numbers: [3, 4, 11, 12, 25, 26, 33, 34, 41, 42] },
  soil: { name: '土', numbers: [13, 14, 21, 22, 29, 30, 43, 44] }
}
const red = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blue = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const green = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]
const bbObj = {
  hongdan: { name: '红单', numbers: red.filter(_ => _ % 2) },
  hongshuang: { name: '红双', numbers: red.filter(_ => !(_ % 2)) },
  hongda: { name: '红大', numbers: red.filter(_ => _ > 24) },
  hongxiao: { name: '红小', numbers: red.filter(_ => _ < 25) },
  honghedan: { name: '红合单', numbers: [1, 7, 12, 18, 23, 29, 30, 34, 35] },
  hongheshuang: { name: '红合双', numbers: [2, 8, 13, 19, 24, 35, 40, 46] },
  landan: { name: '蓝单', numbers: blue.filter(_ => _ % 2) },
  lanshuang: { name: '蓝双', numbers: blue.filter(_ => !(_ % 2)) },
  landa: { name: '蓝大', numbers: blue.filter(_ => _ > 24) },
  lanxiao: { name: '蓝小', numbers: blue.filter(_ => _ < 25) },
  lanhedan: { name: '绿合单', numbers: [3, 9, 10, 14, 25, 36, 41, 47] },
  lanheshuang: { name: '绿合双', numbers: [4, 15, 20, 26, 31, 37, 42, 48] },
  lvdan: { name: '绿单', numbers: green.filter(_ => _ % 2 && _ < 49) },
  lvshuang: { name: '绿双', numbers: green.filter(_ => !(_ % 2)) },
  lvda: { name: '绿大', numbers: green.filter(_ => _ > 24 && _ < 49) },
  lvxiao: { name: '绿小', numbers: green.filter(_ => _ < 25) },
  lvhedan: { name: '绿合单', numbers: [5, 16, 21, 27, 32, 38, 43] },
  lvheshuang: { name: '绿合双', numbers: [6, 16, 22, 28, 32, 38, 44] }
}
const hndleQm = (code) => {
  switch (true) {
    case code.includes('single') : return '单' + code.split('single')[1]
    case code.includes('double') : return '双' + code.split('double')[1]
    case code.includes('big') : return '大' + code.split('big')[1]
    case code.includes('small') : return '小' + code.split('small')[1]
  }
}

const sxArr1 = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
let sxArr = [...sxArr1]
sxArr.push(...sxArr.splice(0, sxIndex))
const hndleSx = (tc, num = 50) => {
  return [1, 2, 3, 4, 5].map(_ => _ * 12 - sxArr.indexOf(tc)).filter(_ => _ < num)
}
const hndleTmtw = (_) => {
  const code = _.playCode
  const index = +code[0]
  if (code.includes('end')) {
    _.name = index + '尾'
    _.numbers = handleWs(index)
  } else {
    _.name = index + '头'
    _.numbers = Array(10).fill(1).map((_, i) => index * 10 + i).filter(_ => _ > 0)
  }
}
const handleWs = (index) => {
  return [0, 10, 20, 30, 40].map(_ => _ + index).filter(_ => _ > 0)
}
const hndleZm = (code) => {
  switch (true) {
    case code.includes('sumsingle') : return '合单'
    case code.includes('sumdouble') : return '合双'
    case code.includes('sumsmall') : return '合小'
    case code.includes('sumbig') : return '合大'
    case code.includes('single') : return '单'
    case code.includes('double') : return '双'
    case code.includes('big') : return '大'
    case code.includes('small') : return '小'
    case code.includes('red') : return '红波'
    case code.includes('blue') : return '绿波'
    case code.includes('green') : return '蓝波'
  }
}

const chooseDataTt = (arr, re) => { // 拖头投注
  const locks = arr.filter(_ => _.lock)
  arr.filter(_ => !_.lock).forEach(_ => re.push(locks.concat(_)))
}

const hdnb = (item, num = 50) => Array(num).fill(1).map((_, i) => ({ ...item, name: i, num: i }))
const hd12sx = (item) => sxArr1.map((_, i) => ({ ...item, name: _, num: _, numbers: hndleSx(_) }))
export const filter = (data) => {
  if (!data) return
  let res = { tmlm: [], bb: [], sxtx: [], sx1x: [], qm: [], tmb: [], tmblm: [], zmb: [], zmblm: [] }
  const zmArr = ['zm1', 'zm2', 'zm3', 'zm4', 'zm5', 'zm6']
  zmArr.forEach(_ => { res[_] = [] })
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    let name
    switch (true) {
      case tcode === 'tmzx': res[tcode] = hdnb(_).slice(1); break // 特码 数字
      case tcode.includes('tmlm'): name = _.title.slice(2); res.tmlm.push({ ..._, name, num: name }); break // 特码lm
      case tcode === 'zmrx': res[tcode] = hdnb(_).slice(1); break // 正码 任选
      case ['zm1t', 'zm2t', 'zm3t', 'zm4t', 'zm5t'].includes(tcode): res[tcode] = hdnb(_).slice(1); break // 正码 数字
      case tcode.includes('zm') && tcode.includes('lm'): name = _.title.slice(2); res['zm' + tcode[2]].push({ ..._, name, num: name }); break // 正码 lm
      case ['lm3qz', 'lm3z2', 'lm2qz', 'lm2zt', 'lmtc'].includes(tcode): res[tcode] = hdnb(_).slice(1); break // 连码
      case !!bbObj[tcode]: res.bb.push({ ..._, ...bbObj[tcode], num: _.title }); break // 半波
      case tcode.includes('sxtx'): name = _.title.slice(2); res.sxtx.push({ ..._, name, numbers: hndleSx(name), num: name }); break // 特肖
      case tcode.includes('sx1x'): name = _.title.slice(2); res.sx1x.push({ ..._, name, numbers: hndleSx(name), num: name }); break // 1肖
      case ['sx2xl', 'sx3xl', 'sx4xl'].includes(tcode): res[tcode] = hd12sx(_); break // 连码
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
    case 'sx':
      result.groups = [data.sxtx, data.sx1x, data.sx2xl, data.sx3xl, data.sx4xl]
      result.rodio = [{ name: '特肖' }, { name: '一肖' }, { name: '二肖连' }, { name: '三肖连' }, { name: '四肖连' }]
      break
    case 'tm': result.ball = data.tmzx; result.square = data.tmlm; break
    case 'zm':
      result.balls = [data.zmrx, data.zm1t, data.zm2t, data.zm3t, data.zm4t, data.zm5t]
      result.squares = [[], data.zm1, data.zm2, data.zm3, data.zm4, data.zm5]
      result.rodio = [{ name: '任选' }, { name: '正1特' }, { name: '正2特' }, { name: '正3特' }, { name: '正4特' }, { name: '正5特' }]
      break
    case 'bb': result.group = data.bb; break
    case 'lm':
      result.odds = 1
      // const sze = data.sze[0].odds.split('/')
      // const ezt = data.ezt[0].odds.split('/')
      result.balls = ['lm3qz', 'lm3z2', 'lm2qz', 'lm2zt', 'lmtc'].map(_ => data[_]) // 'lm3qz', 'lm3z2', 'lm2qz', 'lm2zt', 'lmtc'
      result.rodio = [{ name: '三全中', odds: '三全中' }, { name: '三中二', odds: '中二 ' + ('0.00') + '  中三 ' + 'sze[0]' },
        { name: '二全中', odds: 'data.eqz[0].odds' }, { name: '二中特', odds: '中特 ' + '0.00' + '  中二 + ezt[0]' }, { name: '特串', odds: 'dc' } ]
      break

    case 'gg':
      result.sort = []
      result.sort.push({ title: '正码1', square: data.zm1 })
      result.sort.push({ title: '正码2', square: data.zm2 })
      result.sort.push({ title: '正码3', square: data.zm3 })
      result.sort.push({ title: '正码4', square: data.zm4 })
      result.sort.push({ title: '正码5', square: data.zm5 })
      result.sort.push({ title: '正码6', square: data.zm6 })
      break
    case 'tx': result.group = data.tx; result.aid = [{ title: '家禽' }, { title: '野兽' }]; break
    case 'tmtw': result.group = data.tmtw; break
    case 'wx': result.group = data.wx; break
    case 'qm': result.square = data.qm; break
    case 'lx':
      result.rodio = [{ name: '二肖' }, { name: '三肖' }, { name: '四肖' }, { name: '五肖' }, { name: '六肖' }]
      result.groups = [data.ex, data.sx, data.sixiao, data.wuxiao, data.liuxiao]
      break
    case 'yxws':
      const zod = [{ title: '家禽' }, { title: '野兽' }]
      const num = [{ title: '尾单', type: 'num' }, { title: '尾双', type: 'num' }, { title: '尾大', type: 'num' }, { title: '尾小', type: 'num' }]
      result.rodio = [{ name: '一肖', aid: zod }, { name: '一肖不中', aid: zod }, { name: '尾数', aid: num }, { name: '尾数不中', aid: num }]
      result.groups = [data.yixiao, data.yxbz, data.yxws_, data.yxws_b]
      break
    case 'sxl':
      result.bet = ['复式投注', '拖头投注']
      result.rodio = [{ name: '二肖连[中]' }, { name: '三肖连[中]' }, { name: '四肖连[中]' }, { name: '五肖连[中]' }, { name: '二肖连[不中]' }, { name: '三肖连[不中]' }, { name: '四肖连[不中]' }, { name: '五肖连[不中]' }]
      result.groups = [data.exlz, data.sxlz, data.sixlz, data.wxlz, data.exlbz, data.sxlbz, data.sixlbz, data.wxlbz]
      break
    case 'wsl':
      result.bet = ['复式投注', '拖头投注']
      result.rodio = [{ name: '二尾连[中]' }, { name: '三尾连[中]' }, { name: '四尾连[中]' }, { name: '二尾连[不中]' }, { name: '三尾连[不中]' }, { name: '四尾连[不中]' }]
      result.groups = [data.ewlz, data.swlz, data.siwlz, data.ewlbz, data.swlbz, data.siwlbz]
      break
    case 'bz':
      result.odds = 1
      result.bet = ['复式投注', '拖头投注']
      result.rodio = [{ name: '五不中', odds: data.wbz[0].odds }, { name: '六不中', odds: data.lbz[0].odds }, { name: '七不中', odds: data.qibz[0].odds },
        { name: '八不中', odds: data.babz[0].odds }, { name: '九不中', odds: data.jbz[0].odds }, { name: '十不中', odds: data.shibz[0].odds }]
      result.balls = [data.wbz, data.lbz, data.qibz, data.babz, data.jbz, data.shibz]
      break
    case 'dxzy':
      result.odds = 1
      result.bet = ['复式投注', '拖头投注']
      result.rodio = [{ name: '五选中一', odds: data.wxzy[0].odds }, { name: '六选中一', odds: data.lxzy[0].odds }, { name: '七选中一', odds: data.qxzy[0].odds },
        { name: '八选中一', odds: data.bxzy[0].odds }, { name: '九选中一', odds: data.jxzy[0].odds }, { name: '十选中一', odds: data.sxzy[0].odds }]
      result.balls = [data.wxzy, data.lxzy, data.qxzy, data.bxzy, data.jxzy, data.sxzy]
      break
    case 'tpz':
      result.odds = 1
      result.bet = ['复式投注', '拖头投注']
      result.rodio = [{ name: '一粒任中', odds: data.ylrz[0].odds }, { name: '二粒任中', odds: data.elrz[0].odds }, { name: '三粒任中', odds: data.sanlrz[0].odds },
        { name: '四粒任中', odds: data.silrz[0].odds }, { name: '五粒任中', odds: data.wlrz[0].odds }]
      result.balls = [data.ylrz, data.elrz, data.sanlrz, data.silrz, data.wlrz]
      break
  }
  return handleRDChange(_this, result)
}
export const handleZx = (data, index, list, type) => {
  if (data.length >= index) {
    const combination = []
    let { typeCode, typeName, odds } = data[0]
    type ? chooseDataTt(data, combination) : chooseDataZh(data, index, combination)
    list.push(...combination.map(_ => ({ odds: Math.min(..._.map(i => i.odds)) || odds, typeCode, typeName, name: _.map(i => i.name).join(), playCode: _.map(i => i.playCode).join('@') })))
  } else {
    list.err = '选择不能少于' + index + '个'
  }
}
export const getColor = (n) => {
  switch (true) {
    case red.includes(n): return 'red_b'
    case blue.includes(n): return 'blue_b'
    case green.includes(n): return 'green_b'
  }
}
