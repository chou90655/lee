<template>
  <div class="result">
   <p>{{openInfo.lotteryNum}}期</p>
    <ul class="ball" v-if="openInfo.result">
      <li v-for="(it, i) in openInfo.result.split(',')" :key="i" :class="getColor(it)">{{it}}</li>
      <i>=</i>
      <li :class="getColor(sum)">{{sum}}</li>
    </ul>
    <p v-else class="msg">{{openInfo.message || '正在开奖……'}}</p>
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
  computed: {
    sum() {
      const res = this.openInfo.resultProperty
      return res && res.split(',')[0]
    }
  },
  methods: {
    getColor(n) {
      return getColor('klc', +n)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .result .ball i
    text-align center
    width 20px
    color #333
    font-size 18px
    line-height 30px
</style>
