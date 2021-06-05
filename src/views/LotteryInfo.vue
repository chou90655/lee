<template>
  <div class="lottery_info">
    <div class="vplh" v-if="!currentLottery.code"><p></p><p></p><p></p></div>
    <router-view name="result"></router-view>
    <div class="time">
      <p>{{openInfo.currFullExpect | issueDisplay}}期</p>
      <p>{{status === '已封盘' ? '开奖' : status}}</p>
      <p :class="{three: fTime.length === 3, stop: status.includes('已')}"><span v-for="(it, i) in fTime" :key="i"><i v-if="i!==0">:</i>{{it}}</span></p>
    </div>
    <icon href='xialalan' @click.native="showHistory = 1"/>
    <div :class="['history', showHistory && 'isShow']">
      <transition name="down">
        <history v-if='showHistory'/>
      </transition>
      <icon href='shangshoulan' @click.native="showHistory = 0"/>
    </div>
  </div>
</template>
<script>
import { issueDisplay, mapState, mapMutations, toast } from '../util/tools'
import History from './History'
export default {
  components: { History },
  filters: {
    issueDisplay
  },
  data() {
    return {
      sealTime: 0,
      showHistory: 0,
      nextStopTime: 0,
      showLive: 0
    }
  },
  computed: {
    ...mapState(['status', 'currentLottery', 'openInfo']),
    fTime() { // 格式化时间 方便页面展示
      const time = this.sealTime > 0 ? this.sealTime : 0
      const sec = time % 60
      const hou = Math.floor(time / 3600)
      const min = (time - hou * 3600 - sec) / 60
      const re = this.handleTime(hou ? [hou, min, sec] : [min, sec])
      this.setSealTime(re)
      return re
    }
  },
  beforeDestroy() {
    clearInterval(this.timeId)
  },
  watch: {
    $route() {
      this.showHistory = 0
    },
    openInfo({ nextStopTime, nextOpenTime }) { // 处理当前彩种开奖信息 判断和设置状态 和 计时功能
      clearInterval(this.timeId)
      this.sealTime = 0
      // if (!this.currentLottery.status) return this.setStatus('已停售')
      if (nextOpenTime < 0) return this.setStatus('已关盘')
      let tr = nextStopTime <= 0
      this.nextStopTime = nextOpenTime
      this.sealTime = tr ? nextOpenTime : nextStopTime
      this.setStatus(tr ? '已封盘' : '在售')
      this.timeId = setInterval(() => {
        --this.nextStopTime
        if (--this.sealTime <= 0) {
          if (tr) {
            clearInterval(this.timeId)
            this.$emit('getOpenInfo', this.showHistory)
          } else {
            this.setStatus('已封盘')
            tr = 1
            this.sealTime = nextOpenTime - nextStopTime
          }
        }
      }, 1000)
    }
  },
  methods: {
    ...mapMutations(['setSealTime', 'setStatus']),
    handleTime(times) {
      return times.map(_ => this.formatTime(_))
    },
    formatTime(time) {
      return time < 10 ? '0' + time : time
    },
    live() {
      if (['已停售', '已关盘'].includes(this.status)) return toast('该彩种' + this.status + '！')
      this.showLive = 1
    }
  }
}
</script>
<style lang="stylus" scoped>
  .lottery_info
    font-size 14px
    height 110px
    display flex
    padding 10px 0 20px 0
    box-sizing border-box
    color #999
    position relative
    ._img
      z-index: 1;
      position: absolute;
      width: 35px;
      right: 137px;
      top: 2px;
    ._video
      position: absolute;
      z-index: 10011;
      height: 310px;
      width: 100%;
      top: -48px;
      background-color: #fff;
      overflow: hidden;
      ._head
        height: 40px;
        line-height: 40px;
        display: flex;
        justify-content: space-between;
        padding: 0 20px;
        >p
          margin: 0;
          line-height: 40px;
          color: #333;
          font-size: 16px;
      ._iframe
        width: 100%;
        height: 270px;
    .down-enter-active
      animation down .25s ease-out
    .down-leave-active
      animation down .35s reverse
    @keyframes down {
      0% {
        height 0px
      }
      100% {
        height 310px
      }
    }
    .vplh
      flex-grow 1
      display flex
      flex-direction column
      justify-content center
      border-right 1px solid #E6E6E6
      padding-left 16px
      position relative
      z-index -1
      p
        width 92%
        height 20px
        background-color #f0f0f0
        &:first-child
          width 83%
    .video-container
      width 100%
      height 310px
      background-color #fff
      position absolute
      top -48px
      z-index 10011
    .cover
      position absolute
      width 100%
      height 2000px
      top -48px
      background rgba(0,0,0,0.5)
      z-index 10010
    .history
      position absolute
      width 100%
      height 2000px
      top calc(100% - 14px)
      background rgba(0,0,0,0.5)
      z-index 10010
      opacity 0
      transition all .15s ease-out .38s
      visibility hidden
      &.isShow
        transition all .15s ease-out
        opacity 1
        visibility visible
      .l_icon
        width 60px
        display block
        margin 0 auto
    >.l_icon
      position absolute
      width 60px
      bottom 0
      left calc(50% - 30px)
    p
      line-height 20px
      margin 3px 0
    .time
      width 125px
      flex-shrink 0
      text-align center
      span
        margin-top 3px
        display inline-block
        font-size 18px
        line-height 25px
        color #FF3A39
        width 36px
        background: rgba(255,58,57,0.10)
        border-radius: 2px
        position relative
        i
          position absolute
          left -9px
        &+span
          margin-left 12px
      .three span
        width 28px
      .stop span
        background #E6E6E6
        color #fff
        i
          color #999
</style>
<style lang="stylus">
  .lottery_info div.result
    flex-grow 1
    display flex
    flex-direction column
    justify-content center
    border-right 1px solid #E6E6E6
    padding-left 16px
    .ball
      display flex
      li
        font-size 15px
        line-height 24px
        height 24px
        width 24px
        border-radius 50%
        text-align center
        color #fff
        margin 3px 2px 3px 0
        background-image: radial-gradient(12px at 4px 4px, #99FFF7 6%, #0092FF 86%);
    .attach
      display flex
      margin 3px 0
      li
        font-size 12px
        line-height 20px
        height 20px
        margin-right 4px
        padding 0 5px
        background:rgba(245,245,245,1);
        border-radius:2px;
        color #333
    p
      line-height 20px
      margin 3px 0
    .msg
      margin 5px 0
</style>
