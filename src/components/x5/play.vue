<template>
  <div class="display">
    <cube-scroll v-if='rD.rodio' :data="rD.rodio" class="rodio" direction="horizontal" ref='rodio'>
      <ul>
        <li v-for="(it, i) in rD.rodio" :class="{t_bc: rodioIndex === i}" @click="rodioIndex = i" :key=i>{{it.name}}</li>
      </ul>
    </cube-scroll>
    <cube-scroll class="main_play" :options="options" ref=mainPlay>
      <p v-if="rD.odds" class="odds t_bc"> 赔率：{{rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds}}</p>
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-if='rD.square || (rD.squares && rD.squares[rodioIndex])' :class="['square', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.square || (rD.squares && rD.squares[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="{square: item.square, ball: item.ball, _first: i===0, hasOdd:rD.odds}">
        <div class="sprt_title" v-if="item.title"><span></span>{{item.title}}</div>
        <li v-for="(it, j) in item.square || item.ball" @click="handleChose(it, j)" :key=j :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { filter, hndleData, handleZx, hdwx } from './util'
import { mixin } from '../mixin'
import { toast } from '../../util/tools'
export default {
  mixins: [mixin],
  computed: {
    rD() {
      const agr = (this.rodioIndex + this.hleper) && this.play && this.lotteryData && this.rightData
      let result = {}
      if (agr) {
        try {
          result = this.storeRD || hndleData(this, this.storeData || filter(this.lotteryData), this.play)
        } catch (e) {
          setTimeout(() => (this.hleper = Math.random() + 1), 500)
        }
      }
      return result
    }
  },
  methods: {
    handleChose(it, j) {
      if (!+it.isopen) return toast('抱歉，该玩法暂停销售', false)
      const { rodio, sorts } = this.rD
      if (rodio && rodio[this.rodioIndex] && rodio[this.rodioIndex].hc) {
        sorts[this.rodioIndex].forEach(_ => ((_.ball || _.square)[j].choose = false))
      }
      it.choose = !it.choose
      this.hleper = Math.random() + 1
      this.setBetData(this.CalcLen(this.rD.data.filter(_ => _.choose)))
    },
    CalcLen(Chosedata) {
      let finalData = []
      const { sort, ball, sorts } = this.rD
      const da = ball ? [this.rD] : sort || sorts[this.rodioIndex]
      switch (this.play) {
        case 'sm' :
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(3).fill({ n: 1, t: 7 })); break
            case 1: finalData = hdwx(da, Array(1).fill({ n: 3 })); break
            case 2: finalData = hdwx(da, [{ n: 1 }, { n: 2 }]); break
          }
          break
        case 'em' :
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, Array(2).fill({ n: 1, t: 7 })); break
            case 1: finalData = hdwx(da, Array(1).fill({ n: 2 })); break
            case 2: finalData = hdwx(da, [{ n: 1 }, { n: 1 }]); break
          }
          break
        case 'rxdt' :
          switch (this.rodioIndex) {
            case 0: finalData = hdwx(da, [{ n: 1 }, { n: 1 }]); break
            case 1: finalData = hdwx(da, [{ n: 1 }, { n: 2 }]); break
            case 2: finalData = hdwx(da, [{ n: 1 }, { n: 3 }]); break
            case 3: finalData = hdwx(da, [{ n: 1 }, { n: 4 }]); break
            case 4: finalData = hdwx(da, [{ n: 1 }, { n: 5 }]); break
            case 5: finalData = hdwx(da, [{ n: 1 }, { n: 6 }]); break
            case 6: finalData = hdwx(da, [{ n: 1 }, { n: 7 }]); break
          }
          break
        case 'rxfs' :finalData = hdwx(da, [{ n: this.rodioIndex + 1 }]); break
        case 'qwx': finalData = hdwx(da, [{ n: 1 }]); break
        case 'bdw': finalData = hdwx(da, [{ n: 1 }]); break
        case 'dwd': finalData = hdwx(da, [{ n: 0 }, { n: 0 }, { n: 0 }], 1); break
        case 'zux': handleZx(Chosedata, this.rodioIndex + 2, finalData); break
        case 'rx': handleZx(Chosedata, this.rodioIndex + 1, finalData); break
        default: finalData = Chosedata; break
      }
      return finalData
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
