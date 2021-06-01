<template>
  <div :class="['result', openInfo.result && 'open']">
   <p>{{openInfo.lastFullExpect}}期</p>
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
      return getColor('kl8', +n)
    }
  }
}
</script>
<style lang="stylus" scoped>
.lottery_info .result
  &.open
    display block
    margin-top -2px
  p
    margin 0
  .ball
    max-height 58px
    flex-wrap wrap
    margin-top 3px
    li
      width 21px
      height 21px
      font-size 15px
      line-height 21px
      margin 3px 2px 2px 0
</style>
