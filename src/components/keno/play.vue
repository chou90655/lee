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
    <cube-scroll class="main_play" :data="rD.data" :options="options" ref=mainPlay>
      <!-- <p v-if="rD.odds" class="odds t_bc"> 赔率：{{rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds}}</p> -->
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i v-if="it.odds" :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="{square: item.square, ball: item.ball, _first: i===0, hasOdd:rD.odds}">
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
import { hndleData, handleZx, hditem } from './util'
import { mixin } from '../mixin'
import { toast } from '../../util/tools'
export default {
  mixins: [mixin],
  created() {
    window.__this = this
  },
  computed: {
    rD() {
      const agr = (this.rodioIndex + this.hleper) && this.play && this.lotteryData && this.rightData
      let result = {}
      if (agr) {
        try {
          result = this.storeRD || hndleData(this, this.lotteryData, this.play)
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
      if (this.rodioIndex && Chosedata.length > 8) {
        toast('最多选择8个号码', false)
        it.choose = !it.choose
      } else {
        this.hleper = Math.random() + 1
        this.setBetData(this.CalcLen(Chosedata))
      }
    },
    hdqw(arr) {
      const ar = []
      this.rD.sort.forEach(_ => {
        const sq = _.square.filter(_ => _.choose)
        if (sq.length) ar.push(hditem(sq, _.title, sq[0].playid, sq.length))
      })
      return ar
    },
    CalcLen(Chosedata) {
      let finalData = []
      switch (this.play) {
        case 'rx':finalData = handleZx(Chosedata, this.rodioIndex, this.rD); break
        default: finalData = this.hdqw(Chosedata); break
      }
      console.log(finalData)
      return finalData
    }
  }
}
</script>
