<template>
  <div class="bet">
    <div class="cond">
      <div ref='cascader' @click="showCascadePicker">{{lotteryLabel}}<i></i></div>
      <cube-select v-model="openDate" :options="selectOptions" @change="onPullingDown" title="时间选择" :disabled="dCode"></cube-select>
    </div>
    <div class="search">
      <cube-input v-model="lotteryNum" type='number' placeholder="请输入查询的期数" class="input"/>
      <div class='t_b' @click="onPullingDown">期数查询</div>
    </div>
    <p class="plh"></p>
    <div class="head">
      <p>期号</p><p>开奖号码</p>
    </div>
    <cube-scroll :options="options" :data="result" class="history _pulling" ref="history"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <ul class="contain result">
        <li style="display:none"></li>
        <li v-for="(it, i) in result" :key="i">
          <p>{{it.lotteryNum}}</p>
          <p :class="'c'+lcode">
            <ul class="ball">
              <li v-for="(item, i) in parseDrawResult(lcode, it.result, it.resultProperty)" :key="i" :class="item.class">{{item.num}}</li>
            </ul>
            <ul v-if="it.resultProperty && lcode !== 'kl8'" class="st">
              <li v-for="(_it, i) in it.resultProperty.replace(/ /g, '').split(',')" :key="i">{{_it}}</li>
            </ul>
          </p>
        </li>
      </ul>
      <div v-if='!result.length && noData' class="nodata"><i></i><p>暂无数据</p><i></i></div>
    </cube-scroll>
  </div>
