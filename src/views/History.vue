<template>
  <div class="historyInner">
    <historyList/>
  </div>
</template>
<script>
import { issueDisplay, parseDrawResult, mapState, mapActions } from '../util/tools'
import historyList from '../components/historyList' // 历史开奖信息展示组件
export default {
  components: { historyList },
  data() {
    return {
      options: { scrollbar: true },
      index: 0,
      activeIndex: 0,
      rankIndex: 0
    }
  },
  watch: {
    index(v) {
      if (v === 1 && this.$refs._lm) this.$refs._lm.refresh()
      this.activeIndex = 0
      this.rankIndex = 0
    },
    activeIndex() {
      this.$refs._head && this.$refs._head.scrollTo(0, 0, 0)
      this.$refs._body && this.$refs._body.scrollTo(0, 0, 0)
      this.rankIndex = 0
    },
    rankIndex() {
      this.$refs._body && this.$refs._body.scrollTo(0, 0, 0)
    }
  },
  created() {
    this.getGameList() // 获取开奖历史
  },
  filters: {
    issueDisplay
  },
  computed: {
    ...mapState(['history']),
    zz() {
      let result = []
      const { dropList } = this.history
      if (dropList) {
        const { bigOrSmall, sumBigOrSmall, sumSingleOrEven, dragonOrTiger, singleOrEven } = dropList
        if (dragonOrTiger && dragonOrTiger.length) {
          result.push({ name: '龙虎', data: dragonOrTiger.map((_, i) => this.parseZz(_, i)) })
        }
        if (bigOrSmall && bigOrSmall.length) {
          let bs = bigOrSmall.map((_, i) => this.parseZz(_, i))
          bs.push({ tlitle: this.isPk10 ? '冠亚和' : '总和', arr: sumBigOrSmall.join('').match(/(.)\1*/g) })
          result.push({ name: '大小', data: bs })
        }
        if (singleOrEven && singleOrEven.length) {
          let bs = singleOrEven.map((_, i) => this.parseZz(_, i))
          bs.push({ tlitle: this.isPk10 ? '冠亚和' : '总和', arr: sumSingleOrEven.join('').match(/(.)\1*/g) })
          result.push({ name: '单双', data: bs })
        }
      }
      return result
    },
    isPk10() {
      return this.history.lcode === 'pk10'
    },
    detailData() {
      const data = this.zz[this.activeIndex]
      return (data && data.data[this.rankIndex].arr) || []
    },
    lm() {
      let arr = this.history.dropList.winLongRank.map(_ => {
        const { lotteryContinuous, lotteryLocation } = _
        const ltAr = lotteryLocation.split('-')
        return { lt: ltAr[0], play: ltAr[1], lo: lotteryContinuous }
      })
      arr.unshift({ lt: '彩种', play: '玩法', lo: '开奖结果' })
      return arr
    }
  },
  methods: {
    ...mapActions(['getGameList']),
    parseDrawResult,
    parseZz(data, index) { // 解析走珠数据及文字
      const indexMap = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十']
      const arr = data.join('').match(/(.)\1*/g)
      if (this.isPk10) {
        switch (index) {
          case 0: return { tlitle: '冠军', arr }
          case 1: return { tlitle: '亚军', arr }
          default: return { tlitle: '第' + indexMap[index] + '名', arr }
        }
      } else {
        return { tlitle: '第' + indexMap[index] + '球', arr }
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .historyInner
    height 310px
    background-color #fff
    .rodio
      font-size 16px
      >li
        width (100 / 3) %
    .cube-slide
      height calc(100% - 40px)
    .h_tabs
      display flex
      li
        height 40px
        line-height 40px
        flex-grow 1
        text-align center
        font-size 14px
        color #C8C8C8
        &.t_bc
          font-size 16px
    ._head
      margin-top -10px
      height 44px
      ul
        height 44px
        align-items center
        display flex
        white-space nowrap
        li
          height 24px
          line-height 24px
          width 54px
          border-radius 12px
          text-align center
          margin 0 10px
          font-size 12px
          background-color #F8F8F8
          &.t_bc
            background-color rgba(84,177,255,.2)
    ._body
      height calc(100% - 74px)
      ._inner
        display flex
        white-space nowrap
        ul
          box-sizing border-box
          border-right 1px solid #f8f8f8
          li
            box-sizing border-box
            width 18px
            border-bottom 1px solid #f8f8f8
            height 18px
            i
              display block
              margin auto
              width 16px
              text-align center
              line-height 16px
              height 16px
              font-size 12px
              border-radius 50%
              &.spe
                background-color #ff3a39
    ._lm ul
      padding 0 10px
      li
        text-align center
        box-sizing border-box
        height 40px
        font-size 14px
        line-height 40px
        border-bottom 1px solid #e6e6e6
        display flex
        color #333
        span
          width (100 / 3) %
        &:first-child
          height 36px
          line-height 36px
          span
            color #999!important
</style>
<style lang="stylus">
  .historyInner .cube-slide-item table
    border-top none
</style>
