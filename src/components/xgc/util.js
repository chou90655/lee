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
  redsingle: { name: '红单', numbers: red.filter(_ => _ % 2) },
  reddouble: { name: '红双', numbers: red.filter(_ => !(_ % 2)) },
  redbig: { name: '红大', numbers: red.filter(_ => _ > 24) },
  redsmall: { name: '红小', numbers: red.filter(_ => _ < 25) },
  bluesingle: { name: '蓝单', numbers: blue.filter(_ => _ % 2) },
  bluedouble: { name: '蓝双', numbers: blue.filter(_ => !(_ % 2)) },
  bluebig: { name: '蓝大', numbers: blue.filter(_ => _ > 24) },
  bluesmall: { name: '蓝小', numbers: blue.filter(_ => _ < 25) },
  greensingle: { name: '绿单', numbers: green.filter(_ => _ % 2 && _ < 49) },
  greendouble: { name: '绿双', numbers: green.filter(_ => !(_ % 2)) },
  greenbig: { name: '绿大', numbers: green.filter(_ => _ > 24 && _ < 49) },
  greensmall: { name: '绿小', numbers: green.filter(_ => _ < 25) }
}
const hndleQm = (code) => {
  switch (true) {
    case code.includes('single') : return '单' + code.split('single')[1]
    case code.includes('double') : return '双' + code.split('double')[1]
    case code.includes('big') : return '大' + code.split('big')[1]
    case code.includes('small') : return '小' + code.split('small')[1]
  }
}

let sxArr = ['rat', 'cow', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'sheep', 'monkey', 'chicken', 'dog', 'pig']
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

