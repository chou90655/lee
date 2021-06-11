<template>
  <div class="display">
    <cube-scroll v-if='rD.rodio' :data="rD.rodio" class="rodio" direction="horizontal" ref='rodio'>
      <ul>
        <li v-for="(it, i) in rD.rodio" :class="{t_bc: rodioIndex === i}" @click="rodioIndex = i" :key=i>{{it.name}}</li>
      </ul>
    </cube-scroll>
    <single v-if="rD.rodio&&rD.sorts[rodioIndex][0].sg" @data='hddata' :data="rD.sorts[rodioIndex][0]"></single>
    <cube-scroll v-else class="main_play" :options="options" ref=mainPlay>
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
        <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it, item, i)" :key=i :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { filter, hndleData, hdwx } from './util'
import { mixin } from '../mixin'
import { toast } from '../../util/tools'
export default {
  mixins: [mixin],
  computed: {
    rD() {
      const agr = (this.rodioIndex + this.hleper + this.change) && this.play && this.lotteryData && this.rightData
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
    hddata(da) {
      this.setBetData([{ ...this.rD.sorts[this.rodioIndex][0].data, number: da.map(_ => _.split('').join()).join('|'), zhushu: da.length }])
    },
    handleChose(it, item, j) {
      if (!+it.isopen) return toast('抱歉，该玩法暂停销售', false)
      this.hleper = Math.random() + 1
      if (this.rD.rodio && this.rD.rodio[this.rodioIndex].bd) item.ball.forEach(_ => (_.choose = false))
      it.choose = !it.choose
      const da = this.rD.rodio ? this.rD.sorts[this.rodioIndex] : this.rD.sort ? this.rD.sort : [this.rD]
      let data = []
      switch (this.play) {
        case 'yx' :data = hdwx(da, [{ n: 0 }, { n: 0 }, { n: 0 }], 1); break
        case 'lm' :data = hdwx(da, [{ n: 1 }, { n: 1 }]); break
        case 'he' :
          switch (this.rodioIndex) {
            case 0: data = hdwx(da, Array(2).fill({ n: 1 })); break
            case 2: data = hdwx(da, [{ n: 1, k: 'qezxhz', t: 5 }]); break
            case 3: data = hdwx(da, [{ n: 1, k: 'qekd', t: 5 }]); break
            case 4: data = hdwx(da, [{ n: 2 }]); break
            case 6: data = hdwx(da, [{ n: 1, k: 'qezuxhz', t: 5 }]); break
            case 7: data = hdwx(da, [{ n: 1, num: 9 }]); break
          }
          break
        case 'qe' :
          switch (this.rodioIndex) {
            case 0: data = hdwx(da, Array(2).fill({ n: 1 })); break
            case 2: data = hdwx(da, [{ n: 1, k: 'qezxhz', t: 5 }]); break
            case 3: data = hdwx(da, [{ n: 1, k: 'qekd', t: 5 }]); break
            case 4: data = hdwx(da, [{ n: 2 }]); break
            case 6: data = hdwx(da, [{ n: 1, k: 'qezuxhz', t: 5 }]); break
            case 7: data = hdwx(da, [{ n: 1, num: 9 }]); break
          }
          break
        case 'bdw' :data = hdwx(da, [{ n: this.rodioIndex + 1 }]); break
        case 'sx' :
          switch (this.rodioIndex) {
            case 0: data = hdwx(da, Array(3).fill({ n: 1 })); break
            case 2: data = hdwx(da, [{ n: 1, k: 'sxzxhz', t: 5 }]); break
            case 3: data = hdwx(da, [{ n: 1, k: 'sxzxkd', t: 5 }]); break
            case 4: data = hdwx(da, [{ n: 1, k: 'sxzuxhz', t: 5 }]); break
            case 5: data = hdwx(da, [{ n: 2, t: 6 }]); break
            case 6: data = hdwx(da, [{ n: 3 }]); break
            case 7: data = hdwx(da, [{ n: 1, num: 54 }]); break
          }
          break
        default: data = []; break
      }
      this.setBetData(data)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .play_area .display
    .checkbox ul li
      width 72px
</style>
