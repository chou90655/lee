<template>
  <div class="bet_area">
    <div class="inner">
      <div class="betinfo">
        <p>已选中{{total}}注：<i>{{total * betAmount}}</i>元</p>
        <p>余额：<i>{{userInfo.memberBal || 0}}</i>元</p>
      </div>
      <div class="handle_bet">
        <cube-input v-model="betAmount" :clearable="{visible: true, blurHidden: false}" @click.native='click' ref='input' placeholder="输入金额" class="input"/>
        <div :class="['bt t_bd', isStop && '_stop']">
          <cube-button class="t_bc" light inline @click='reset'>重置</cube-button>
          <cube-button class="t_b" inline @touchstart.native="bet">下注</cube-button>
          <p>{{status}}</p>
        </div>
      </div>
      <ul class="keyboard" ref='keyboard'>
        <li v-for="(item, index) in keylist" :key="index">
          <span v-for="i in item" :key="i" @touchend="handleInput(i)">{{i}}<icon v-if="i === 'x'" href='tuige'/></span>
        </li>
      </ul>
      <div class="kd_mask" @click="hideKb" ref='mask'></div>
    </div>
    <div class="betDetail" :class="{visible:showBetDetail}">
      <transition name="scale">
        <div class="detail" v-if="showBetDetail">
          <icon :style="{display: isStop ? '' : 'none'}" href='yifengpan'/>
          <div class="header">
            <p class="t_b">{{openInfo.nextLotteryNum | issueDisplay}}期</p>
            <p>下注明细</p>
          </div>
          <cube-scroll :data="copyBetData" class="bet_display" :options="{ scrollbar: true }">
            <ul class="side">
              <li class="_headline"><i v-for="(it, i) in headerSide" :key="i">{{it}}</i></li>
              <li v-for="(it, i) in copyBetData" :key=i>
                <i>{{it.title||it.name}}</i>
                <i>{{it.label||it.number}}</i>
                <i>￥{{betAmount}}</i>
                <i @click="del(i)"><icon href='cancel'/></i>
              </li>
            </ul>
            <!-- <ul v-else>
              <li class="_headline"><i v-for="(it, i) in headerData" :key="i">{{it}}</i></li>
              <li v-for="(it, i) in copyBetData" :key=i>
                <i>{{it.typeName + ' ' + it.name}}</i>
                <i>{{it.odds}}</i>
                <i>￥{{betAmount}}</i>
                <i @click="del(i)"><icon href='cancel'/></i>
              </li>
            </ul> -->
          </cube-scroll>
          <div class="info">
            <p>{{isStop ? '开奖' : '封盘'}}时间：<i>{{sealTime.join(':')}}</i></p>
            <p class="amount">共{{total}}注：<i>{{total * betAmount}}</i>元</p>
          </div>
          <div class="btn">
            <cube-button class="t_bd" light inline @click="cancel">取消</cube-button>
            <cube-button :class="['t_b', isStop && '_stop']" inline @click="confirm">{{isStop ? '已封盘' : trigger ? '下注中' : '确认'}}</cube-button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
