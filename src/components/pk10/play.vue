<template>
  <div class="display pk10">
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
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', change && 'change', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="[!change ? it.choose ? '_pk' + it.name : 't_bd' : '', it.choose && 't_b']">
          <p :class="['f_m _pk' + it.name, change && 't_b']">{{it.name}}</p>
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
          <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
            <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
            <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
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
      this.setBetData(this.CalcLen(this.rD.data.filter(_ => _.choose)))
    },
    CalcLen(Chosedata) {
      let finalData = []
      switch (this.play) {
        case 'kj':
          const checkedArr = this.rD.checkbox.filter(_ => _.choose)
          if (checkedArr.length) {
            checkedArr.forEach(_ => Chosedata.forEach(i => finalData.push(this.storeData[_.value].find(_i => _i.playCode === i.playCode.replace('1', _.value)))))
          } else {
            finalData.err = '请选择顶部投注类型'
          }
          break
        default: finalData = Chosedata; break
      }
      return finalData
    }
  }
}
</script>
<style lang="stylus" scoped>
  .play_area .display.pk10
    .checkbox ul li
      width 72px
    .change
      p
        width 32px
        height 32px
        border-radius 3px
        line-height 32px
        font-size 22px
        font-family Roboto-BlackItalic
        -webkit-text-stroke 1px #333
      i
        min-width 46px
    ul:not(.change).ball
      li
        box-sizing border-box
        width 62px
        height 46px
        margin 4px
        &.t_b
          p,i
            color inherit
        p
          border none
          height 30px
          line-height 30px
          font-style italic
          font-family: Roboto-BlackItalic;
          -webkit-text-stroke 1px #333
          font-size: 24px;
        i
          border none
          background-color transparent
    ._pk1,._pk11,._pk21
      color #F7DD00
    ._pk2,._pk12,._pk22
      color #349BF2
    ._pk3,._pk13,._pk23
      color #505050
    ._pk4,._pk14,._pk24
      color #F79000
    ._pk5,._pk15,._pk25
      color #32FEF7
    ._pk6,._pk16,._pk26
      color #6534F2
    ._pk7,._pk17,._pk27
      color #C1C1C1
    ._pk8,._pk18
      color #FF3A39
    ._pk9,._pk19
      color #9E0C0C
    ._pk10,._pk20
      color #0AD429
    .t_b._pk1,.t_b._pk11,.t_b._pk21
      background-color #F7DD00
    .t_b._pk2,.t_b._pk12,.t_b._pk22
      background-color #349BF2
    .t_b._pk3,.t_b._pk13,.t_b._pk23
      background-color #505050
    .t_b._pk4,.t_b._pk14,.t_b._pk24
      background-color #F79000
    .t_b._pk5,.t_b._pk15,.t_b._pk25
      background-color #32FEF7
    .t_b._pk6,.t_b._pk16,.t_b._pk26
      background-color #6534F2
    .t_b._pk7,.t_b._pk17,.t_b._pk27
      background-color #C1C1C1
    .t_b._pk8,.t_b._pk18
      background-color #FF3A39
    .t_b._pk9,.t_b._pk19
      background-color #9E0C0C
    .t_b._pk10,.t_b._pk20
      background-color #0AD429
</style>
