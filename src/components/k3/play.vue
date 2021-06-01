<template>
  <div class="display k3">
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
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', rD.odds && 'hasOdd', change && 'change']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="it.choose ? 't_b': 't_bd'">
          <span v-if = 'it.typeCode === "qs" || it.playCode === "slh-qb"'>{{it.name}}</span>
          <div v-else>
            <p v-for="(it, i) in it.name.split('')" :key="i" :class="'_t' + it"></p>
          </div>
          <i>{{it.odds}}</i>
        </li>
      </ul>
      <ul v-if='rD.square || (rD.squares && rD.squares[rodioIndex])' :class="['square', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.square || (rD.squares && rD.squares[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="{square: item.square, ball: item.ball, _first: i===0}">
          <div class="sprt_title"><span></span>{{item.title}}</div>
          <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it)" :key=i>
            <p :class="it.choose ? 't_b': 't_bd'">{{it.name}}</p>
            <i :class="[it.choose ? 't_bc' : '', 't_bd']">{{it.odds}}</i>
          </li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { filter, hndleData } from './util'
import { mixin } from '../mixin'
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
    handleChose(it) {
      it.choose = !it.choose
      this.hleper = Math.random() + 1
      this.setBetData(this.rD.data.filter(_ => _.choose))
    }
  }
}
</script>
<style lang="stylus" scoped>
.display.k3 .main_play >>> ul
  li>div
    display flex
  &.change li
    border none
    div
      margin-right 3px
    p
      width 24px
      height 24px
      border-radius 4px
      margin-right 2px
    span
      margin-right 12px
  &:not(.change).ball
    justify-content space-around
    li
      box-sizing border-box
      width 138px
      display flex
      height 48px
      margin 4px 0
      justify-content space-around
      align-items center
      padding 0 2px
      span
        font-size 18px
      p
        border-radius 0px
        height 24px
        width 24px
        font-size 14px
        line-height 24px
        margin-right 2px
      i
        position relative
        border-radius 0px
        width initial
        font-size 14px
        background-color transparent
        color inherit

</style>
