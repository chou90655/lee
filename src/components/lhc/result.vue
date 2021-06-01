<template>
  <div class="result">
   <p>{{openInfo.lotteryNum}}期</p>
    <ul class="ball" v-if="openInfo.result">
      <template v-for="(it, i) in openInfo.result.split(',')" >
        <i v-if="i === 6" :key="i+'_'">+</i>
        <li :key="i" :class="getColor(it)">{{it}}</li>
      </template>
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
  methods: {
    getColor(n) {
      return getColor('xgc', +n)
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
  .attach li:last-child
    margin-left 22px
</style>
