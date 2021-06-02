<template>
  <div class="layout">
    <header class="t_b">
      <h3 class="f_mn" @click="showList"><icon class="back" href='qiehuan'/>{{currentLottery.label}}</h3>
      <div>
        <icon v-for="(it, i) in ['change', 'change1', 'rule']" :key="i" :href='it' @click.native="iconClick(i)" :class="{hide : i === isSwitch}"/>
      </div>
    </header>
    <lottery-info @getOpenInfo='getOpenInfo' ref="lotteryInfo"></lottery-info>
    <play-area :plays='plays' :change='isSwitch' @touchstart.native="Intercept"></play-area>
    <bet-area/>
    <transition name="slide">
      <more-list v-if="showMore" @chooseTheme="showMore = 0"/>
    </transition>
    <transition name="fade">
      <div class="_mask" @click="showMore = 0" v-if="showMore"></div>
    </transition>
  </div>
</template>
<script>
import LotteryInfo from './LotteryInfo' // 开奖和计时信息展示组件
import PlayArea from './PlayArea' // 玩法及下注组件
import BetArea from './BetArea' // 金额和投注组件
import MoreList from './MoreList' // 右侧划入组件
import allPlays from '../data/allPlays' // 所有大彩种玩法数据
import { getLotterytimes, getChartList } from '../api/interface'
import { mapState, mapMutations, mapActions } from '../util/tools'
export default {
  components: {
    LotteryInfo,
    PlayArea,
    BetArea,
    MoreList
  },
  data() {
    return {
      isSwitch: 0,
      showMore: 0
    }
  },
  created() {
    this.currentLottery.code && this.lotterChange() // 开始时拉取当前彩种信息
  },
  computed: {
    ...mapState(['currentLottery', 'status', 'openInfo']),
    plays() {
      return allPlays[this.currentLottery.lcode] || [{}]
    }
  },
  watch: {
    currentLottery() { // 当前彩种变化时 拉取当前彩种信息
      setTimeout(() => (this.showMore = 0), 130)
      this.lotterChange()
    }
  },
  beforeDestroy() {
    clearTimeout(this.timerId)
  },
  methods: {
    ...mapMutations(['setOpenInfo']),
    ...mapActions(['getLotteryData', 'getGameList']),
    lotterChange() {
      this.getOpenInfo()
      this.getLotteryData(this.currentLottery)
    },
    Intercept(e) { // 对滑动事件进行拦截，防止在uc上触发点击事件
      this.trigger = 1
      clearTimeout(this.timeId)
      this.timeId = setTimeout(() => (this.trigger = 0), 500)
    },
    showList() { // 对滑动事件进行拦截，防止在uc上触发点击事件
      setTimeout(() => this.trigger || this.$emit('showLotteryList'), 50)
    },
    async getOpenInfo(e) { // 获取状态和开奖信息
      this.loadHis = e
      clearTimeout(this.timerId)
      // const { code: lotteryCode } = this.currentLottery
      // 查询并设置当前彩种状态 做到与后台实时同步
      // this.currentLottery.status = await getStatus({ lotteryCode }).then(res => lotteryCode === this.currentLottery.code ? res : this.currentLottery.status)
      this.pcLoadKgGameResult()
    },
    getresult(val) {
      getChartList(val).then(res1 => {
        if (res1 && res1[0]) this.setOpenInfo({ ...this.openInfo, result: res1[0].opencode })
        else this.tid1 = setTimeout(() => this.getresult(val), 3000)
      })
    },
    pcLoadKgGameResult() { // 获取开奖信息
      const { fcode, code } = this.currentLottery
      getLotterytimes({ cptype: fcode, lotteryname: code }).then(res => {
        if (code === this.currentLottery.code) {
          this.setOpenInfo(res || {})
          clearTimeout(this.tid1)
          this.getresult({ expect: res.expect, lotteryname: code })
          // if (res.result && this.loadHis === 1) this.getGameList() // 如果历史记录为展示状态，则同步更新历史记录
          // if (!res.result && this.currentLottery.status && this.status !== '已关盘') this.timerId = setTimeout(this.pcLoadKgGameResult, 3000)
        }
      })
    },
    iconClick(index) { // 对滑动事件进行拦截，防止在uc上触发点击事件
      setTimeout(() => {
        if (this.trigger) return
        if (index === 2) {
          this.showMore = 1
        } else {
          this.isSwitch = index
        }
      }, 50)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .layout
    flex-shrink 0
    background-color #fff
    width 100%
    box-shadow -3px 0 8px rgba(0,0,0,.3)
    z-index: 1
    position relative
    header
      font-size 18px
      height 48px
      line-height 48px
      display flex
      justify-content space-between
      >div
        margin-right 2.5px
      .l_icon
        position relative
        font-size 20px
        margin 0 12.5px
        &.hide
          display none
        &.back
          margin 0 10px 0 12.5px
    ._mask
      width 100%
      height 100%
      background-color rgba(0,0,0,0.6)
      position absolute
      top 0
      left 0
      z-index 10012
</style>
