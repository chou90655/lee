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
import { toast } from '../../util/tools'
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
      const Chosedata = this.rD.data.filter(_ => _.choose)
      if (Chosedata.filter(_ => _.typeCode === 'tm-bs').length > 3) {
        it.choose = !it.choose
        toast('特码包三只能选择3个号码!', false)
      }
      this.hleper = Math.random() + 1
      this.setBetData(this.CalcLen(Chosedata.filter(_ => _.choose)))
    },
    CalcLen(Chosedata) {
      let finalData = []
      switch (this.play) {
        case 'sb':
          const bsl = Chosedata.filter(_ => _.typeCode === 'tm-bs')
          const fsb = Chosedata.filter(_ => _.typeCode !== 'tm-bs')
          if (bsl.length && bsl.length !== 3 && !fsb.length) finalData.err = '特码包三需要选择3个号码!'
          else if (bsl.length === 3) {
            const name = bsl.map(_ => _.name).join(',')
            const playCode = bsl.map(_ => _.playCode).join('@')
            finalData = [...fsb, { ...bsl[0], name, ruleName: name, playCode }]
          } else finalData = fsb
          break
        default: finalData = Chosedata; break
      }
      return finalData
    }
  }
}
</script>
<style lang="stylus" scoped>
</style>
