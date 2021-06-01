import { handleRDChange, chooseDataZh } from '../../util/tools'
const hdArr = (arr, playid) => arr.map((_, i) => ({ name: _, choose: false, playid, num: i }))
const hdArr1 = (k) => Array(40).fill(1).map((_, i) => ({ name: i + k, choose: false }))
export const getnum = (arr, k) => arr.filter(_ => _.choose).map(_ => _[k || 'name']).join()
export const handleZx = (data, index, list, rD) => {
  const realIndex = index + 1
  if (data.length >= realIndex) {
    const combination = []
    chooseDataZh(data, realIndex, combination)
    list.push(...combination)
    const chsdata = rD.sorts[index]
    list.side = [{ ...rD.rodio[index], number: getnum(chsdata[0].ball) + '|' + getnum(chsdata[1].ball) }]
  } else {
    list.err = '选择不能少于' + realIndex + '个'
  }
}
export const hndleData = (_this, data, key) => {
  let result = {}
  switch (key) {
    case 'rx':
      result.odds = 1
      result.sorts = Array(7).fill(1).map(_ => [{ title: '上盘', ball: hdArr1(1) }, { title: '下盘', ball: hdArr1(40) }])
      result.rodio = ['一', '二', '三', '四', '五', '六', '七'].map((_, i) => ({ name: '任选' + _, playid: 'bjkl8rx' + (i + 1) }))
      break
    case 'qw':
      result.odds = 1
      result.sort = []
      result.sort.push({ title: '上下盘', square: hdArr(['上', '中', '下'], 'bjkl8sxp') })
      result.sort.push({ title: '奇偶盘', square: hdArr(['奇', '和', '偶'], 'bjkl8jop') })
      result.sort.push({ title: '大小单双', square: hdArr(['大单', '大双', '小单', '小双'], 'bjkl8dxds') })
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
