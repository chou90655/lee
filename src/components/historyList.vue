<template>
  <cube-scroll class="table" ref="table" :options="{ scrollbar: true }">
    <table>
      <thead><tr><th v-for="(it, i) in headData" :key="i" :style="{width: it.width}">{{it.name}}</th></tr></thead>
      <tbody :class="[history.lcode, 'result']">
        <tr v-for="(it, i) in history.historyList" :key="i">
          <td>第{{it.lotteryNum | issueDisplay}}期</td>
          <td>
            <ul class="bl">
              <li v-for="(item, i) in parseDrawResult(history.lcode, it.result, it.resultProperty)" :key="i" :class="item.class">{{item.num}}</li>
            </ul>
          </td>
          <td v-if = "history.lcode === 'k3'">
            <ul class="st">
              <li v-for="(item, i) in it.resultProperty.split(',').slice(0,3)" :key="i" >{{item}}</li>
            </ul>
          </td>
          <td v-if = "history.lcode === 'xgc'">
            <ul class="st"><li>{{it.resultProperty.slice(-1)}}</li></ul>
          </td>
        </tr>
      </tbody>
    </table>
  </cube-scroll>
</template>
<script>
import { issueDisplay, parseDrawResult, mapState } from '../util/tools'
export default {
  data() {
    return {
      sLottery: { k3: '和值/大小/单双', xgc: '特码' }
    }
  },
  filters: {
    issueDisplay
  },
  computed: {
    ...mapState(['history']),
    headData() {
      const name = ({ k3: '和值/大小/单双', xgc: '特码' })[this.history.lcode]
      const widts = ({ kl8: ['30%', '70%'], k3: ['30%', '35%', '35%'], xgc: ['27%', '60%', '13%'] })[this.history.lcode] || ['35%', '65%']
      return [{ name: '期数', width: widts[0] }, { name: '开奖号码', width: widts[1] }, { name, width: widts[2] }].filter(_ => _.width)
    }
  },
  watch: {
    history: {
      handler() {
        setTimeout(() => this.$refs.table && this.$refs.table.refresh(), 300)
      },
      immediate: true
    }
  },
  methods: {
    parseDrawResult
  }
}
</script>
<style lang="stylus" scoped>
    table
      text-align center
      width calc(100% - 32px)
      margin 0 16px
      border-top 1px solid #e6e6e6
      tr
        line-height 40px
        border-bottom 1px solid #e6e6e6
      th
        color #999
        font-size 14px
      td
        color #333
        font-size 12px
        vertical-align middle
        >ul
          display flex
          justify-content center
          align-items center
        .bl li
          line-height 24px
          margin-right 4px
          width 24px
          font-size 15px
          height 24px
          border-radius 50%
          color #fff
          background-image radial-gradient(12px at 4px 4px, #fff 6%, #0092ff 86%)
          &.sign
            background-image none
            text-align: center;
            width: 18px;
            color: #333;
            font-size: 18px;
          &:last-child
            margin-right 0px
        .st li
          font-size: 12px;
          line-height: 20px;
          min-width: 12px;
          height: 20px;
          margin-right: 4px;
          padding: 0 5px;
          background: #f5f5f5;
          border-radius: 2px;
          color: #333;
      .xgc 
        .st li
          margin-right: 0px;
        .bl li
          margin-right: 3px;
      .kl8
        tr
          line-height 26px
        ul
          flex-wrap wrap
          height 50px
          padding 1px 0
        .bl li
          width 20px
          height 20px
          line-height 20px
          margin-right 2px
</style>
