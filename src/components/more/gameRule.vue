<template>
  <cube-scroll :options="{ scrollbar: true }" :class="['rule', currentLottery.lcode]">
    <h2>{{currentLottery.label}}</h2>
    <p class="inf" v-html="gameRule.lotteryInfo[currentLottery.code]"></p>
    <p class="notice">请认真了解游戏规则《游戏规则如下》</p>
    <div v-html="gameRule.gameRule[currentLottery.lcode]">
    </div>
  </cube-scroll>
</template>
<script>
import { mapState } from '../../util/tools'
import gameRule from '../../data/gameRule'
export default {
  data() {
    return {
      gameRule
    }
  },
  computed: {
    ...mapState(['currentLottery'])
  }
}
</script>
<style lang="stylus" scoped>
  .rule
    font-size 12px
    padding 0 16px
    line-height 18px
    color #333
    .inf
      font-size 12px
      color #666
    .notice
      margin 12px 0
      text-indent 0px
    h2
      line-height 22px
      margin 22px 0 10px
      font-size 16px
      font-weight 550
    >>>h3
      margin 6px 0 4px
      line-height 22px
      font-size 14px
      font-weight 500
      color #54B1FF
    >>>p
      text-indent 24px
  .xgc>>>, .ssc>>>
    li
      margin-bottom 8px
    strong
      font-weight 600
      font-size 14px
  .ssc>>>
    p
      text-indent 0
      margin-bottom 8px
    strong
      font-weight 600
      font-size 14px
    table
      width 100%
      line-height 36px
      font-size 14px
      text-align center
      background-color #ddefff
      td
        background-color #f0f0f0
      td,th
        &:first-child
          border-right 1px solid #FFF
  .pk10>>>td
    background-color #f0f0f0
    vertical-align middle
    border-bottom 1px solid #FFF
    padding-left 4px
    &:first-child
      border-right 1px solid #FFF
      width 28px
      padding 22px 5px 22px 8px
  .c11x5>>>strong
    font-weight 600
    font-size 14px
    display inline-block
    margin-top 10px
  .klsf,.kl8
    >>>strong
      font-weight 600
      font-size 14px
  .kl8>>>p
    margin-top 10px

</style>
<style lang="stylus">
  .rule .cube-scroll-list-wrapper
    padding-bottom 12px
  .three_d
    li
      margin-top 10px
    .F_bold
      font-weight 600
      font-size 14px
</style>
