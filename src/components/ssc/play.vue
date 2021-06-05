<template>
  <div class="display">
    <cube-scroll v-if='rD.checkbox' :data="rD.checkbox" class="checkbox" direction="horizontal" ref='checkbox'>
      <ul>
        <li v-for="(it, i) in rD.checkbox" :class="{t_b: it.choose}" @click="handleChose(it)" :key=i>{{it.name}}</li>
      </ul>
    </cube-scroll>
    <cube-scroll v-if='rD.rodio' :data="rD.rodio" class="rodio" direction="horizontal" ref='rodio'>
      <ul>
        <li v-for="(it, i) in rD.rodio" :class="{t_bc: rodioIndex === i}" @click="rodioIndex = i" :key=i>{{it.name}}</li>
      </ul>
    </cube-scroll>
    <cube-scroll class="main_play" :options="options" ref=mainPlay>
      <p v-if="rD.odds" class="odds t_bc"> 赔率：{{rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds}}</p>
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-if='rD.square || (rD.squares && rD.squares[rodioIndex])' :class="['square', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.square || (rD.squares && rD.squares[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="{square: item.square, ball: item.ball, _first: i===0, hasOdd:rD.odds}">
          <div class="sprt_title" v-if="item.title"><span></span>{{item.title}}</div>
          <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
            <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
            <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
          </li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { filter, hndleData, hdwx, hdsprd, hdarrdl } from './util'
import { mixin } from '../mixin'
export default {
  mixins: [mixin],
  computed: {
    rD() {
      const agr = (this.rodioIndex + this.hleper) && this.play && this.lotteryData && this.rightData
      let result = {}
      if (agr) {
        result = this.storeRD || hndleData(this, this.storeData || filter(this.lotteryData), this.play)
        // try {
        //   result = this.storeRD || hndleData(this, this.storeData || filter(this.lotteryData), this.play)
        // } catch (e) {
        //   // setTimeout(() => (this.hleper = Math.random() + 1), 500)
        // }
      }
      return result
    }
  },
  methods: {
    handleChose(it) {
      if ((['qs', 'zs', 'hs'].includes(this.play) && this.rodioIndex === 6) || (['qe', 'he'].includes(this.play) && this.rodioIndex === 5)) {
        this.rD.sorts[this.rodioIndex][0].ball.forEach(_ => (_.choose = false))
        it.choose = !0
      } else it.choose = !it.choose
      this.hleper = Math.random() + 1
      this.setBetData(this.CalcLen(this.rD.data.filter(_ => _.choose)))
    },

    CalcLen(Chosedata) {
      const { sort, ball, sorts } = this.rD
      const da = ball ? [this.rD] : sort || sorts[this.rodioIndex]
      let finalData = []
      switch (true) {
        case this.play === 'lm': finalData = hdsprd(da); break
        case this.play === 'lh': finalData = hdarrdl(da); break
        case this.play === 'qzh': finalData = hdsprd(da); break
        case this.play === 'dwd': finalData = hdwx(da, Array(5).fill({ n: 0 }), 1); break
        case [1, 2, 3, 4, 5].includes(+this.play): finalData = hdsprd(da); break
        case ['dxds'].includes(this.play):
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(2).fill({ n: 1 })); break
            case 1: finalData = hdwx(da, Array(2).fill({ n: 1 })); break
            case 2: finalData = hdwx(da, Array(3).fill({ n: 1 })); break
            case 3: finalData = hdwx(da, Array(3).fill({ n: 1 })); break
          }
          break
        case ['qe', 'he'].includes(this.play):
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(2).fill({ n: 1 })); break
            case 1: finalData = hdwx(da, [{ n: 1, k: 'zxhz2', t: 5 }]); break
            case 2: finalData = hdwx(da, [{ n: 1, k: 'zxkd2', t: 5 }]); break
            case 3: finalData = hdwx(da, [{ n: 2 }]); break
            case 4: finalData = hdwx(da, [{ n: 1, k: 'zuxhz2', t: 5 }]); break
            case 5: finalData = hdwx(da, [{ n: 1, num: 9 }]); break // 包胆
          }
          break
        case ['qs', 'zs', 'hs'].includes(this.play):
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(3).fill({ n: 1 })); break
            case 1: finalData = hdwx(da, [{ n: 1, k: 'zxhz3', t: 5 }]); break
            case 2: finalData = hdwx(da, [{ n: 1, k: 'zxkd3', t: 5 }]); break
            case 3: finalData = hdwx(da, [{ n: 1, k: 'zuxhz3', t: 5 }]); break
            case 4: finalData = hdwx(da, [{ n: 2, t: 6 }]); break
            case 5: finalData = hdwx(da, [{ n: 3 }]); break
            case 6: finalData = hdwx(da, [{ n: 1, num: 54 }]); break // 包胆
            case 7: finalData = hdwx(da, [{ n: 1 }]); break
            case 8: finalData = hdwx(da, [{ n: 2 }]); break
          }
          break
        case this.play === 'sx':
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(4).fill({ n: 1 })); break
            case 1: finalData = hdwx(da, [{ n: 4 }]); break
            case 2: finalData = hdwx(da, [{ n: 1, t: 7 }, { n: 2, t: 7 }]); break
            case 3: finalData = hdwx(da, [{ n: 2 }]); break
            case 4: finalData = hdwx(da, [{ n: 1, t: 7 }, { n: 1, t: 7 }]); break
            case 5: finalData = hdwx(da, [{ n: 1 }]); break
            case 6: finalData = hdwx(da, [{ n: 2 }]); break
          }
          break
        case this.play === 'wx':
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(5).fill({ n: 1 })); break
            case 1: finalData = hdwx(da, [{ n: 5 }]); break
            case 2: finalData = hdwx(da, [{ n: 1 }, { n: 4 }]); break
            case 3: finalData = hdwx(da, [{ n: 2 }, { n: 1 }]); break
            case 4: finalData = hdwx(da, [{ n: 1 }, { n: 2 }]); break
            case 5: finalData = hdwx(da, [{ n: 1 }, { n: 1 }]); break
            case 6: finalData = hdwx(da, [{ n: 1 }, { n: 1 }]); break
            case 7: finalData = hdwx(da, [{ n: 1 }]); break // 定位
            case 8: finalData = hdwx(da, [{ n: 2 }]); break
            case 9: finalData = hdwx(da, [{ n: 3 }]); break
            case 10: finalData = hdwx(da, [{ n: 1 }]); break // 一帆风顺
            case 11: finalData = hdwx(da, [{ n: 1 }]); break
            case 12: finalData = hdwx(da, [{ n: 1 }]); break
            case 13: finalData = hdwx(da, [{ n: 1 }]); break
          }
          break
        default: finalData = Chosedata; break
      }
      console.log(finalData)
      return finalData || []
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
