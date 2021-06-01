<template>
  <div class="wol">
    <cube-scroll :options="{ scrollbar: true }" class="list">
      <ul>
        <li v-for="(it, i) in result" :key="i">
          <p>{{it.gameName}}</p>
          <p>{{it.betCount}}</p>
          <p>{{it.betAmount}}</p>
          <p>{{it.winOrLose}}</p>
        </li>
        <li v-if='result.length < 2'><span>暂无数据</span></li>
      </ul>
    </cube-scroll>
    <div class="info">
      <p>下注金额:<i>{{total.betAmountTotal || 0}}</i>元</p>
      <p>输赢金额:<i>{{total.winOrLoseTotal || 0}}</i>元</p>
    </div>
  </div>
</template>
<script>
import { getWinOrLoseTodayByGameId } from '../../api/interface'
import { mapState } from '../../util/tools'
export default {
  data() {
    return {
      result: [],
      total: {}
    }
  },
  created() {
    getWinOrLoseTodayByGameId({ isMarkSix: this.currentLottery.isMarkSix }).then(res => {
      if (res) {
        this.result = [{ gameName: '彩种', betCount: '注数', betAmount: '下注金额', winOrLose: '输赢金额' }, ...res.currentData.resultData]
        this.total = res.currentData.total
      }
    })
  },
  computed: {
    ...mapState(['currentLottery'])
  }
}
</script>
<style lang="stylus" scoped>
  .wol
    .list p
      width (100% / 4)
      &:last-child
        color #0EBF29
    .info
      display flex
      justify-content space-between
      padding 0 12px
      i
        padding 0 5px
</style>
