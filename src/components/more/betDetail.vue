<template>
  <cube-scroll :options="{ scrollbar: true }" class="detail">
    <ul class="det cont" v-if="item.lotteryName">
      <li><p>期号</p><p>{{item.lotteryNum|issueDisplay}} {{item.lotteryName}}</p></li>
      <li><p>开奖号码</p><p  class="t_bc els">{{item.openResult}}</p></li>
      <li><p>订单号</p><p class="no"><i>{{item.id}}</i>
        <input class="t_b" value="复制" ref="copy" readonly v-if='isUc'/>
        <span class="t_b" ref="copy" v-else>复制</span>
      </p></li>
      <li><p>玩法</p><p>{{item.typeName}}</p></li>
      <li><p>奖金赔率</p><p>{{item.odds}}</p></li>
      <li><p>投注内容</p><p class="els">{{item.playName}}</p></li>
      <li><p>投注金额</p><p>{{(+item.betAmount).toFixed(2)}}</p></li>
      <li><p>派彩金额</p><p>{{item.betStatus == 1 ? (+item.netAmount).toFixed(2) : '未派彩'}}</p></li>
      <li><p>返水金额</p><p>{{(+item.rebateAmount || 0).toFixed(2)}}</p></li>
      <li><p>返水比例</p><p>{{item.rebate || 0}}</p></li>
      <li><p>输赢</p><p :style="winAmountColor">{{ winAmount }}</p></li>
      <li><p>状态</p><p>{{['未派彩', '已派彩'][item.betStatus] || '已撤单'}}</p></li>
      <li><p>投注时间</p><p>{{item.createTime | format}}</p></li>
    </ul>
  </cube-scroll>
</template>
<script>
import { issueDisplay, toast, mod, format } from '../../util/tools'
import Clipboard from 'clipboard'
export default {
  props: {
    item: Object
  },
  created() {
    if (!this.item.id) this.$router.push(mod + '/more/betHistory')
  },
  filters: {
    issueDisplay,
    format(v) {
      const time = new Date(v)
      return format(time) + ' ' + time.toTimeString().slice(0, 8)
    }
  },
  computed: {
    isUc() {
      return navigator.userAgent.indexOf('UCBrowser') > -1
    },
    winAmountColor() {
      if (this.winAmount > 0) return { 'color': 'green' }
      if (this.winAmount < 0) return { 'color': 'red' }
      return ''
    },
    winAmount() {
      if (+this.item.betStatus !== 1) return 0
      return (this.item.netAmount + this.item.rebateAmount - this.item.betAmount).toFixed(2)
    }
  },
  mounted() {
    const { id } = this.item
    id && this.initClipboard(id)
  },
  methods: {
    initClipboard(No) {
      const clipboard = new Clipboard(this.$refs.copy, { text: () => No })
      clipboard.on('success', () => toast('复制成功！', false))
      clipboard.on('error', () => toast('复制失败,请手动复制！', false))
    }
  }
}
</script>
<style lang="stylus" scoped>
  .detail .det
    .els
      overflow: hidden
      text-overflow: ellipsis;
      white-space: nowrap;
      display inline-block
      max-width calc(100% - 90px)
    li
      font-size 14px
      height 44px
      line-height 44px
      color #666
      background-color #fff
      display flex
      justify-content space-between
      padding 0 15px
      border-bottom 1px solid #f2f2f2
      p:last-child
        color #333
      p.no
        color #333
        text-align right
        font-weight 500
        display flex
        align-items center
        i
          overflow: hidden;
          font-weight 500
          text-overflow: ellipsis;
          white-space: nowrap;
          display inline-block
          max-width 200px
        .t_b
          height 24px
          font-weight 400
          width 44px
          text-align center
          font-size 12px
          border-radius 4px
          line-height 24px
          margin-left 5px
</style>