export const filter = (data) => {
  if (!data) return
  let res = { tm: [], tmlm: [], tx: [], zm: [], sum: [], tmtw: [], wx: [], bb: [], qm: [], tmb: [], tmblm: [], zmb: [], zmblm: [] }
  const zmArr = ['zm1', 'zm2', 'zm3', 'zm4', 'zm5', 'zm6']
  zmArr.forEach(_ => { res[_ + '_'] = []; res[_ + '_1'] = [] })
  data.forEach(_ => {
    _.choose = false
    _.odds = _.odds || '0.00'
    const code = _.playCode
    const tcode = _.typeCode
    let key = ''
    switch (true) {
      case tcode === 'tm': _.name = code.slice(3, 5); res.tm.push(_); break // 特码A
      case tcode.includes('tmlm'): _.name = dxdsObj[code]; res.tmlm.push(_); break // 特码A 大小单双
      case tcode === 'tm-color': _.name = dxdsObj[code]; res.tmlm.push(_); break // 波色
      case tcode === 'tx':const tc = code.slice(3, 10); _.name = sxObj[tc].name; _.beast = sxObj[tc].beast; _.numbers = hndleSx(tc); res.tx.push(_); break // 特码生肖
      case tcode.includes('zmb-'): _.name = zhObj[code.slice(4)]; res.zmblm.push(_); break // 正码B
      case tcode === 'zm': _.name = code.slice(3, 5); res.zm.push(_); break // 正码A
      case tcode.includes('sum-'): _.name = zhObj[code]; res.sum.push(_); break // 正码A 大小单双
      case tcode === 'tmtw': hndleTmtw(_); res.tmtw.push(_); break // 特码头尾
      case tcode === 'wx': _.name = wxObj[code].name; _.numbers = wxObj[code].numbers; res.wx.push(_); break // 五行
      case tcode === 'bb': _.name = bbObj[code].name; _.numbers = bbObj[code].numbers; res.bb.push(_); break // 半波
      case tcode === 'qm': _.name = hndleQm(code); res.qm.push(_); break // 七码
      case zmArr.includes(tcode) : _.name = code.slice(4, 6); res[tcode + '_'].push(_); break // 正码1-6
      case zmArr.includes(tcode.slice(0, 3)) : _.name = hndleZm(code); res[tcode.slice(0, 3) + '_1'].push(_); break // 正码1-6
      case tcode === 'tmb': _.name = code.slice(5, 7); res.tmb.push(_); break // 特码B
      case tcode.includes('tmblm'): _.name = dxdsObj[code.split('b-')[1]]; res.tmblm.push(_); break // 特码B 大小单双
      case tcode.includes('tmb-'): _.name = dxdsObj[code.split('b-')[1]]; res.tmblm.push(_); break // 特码B 大小单双
      case tcode.includes('lm-'): _.name = code.slice(tcode.length + 1); key = code.split('-')[1]; if (!res[key]) res[key] = []; res[key].push(_); break // lm
      case tcode.includes('-gg'): _.name = hndleZm(code); key = code.split('-')[1]; if (!res[key]) res[key] = []; res[key].push(_); break // 过关
      case tcode.includes('lx-'): key = code.split('-'); const k1 = key[2] || key[1]; const k2 = tcode.slice(3); _.name = sxObj[k1].name; _.beast = sxObj[k1].beast; _.numbers = hndleSx(k1, 49); if (!res[k2]) res[k2] = []; res[k2].push(_); break // 六肖
      case tcode.includes('yxws-y'): key = code.split('-'); _.name = sxObj[key[2]].name; _.beast = sxObj[key[2]].beast; _.numbers = hndleSx(key[2]); if (!res[key[1]]) res[key[1]] = []; res[key[1]].push(_); break // 一肖
      case tcode === 'yxws-ws':const wId = code.slice(-1); _.name = wId + '尾'; _.numbers = handleWs(+wId); if (!res.yxws_) res.yxws_ = []; res.yxws_.push(_); break // 尾数
      case tcode === 'yxws-ws-bz-bz':const bId = code.slice(-1); _.name = bId + '尾'; _.numbers = handleWs(+bId); if (!res.yxws_b) res.yxws_b = []; res.yxws_b.push(_); break // 尾数不中
      case tcode.includes('sxl-'): key = code.split('-'); _.name = sxObj[key[2]].name; _.beast = sxObj[key[2]].beast; _.numbers = hndleSx(key[2]); if (!res[key[1]]) res[key[1]] = []; res[key[1]].push(_); break // 生肖连
      case tcode.includes('wsl-'): key = code.split('-')[1]; const wd = code.slice(-1); _.name = wd + '尾'; _.numbers = handleWs(+wd); if (!res[key]) res[key] = []; res[key].push(_); break // 尾数连
      case tcode.includes('bz-'): key = code.split('-'); _.name = key[2]; if (!res[key[1]]) res[key[1]] = []; res[key[1]].push(_); break // 不中
      case tcode.includes('dxzy-'): key = code.split('-'); _.name = key[2]; if (!res[key[1]]) res[key[1]] = []; res[key[1]].push(_); break // 多选中1
      case tcode.includes('tpz-'): key = code.split('-'); _.name = key[2]; if (!res[key[1]]) res[key[1]] = []; res[key[1]].push(_); break // 特平中
      case tcode === 'zmb': _.name = code.slice(4); res.zmb.push(_); break // 正码B
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
      result.balls = [data.tm, data.tmb, data.zm, data.zmb, data.zm1_, data.zm2_, data.zm3_, data.zm4_, data.zm5_, data.zm6_]
      result.squares = [data.tmlm, data.tmblm, data.sum, data.zmblm, data.zm1_1, data.zm2_1, data.zm3_1, data.zm4_1, data.zm5_1, data.zm6_1]
      result.rodio = [{ name: '特A' }, { name: '特B' }, { name: '正A' }, { name: '正B' }, { name: '正1特' }, { name: '正2特' }, { name: '正3特' }, { name: '正4特' }, { name: '正5特' }, { name: '正6特' }]
      break
    case 'tm':
      result.balls = [data.tm, data.tmb]
      result.squares = [data.tmlm, data.tmblm]
      result.rodio = [{ name: '特A' }, { name: '特B' }]
      break
    case 'zm':
      result.balls = [data.zm, data.zmb]
      result.squares = [data.sum, data.zmblm]
      result.rodio = [{ name: '正A' }, { name: '正B' }]
      break
    case 'zmt':
      result.balls = [data.zm1_, data.zm2_, data.zm3_, data.zm4_, data.zm5_, data.zm6_]
      result.squares = [data.zm1_1, data.zm2_1, data.zm3_1, data.zm4_1, data.zm5_1, data.zm6_1]
      result.rodio = [{ name: '正1特' }, { name: '正2特' }, { name: '正3特' }, { name: '正4特' }, { name: '正5特' }, { name: '正6特' }]
      break
    case 'lm':
      result.odds = 1
      const sze = data.sze[0].odds.split('/')
      const ezt = data.ezt[0].odds.split('/')
      result.balls = [data.eqz, data.ezt, data.tc, data.sze, data.sqz]
      result.rodio = [{ name: '二全中', odds: data.eqz[0].odds }, { name: '二中特', odds: '中特 ' + (ezt[1] || '0.00') + '  中二 ' + ezt[0] },
        { name: '特串', odds: data.tc[0].odds }, { name: '三中二', odds: '中二 ' + (sze[1] || '0.00') + '  中三 ' + sze[0] },
        { name: '三全中', odds: data.sqz[0].odds }]
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
    case 'bb': result.group = data.bb; break
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
