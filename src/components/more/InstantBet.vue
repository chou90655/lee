<template>
  <div class="bet">
    <cube-scroll :options="{ scrollbar: true }" class="list">
      <ul>
        <li v-for="(it, i) in dataList" :key="i">
          <p>{{it.gameName}}</p>
          <p :class="{_v: it.totalAmount}">{{it.totalAmount || 0}}</p>
          <p>{{it.totalCount || '0.00'}}</p>
        </li>
      </ul>
    </cube-scroll>
    <p class="info">当前注单合计笔数:<i>{{result.length}}</i></p>
  </div>
</template>
<script>
// import { queryNowBet } from '../../api/interface'
import { mapState, mapGetters } from '../../util/tools'
export default {
  data() {
    return {
      result: []
    }
  },
  // created() {
  //   queryNowBet({ isMarkSix: this.currentLottery.isMarkSix }).then(res => {
  //     if (res) {
  //       res.currentData.forEach(_ => (_.totalCount = _.totalCount.toFixed(2)))
  //       this.result = res.currentData
  //     }
  //   })
  // },
  computed: {
    ...mapState(['currentLottery']),
    ...mapGetters(['lotterys']),
    list() {
      return [{ gameName: '彩种', totalAmount: '注单笔数', totalCount: '下注金额' }, ...this.lotterys]
    },
    dataList() {
      return this.list.map(_ => this.result.find(i => _.gameCode === i.gameCode) || _)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .bet
    .list
      p
        width (100% / 3)
    .info
      text-align right
      i
        padding 0 15px 0 10px
</style>
