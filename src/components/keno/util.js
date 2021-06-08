import { handleRDChange, chooseDataZh, filt } from '../../util/tools'
const hdArr = (arr, playid, item) => arr.map((_, i) => {
  let odds = []
  if (['bjkl8sxp', 'bjkl8jop'].includes(item.playid)) {
    odds = item.maxjj.split('|').map(_ => _ / 2)
  }
  return { name: _, choose: false, playid, num: i, odds: odds[i] || odds[0] || (item.maxjj / 2) }
})
const hdArr1 = (k, item) => Array(40).fill(1).map((_, i) => ({ ...item, name: ('0' + (i + k)).slice(-2), choose: false, num: i + k }))
export const getKey = (arr, k) => arr.map(_ => _[k || 'name']).join()
export const hditem = (arr, name, playid, zhushu, beishu = 1, yjf = 1) => ({ number: getKey(arr, 'num'), label: getKey(arr), playid, zhushu, name, beishu, yjf })
export const handleZx = (data, index, rD) => {
  let list = []
  const realIndex = index + 1
  if (data.length >= realIndex) {
    const combination = []
    chooseDataZh(data, realIndex, combination)
    list.push(...combination)
    const [arr0, arr1] = rD.sorts[index]
    list = [{ ...rD.rodio[index], number: getKey(filt(arr0.ball)) + '|' + getKey(filt(arr1.ball)), zhushu: list.length, beishu: 1, yjf: 1 }]
  } else list.err = '选择不能少于' + realIndex + '个'
  return list
}
export const hndleData = (_this, data, key) => {
  let result = {}
  if (!data) return result
  switch (key) {
    case 'rx':
      result.odds = 1
      const das = Array(7).fill(1).map((_, i) => data.find(_i => _i.playid === 'bjkl8rx' + (i + 1)))
      result.sorts = das.map(_ => [{ title: '上盘', ball: hdArr1(1, _) }, { title: '下盘', ball: hdArr1(41, _) }])
      const list = das.map((_, i) => _.maxjj).map(_ => _.split('|').map(i => i / 2))
      result.remarks = das.map((_, i) => _.remark)
      result.rodio = [
        { name: '任选一', playid: 'bjkl8rx1', odds: ' 赔率:' + list[0][0] },
        { name: '任选二', playid: 'bjkl8rx2', odds: ' 赔率:' + list[1][0] },
        { name: '任选三', playid: 'bjkl8rx3', odds: '中三:' + list[2][0] + ' 中二:' + list[2][1] },
        { name: '任选四', playid: 'bjkl8rx4', odds: '中四:' + list[3][0] + ' 中三:' + list[3][1] + ' 中二:' + list[3][2] },
        { name: '任选五', playid: 'bjkl8rx5', odds: '中五:' + list[4][0] + ' 中四:' + list[4][1] + ' 中三:' + list[4][2] },
        { name: '任选六', playid: 'bjkl8rx6', odds: '中六:' + list[5][0] + ' 中五:' + list[5][1] + '<br/>中四:' + list[5][2] + ' 中三:' + list[5][3] },
        { name: '任选七', playid: 'bjkl8rx7', odds: '中六:' + list[6][0] + ' 中六:' + list[6][1] + '<br/>中五:' + list[6][2] + ' 中四:' + list[6][3] + ' 中三:' + list[6][4] }
      ]
      break
    case 'qw':
      result.sort = []
      const arrs = ['bjkl8sxp', 'bjkl8jop', 'bjkl8dxds'].map(i => data.find(_ => _.playid === i))
      result.remark = `上下盘：${arrs[0].remark}<br/>奇偶盘：${arrs[1].remark}<br/>和值大小单双：${arrs[2].remark}`
      result.sort.push({ title: '上下盘', square: hdArr(['上', '中', '下'], 'bjkl8sxp', arrs[0]) })
      result.sort.push({ title: '奇偶盘', square: hdArr(['奇', '和', '偶'], 'bjkl8jop', arrs[1]) })
      result.sort.push({ title: '大小单双', square: hdArr(['大单', '大双', '小单', '小双'], 'bjkl8dxds', arrs[2]) })
      break
  }
  return handleRDChange(_this, result)
}
export const getColor = (n) => {
  switch (n % 3) {
    case 1: return 'red_b'
    case 2: return 'blue_b'
    case 0: return 'green_b'
  }
}