</template>
<script>
import { getChartList } from '../../api/interface'
import { issueDisplay, parseDrawResult, format, mapState } from '../../util/tools'
const openDate = new Date()
export default {
  data() {
    return {
      lotteryLabel: '',
      lotteryNum: '',
      openDate: format(openDate),
      selectOptions: Array(5).fill(1).map((_, i) => format(new Date(openDate.getTime() - i * 24 * 3600000))),
      lotteryCode: '',
      fcode: '',
      noData: 0,
      options: {
        scrollbar: true,
        pullDownRefresh: {
          threshold: 60,
          stop: 40,
          stopTime: 400,
          txt: '刷新成功！'
        },
        pullUpLoad: {
          threshold: 0,
          stop: 40,
          txt: {
            more: '拉取数据成功！',
            noMore: '已无更多数据！'
          }
        }
      },
      result: []
    }
  },
  filters: {
    issueDisplay
  },
  created() {
    this.lotteryLabel = this.currentLottery.label
    this.fcode = this.currentLottery.fcode
    this.lotteryCode = this.currentLottery.code
  },
  watch: {
    lotteryCode() {
      if (this.dCode) this.openDate = this.selectOptions[0]
      this.onPullingDown()
    }
  },
  mounted() {
    const { lotterys } = this
    const index = lotterys.findIndex(_ => _.value === this.currentLottery.icode)
    this.cascadePicker = this.$createCascadePicker({
      title: '彩种选择',
      data: lotterys,
      selectedIndex: [index, lotterys[index].children.findIndex(_ => _.value === this.currentLottery.code)],
      onSelect: this.selectHandle,
      onCancel: this.cancelHandle
    })
  },
  computed: {
    ...mapState(['currentLottery', 'lotteryList']),
    lotterys() {
      return this.lotteryList.map(_ => ({ text: _.label, value: _.code, children: (_.children || []).map(i => ({ text: i.label, value: i.code })) }))
    },
    lcode() {
      return this.fcode === 'ft' ? 'pk10' : this.fcode
    },
    dCode() {
      return ['lhc', 'pl3', 'fc3d'].includes(this.lotteryCode)
    }
  },
  methods: {
    parseDrawResult,
    showCascadePicker() {
      this.$refs.cascader.classList.add('active')
      this.cascadePicker.show()
    },
    selectHandle(v, a, b) {
      this.lotteryLabel = b[1]
      this.fcode = v[0]
      this.lotteryCode = v[1]
      this.cancelHandle()
    },
    cancelHandle() {
      this.$refs.cascader.classList.remove('active')
    },
    onPullingDown() {
      this.pageNumber = 1
      this.result = []
      this.getData()
    },
    onPullingUp() {
      this.pageNumber++
      this.getData()
    },
    getData() {
      const { pageNumber, lotteryCode, lotteryNum, openDate } = this
      getChartList({ pageSize: 10, pageNumber, lotteryCode, lotteryNum, openDate: this.dCode ? '' : openDate }).then(res => {
        this.noData = 0
        if (res.list.length) this.result.push(...res.list)
        else {
          this.$refs.history.forceUpdate()
          this.noData = 1
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .bet
    .cond
      color #333
      margin 12px
      height 40px
      display flex
      font-size 16px
      font-weight 500
      justify-content space-between
      >div
        border-radius 20px
        box-sizing border-box
        border 1px solid #E6E6E6
        display flex
        overflow: hidden
        text-overflow: ellipsis;
        white-space: nowrap;
        width calc(50% - 6px)
        justify-content space-between
        align-items center
        padding-left 20px
        &:after
          display none
        &:first-child
          margin-right 12px
        &.active>i
          transform: rotate(180deg);
        >>> i
          transition: transform 0.3s ease-in-out
          width 32px
          height 32px
          margin-right 5px
          border none
          background-size cover
          background-image url('../../assets/images/betHistory/pulldown.png')
          &.cube-select-icon
            right 0
    .search
      margin 0 12px 12px
      font-size 16px
      font-weight 500
      display flex
      justify-content space-between
      .input
        flex-grow 1
        background-color #f5f5f5
        border-radius 4px
        overflow hidden
        &:after
          border-radius 4px!important
      .t_b
        width 90px
        line-height 40px
        text-align center
        border-radius 4px
        margin-left 12px
    .plh
      height 10px
      background-color #f0f0f0
    .head
      display flex
      font-size 14px
      color #999
      height 38px
      line-height 38px
      padding 0 16px
      border-bottom 1px solid #e6e6e6
      box-sizing border-box
      text-align center
      z-index 10
      p
        width 68%
      p:first-child
        width 32%
        padding-left 16px
    .history
      height calc(100% - 164px)
      .result
        border-top none
      .contain>li
        height unset
        align-items center
        background-color #fff!important
        border-bottom 1px solid #e6e6e6
        margin 0 16px
      p
        width 32%
        text-align center
        &:last-child
          box-sizing border-box
          width 68%
          display flex
          flex-direction column
          padding 10px 0
          ul
            width 100%
            display flex
            align-items center
            padding 4px 0
            flex-wrap wrap
          .ball li
            line-height: 24px;
            margin-right: 4px;
            width: 24px;
            font-size: 15px;
            height: 24px;
            border-radius: 50%;
            color: #fff;
            background-image: radial-gradient(12px at 4px 4px, #99fff7 6%, #0092ff 86%);
            &.sign
              background-image none
              text-align: center;
              width: 20px;
              color: #333;
              font-size: 18px;
            &:last-child
              margin-right 0
          .st li
            font-size: 12px;
            line-height: 20px;
            min-width 12px
            height: 20px;
            margin-right: 4px;
            padding: 0 5px;
            background: #f5f5f5;
            border-radius: 2px;
            color: #333;
            &:last-child
              margin-right 0
        &.cklsf .st li
          padding 0 3.3px
        &.cpk10
          padding-left 10px
        &.cssc
          padding-left 33px
        &.cc11x5
          padding-left 43px
        &.cxgc .st li
          margin-right 6.5px
          &:last-child
            margin-left 21px
        &.cklc
          padding-left 43px
          .st li
            padding 0 6px
        &.ck3
          padding-left 60px
        &.ckl8 .ball
          padding 2px 0
          li
            width 20px
            height 20px
            line-height 20px
            margin 4px 1px
      .cssl,.c3d
        .ball,.st
          justify-content center
  .nodata
    font-size 16px
    color #666
    height 60px
    display flex
    align-items center
    justify-content center
    i
      width 60px
      height 1px
      margin 0 5px
      background-color #e5e5e5
</style>
