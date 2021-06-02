<template>
  <div class="result">
   <p>{{openInfo.lotteryNum}}期</p>
    <ul class="ball" v-if="openInfo.result">
      <li v-for="(it, i) in openInfo.result.split(',')" :key="i" :class="getColor(it)">{{it}}</li>
    </ul>
    <p v-else class="msg">{{'正在开奖……'}}</p>
    <ul class="attach" v-if="openInfo.resultProperty">
      <li v-for="(it, i) in openInfo.resultProperty.split(',')" :key="i">{{it}}</li>
    </ul>
  </div>
</template>
<script>
import { resultMixin } from '../mixin'
import { getColor } from '../../util/tools'
export default {
  mixins: [resultMixin],
  methods: {
    getColor(n) {
      return getColor('klsf', +n)
    }
  }
}
</script>
<style lang="stylus" scoped>
.lottery_info .result .attach
  justify-content space-between
  li
    padding 0 3.5px
</style>
