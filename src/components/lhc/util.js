import { handleRDChange, chooseDataZh, sxIndex } from '../../util/tools'
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
const sxArr1 = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪']
let sxArr = [...sxArr1]
sxArr.push(...sxArr.splice(0, sxIndex))
const hndleSx = (tc, num = 50) => {
  return [1, 2, 3, 4, 5].map(_ => _ * 12 - sxArr.indexOf(tc)).filter(_ => _ < num)
}
const hndleTmtw = (_) => {
  const code = _.title
  const index = +code[0]
  if (code.includes('尾')) {
    _.name = index + '尾'
    _.num = index + '尾'
    _.numbers = handleWs(index)
  } else {
    _.name = index + '头'
    _.num = index + '头'
    _.numbers = Array(10).fill(1).map((_, i) => index * 10 + i).filter(_ => _ > 0)
  }
}
const handleWs = (index) => {
  return [0, 10, 20, 30, 40].map(_ => _ + index).filter(_ => _ > 0)
}

const chooseDataTt = (arr, re) => { // 拖头投注
  const locks = arr.filter(_ => _.lock)
  arr.filter(_ => !_.lock).forEach(_ => re.push(locks.concat(_)))
}

const hdnb = (item, num = 50) => Array(num).fill(1).map((_, i) => ({ ...item, name: i, num: i }))
const hd12sx = (item) => sxArr1.map((_, i) => ({ ...item, name: _, num: _, numbers: hndleSx(_) }))
const hdws = (item) => Array(10).fill(1).map((_, i) => ({ ...item, name: i + '尾', num: i + '尾', numbers: handleWs(i) }))
export const filter = (data) => {
  if (!data) return
  let res = { tmlm: [], bb: [], sxtx: [], sx1x: [], tmtw: [], tmb: [], tmblm: [], zmb: [], zmblm: [] }
  const zmArr = ['zm1', 'zm2', 'zm3', 'zm4', 'zm5', 'zm6']
  zmArr.forEach(_ => { res[_] = [] })
  data.forEach(_ => {
    _.choose = false
    _.odds = (+_.rate ? +_.rate : (+_.maxjj / 2))
    const tcode = _.playid
    let name
    switch (true) {
      case tcode.endsWith('bz'): res[tcode] = hdnb(_).slice(1); break // 不中
      case ['ws2wl', 'ws3wl', 'ws4wl'].includes(tcode): res[tcode] = hdws(_); break // 2,3,4尾连
      case tcode.endsWith('tou') || tcode.endsWith('wei'): hndleTmtw(_); res.tmtw.push(_); break // 特码头尾
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
  let oddk
  if (!data) return result
  _this.storeData = data
  switch (key) {
    case 'bz':
      result.odds = 1
      oddk = ['bz5bz', 'bz6bz', 'bz7bz', 'bz8bz', 'bz9bz', 'bz10bz']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.rodio = [{ name: '五不中', odds: data.bz5bz[0].odds }, { name: '六不中', odds: data.bz6bz[0].odds }, { name: '七不中', odds: data.bz7bz[0].odds },
        { name: '八不中', odds: data.bz8bz[0].odds }, { name: '九不中', odds: data.bz9bz[0].odds }, { name: '十不中', odds: data.bz10bz[0].odds }]
      result.balls = [data.bz5bz, data.bz6bz, data.bz7bz, data.bz8bz, data.bz9bz, data.bz10bz]
      break
    case 'ws':
      oddk = ['tmtw', 'ws2wl', 'ws3wl', 'ws4wl']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.groups = [data.tmtw, data.ws2wl, data.ws3wl, data.ws4wl]
      result.rodio = [{ name: '特码头尾' }, { name: '二尾连' }, { name: '三尾连' }, { name: '四尾连' }]
      break
    case 'sx':
      oddk = ['sxtx', 'sx1x', 'sx2xl', 'sx3xl', 'sx4xl']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.groups = [data.sxtx, data.sx1x, data.sx2xl, data.sx3xl, data.sx4xl]
      result.rodio = [{ name: '特肖' }, { name: '一肖' }, { name: '二肖连' }, { name: '三肖连' }, { name: '四肖连' }]
      break
    case 'tm': result.ball = data.tmzx; result.square = data.tmlm; result.remark = data.tmzx[0].remark; break
    case 'zm':
      oddk = ['zmrx', 'zm1t', 'zm2t', 'zm3t', 'zm4t', 'zm5t']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.balls = [data.zmrx, data.zm1t, data.zm2t, data.zm3t, data.zm4t, data.zm5t]
      result.squares = [[], data.zm1, data.zm2, data.zm3, data.zm4, data.zm5]
      result.rodio = [{ name: '任选' }, { name: '正1特' }, { name: '正2特' }, { name: '正3特' }, { name: '正4特' }, { name: '正5特' }]
      break
    case 'bb': result.group = data.bb; result.remark = data.bb[0].remark; break
    case 'lm':
      result.odds = 1
      oddk = ['lm3qz', 'lm3z2', 'lm2qz', 'lm2zt', 'lmtc']
      result.remarks = oddk.map((_) => data[_][0].remark)
      result.balls = oddk.map(_ => data[_]) // 'lm3qz', 'lm3z2', 'lm2qz', 'lm2zt', 'lmtc'
      result.rodio = [{ name: '三全中', odds: data.lm3qz[0].odds }, { name: '三中二', odds: '中二 ' + data.lm3z2[0].odds },
        { name: '二全中', odds: data.lm2qz[0].odds }, { name: '二中特', odds: '中特 ' + data.lm2zt[0].odds }, { name: '特串', odds: data.lmtc[0].odds } ]
      break
  }
  return handleRDChange(_this, result)
}
export const handleZx = (data, index, list, type) => {
  if (data.length >= index) {
    const combination = []
    type ? chooseDataTt([...data], combination) : chooseDataZh([...data], index, combination)
    list.push({ ...data[0], zhushu: combination.length, number: data.map(_ => _.num || _.name).join() })
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