import { issueDisplay, toast, mapState, mapMutations } from '../util/tools'
import { getToken } from '../util/cach'
import { lotteryBet, getUser } from '../api/interface'
export default {
  data() {
    return {
      betAmount: '',
      trigger: 0,
      headerSide: ['玩法', '内容', '金额', '操作'],
      headerData: ['号码', '赔率', '金额', '操作'],
      showBetDetail: false,
      copyBetData: [],
      keylist: [
        [1, 2, 3, '+200'],
        [4, 5, 6, '+300'],
        [7, 8, 9, '+500'],
        ['C', 0, 'x', '+1000']
      ]
    }
  },
  filters: {
    issueDisplay
  },
  mounted() {
    window.__this = this
    this.$refs.input.$el.querySelector('input').setAttribute('readonly', 1)
    this.getUserInfo()
    this.timeId = setInterval(() => this.getUserInfo(), 8000)
  },
  computed: {
    ...mapState(['betData', 'openInfo', 'sealTime', 'status', 'currentLottery', 'userInfo']),
    total() {
      return this.copyBetData.reduce((a, c) => a + c.zhushu, 0)
    },
    isStop() {
      return this.status.includes('已')
    }
  },
  watch: {
    betData() {
      this.copyBetData = [...this.betData]
    }
  },
  beforeDestroy() {
    clearInterval(this.timeId)
  },
  methods: {
    ...mapMutations(['setIsReset', 'setUserInfo']),
    getUserInfo() {
      getToken() && getUser().then(res => res && this.setUserInfo({ ...res, memberBal: res.memberBal || res.balance || 0, memberAcct: res.memberAcct || res.userAccount }))
    },
    bet() {
      // if (!getToken()) return toast('请在登陆后下注！', false)
      if (this.betData.err) {
        return toast(this.betData.err, false)
      } else if (!this.betData.length) {
        return toast('请选择号码！', false)
      } else if (!this.betAmount) {
        this.click()
        return toast('请选择下注金额！', false)
      } else if (!this.total) {
        return toast('无效的投注！', false)
      }
      this.$refs.keyboard.classList.remove('show')
      this.$refs.mask.classList.remove('show')
      this.showBetDetail = true
    },
    cancel() {
      this.showBetDetail = false
      this.copyBetData = [...this.betData.filter(_ => _)]
    },
    del(index) {
      this.copyBetData.splice(index, 1)
      if (!this.total) this.cancel()
    },
    confirm() {
      if (this.userInfo.memberBal < this.total * this.betAmount) return toast('当前余额不足！', false)
      const orderList = this.copyBetData.map(_ => ({ ..._, price: _.zhushu * this.betAmount, beishu: this.betAmount / 2, yjf: 1 }))
      let data = { orderList, lotteryname: this.currentLottery.code, expect: this.openInfo.nextLotteryNum, username: 'test1007' }
      console.log(JSON.stringify(data))
      if (this.trigger) return
      this.trigger = 1
      lotteryBet(data).then(res => {
        toast('投注成功！', false)
        this.reset()
        this.getUserInfo()
      }).finally(() => (this.trigger = 0))
    },
    click() {
      this.$refs.input.$el.querySelector('input').blur()
      this.$refs.keyboard.classList.add('show')
      this.$refs.mask.classList.add('show')
    },
    hideKb() {
      this.$refs.keyboard.classList.remove('show')
      this.$refs.mask.classList.remove('show')
    },
    reset() {
      this.betAmount = ''
      this.showBetDetail = false
      this.mode = false
      this.hideKb()
      this.setIsReset(1)
    },
    handleInput(i) {
      this.betAmount1 = this.betAmount
      switch (true) {
        case i < 10: this.betAmount = this.mode ? +this.betAmount + i : +this.betAmount * 10 + i; break
        case i > 10: this.mode = false; this.betAmount = +this.betAmount + (+i.slice(1)); break
        case i === 'x': this.betAmount = Math.floor(+this.betAmount / 10); break
        default: this.betAmount = ''; this.mode = false
      }
      this.betAmount = this.betAmount || ''
      if (this.betAmount >= 10000000) {
        toast('超过了最大值！')
        this.betAmount = this.betAmount1
      }
    }
  }
}
</script>
<style lang="stylus" scoped>
  .bet_area
    height 94px
    .t_b:active
      opacity .8
    .inner
      z-index 10000
      border-top 0.5px solid #f2f2f2
      width 100%
      background-color #fff
      position absolute
      bottom 0
      left 0
      .kd_mask
        transition all 0.28s ease-out
        position absolute
        width 100%
        background-color rgba(0,0,0,.3)
        height 3000px
        top -3000px
        opacity 0
        visibility hidden
        &.show
          visibility visible
          opacity 1
    ._stop
      background-color #e6e6e6!important
      pointer-events none
      border none!important
      p
        color #999
        background-color #e6e6e6
        display block!important
      button
        opacity 0
    .handle_bet
      height 44px
      display flex
      justify-content space-around
      font-size 16px
      padding 0 12px
      margin-bottom 10px
      .bt
        box-sizing border-box
        position relative
        width 180px
        display flex
        border-radius 22px
        overflow hidden
        p
          position absolute
          top 0
          width calc(100% + 1px)
          height 100%
          font-size 18px
          text-align center
          line-height 44px
          display none
        button
          width 80px
          font-size 16px
          border-radius 0
          color #54b1ff
        .t_b
          width 100px
      .input
        width 160px
        font-size 16px
    .betinfo
      z-index 1
      position relative
      padding 0 12px
      height 40px
      display flex
      line-height 40px
      justify-content space-between
      font-size 14px
      color #999
      i
        font-size 18px
        color #FF3A39
        font-weight 600
        padding-right 3px
    .keyboard
      transition height 0.25s ease-out
      height 0px
      font-size 18px
      &.show
        height 200px
      li
        display flex
        color #2c3e50
        font-weight 700
        border-top 1px solid #e5e5e5
        span
          box-sizing border-box
          user-select none
          width 25%
          text-align center
          height 50px
          line-height 50px
          font-weight 600
          &+span
            border-left 1px solid #e5e5e5
          &:last-of-type
            color #19b4f5
          &:active
            background-color #e5e9f2
        &:last-of-type
          span:first-of-type
            color #f00
          span:nth-of-type(3)
            font-size 0
            svg
              margin-top 10px
              color #4c5c6c
              font-size 30px
              font-weight normal
    .betDetail
      position absolute
      width 100%
      height 100%
      transition all .3s ease-out
      background-color rgba(0,0,0,.5)
      top 0
      opacity 0
      display flex
      justify-content center
      align-items center
      visibility hidden
      z-index 10001
      &.visible
        opacity 1
        visibility visible
      .detail
        width 340px
        height 448px
        background-color #fff
        border-radius 8px
        position relative
        >.l_icon
          position absolute
          width 70px
          height 70px
          top 13px
          right 15px
          z-index 999
        .bet_display
          margin 0 auto
          width 310px
          height 262px
          background #F5F5F5
          border-radius 4px
          font-size 16px
          color #999
          text-align center
          .header
            i
              color #999!important
          li
            display flex
            line-height 40px
            i
              width 22%
              color #333
              &:first-of-type
                color #ff3a39
                width 34%
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
              &:nth-of-type(2)
                overflow hidden
                text-overflow ellipsis
                white-space nowrap
        .info
          height 25px
          line-height 25px
          margin 14px 12px 0
          font-size 14px
          display flex
          justify-content space-between
          color #333
          i
            color #ff3a39
          .amount
            color #999
            i
              font-size 18px
              padding-right 3px
              font-weight 600
        .btn
          height 44px
          margin-top 20px
          display flex
          justify-content space-around
          button
            box-sizing border-box
            width 152px
            box-shadow none
            border-radius 22px
            font-size 18px
            font-weight 500
        ._headline
          height 28px
          line-height 28px!important
          margin 15px 0 2px
          position relative
          i
            color #999!important
        .header
          height 28px
          line-height 28px!important
          margin 15px 0 14px
          position relative
          p
            font-size: 18px;
            color: #333333;
            text-align: center;

          .play_type
            display none
            position absolute
            right 18px
            font-size 12px
            top 2px
            color #ff3a39
          .t_b
            position absolute
            left -6px
            font-size: 12px
            padding 0 20px 0 10px
            border-radius 0 2px 2px 0
            &:after
              content ''
              position absolute
              width: 0;
              height: 0;
              border: 16px solid transparent;
              border-right: 12px solid #fff;
              border-radius 8px
              right -3px
              top -2px
</style>
