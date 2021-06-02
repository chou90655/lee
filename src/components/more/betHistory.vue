<template>
  <div class="betH">
    <div class="select" ref="cascader"><div @click="showCascadePicker">{{label}}<i></i></div></div>
    <cube-tab-bar v-model="betStatus" :data="tabs" showSlider/>
    <cube-scroll :options="options" :data="bethistory" class="betHistory" ref="history"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <ul class="cont" v-if="bethistory.length">
        <li v-for="(it, i) in bethistory" :key="i">
          <div class="tl">
            <p class="nam"><i>{{it.lotteryName}}</i>({{it.lotteryNum|issueDisplay}})</p>
            <p :class="{t_bc: it.betStatus == 1}" @click="detail(it)">{{['未派彩', '已派彩'][it.betStatus] || '已撤单'}}<icon href='in'/></p>
          </div>
          <div class="det">
            <p><span>{{it.betAmount}}</span><i>投注金额</i></p>
            <p><span class="t_bc">{{['未派彩', it.netAmount + ''][it.betStatus] || '已撤单'}}</span><i>派彩金额</i></p>
            <p class="ctent">
              <span>玩法：<i>{{it.typeName}}</i></span>
              <span class="bet_d">投注：<i>{{it.playName}}</i></span>
            </p>
          </div>
        </li>
      </ul>
      <div v-else class="nodata"><i></i><p>暂无数据</p><i></i></div>
    </cube-scroll>
  </div>
</template>
<script>
import { betList } from '../../api/interface'
import { issueDisplay, mapState } from '../../util/tools'

export default {
  data() {
    const { state } = this.$route.query
    return {
      bethistory: [],
      label: '全部彩种',
      betStatus: state ? +state : '',
      pageNumber: 1,
      tabs: [{ label: '全部', value: '' }, { label: '未派彩', value: 0 }, { label: '已派彩', value: 1 }],
      options: {
        scrollbar: true,
        pullDownRefresh: { threshold: 60, stop: 40, stopTime: 400, txt: '刷新成功!' },
        pullUpLoad: { threshold: 0, stop: 40, stopTime: 4000, txt: { more: '拉取数据成功!', noMore: '已无更多数据!' } }
      },
      item: {}
    }
  },
  filters: {
    issueDisplay
  },
  created() {
    this.getData()
  },
  mounted() {
    const tabs = document.querySelector('.cube-tab-bar-slider')
    if (tabs) tabs.classList.add('t_b')
    this.lotteryCode = ''
    this.cascadePicker = this.$createCascadePicker({
      title: '彩种选中',
      data: this.lotterys,
      selectedIndex: [0, 0],
      onSelect: this.selectHandle,
      onCancel: this.cancelHandle
    })
  },
  watch: {
    label() {
      this.getData(1)
    },
    betStatus() {
      this.$refs.history.scrollTo(0, 0, 0)
      this.getData(1)
    }
  },
  computed: {
    ...mapState(['lotteryList']),
    lotterys() {
      const arr = this.lotteryList.map(_ => ({ text: _.label, value: '', children: (_.children || []).map(i => ({ text: i.label, value: i.code })) }))
      return [{ text: '全部彩种', value: '', children: [{ text: '全部彩种', value: '' }] }, ...arr]
    }
  },
  methods: {
    showCascadePicker() {
      this.$refs.cascader.classList.add('active')
      this.cascadePicker.show()
    },
    selectHandle(v, a, b) {
      this.label = b[1]
      this.lotteryCode = v[1]
      this.cancelHandle()
    },
    cancelHandle() {
      this.$refs.cascader.classList.remove('active')
    },
    onPullingDown() {
      this.pageNumber = 1
      this.getData()
    },
    onPullingUp() {
      this.pageNumber++
      this.getData()
    },
    detail(item) {
      this.item = item
      this.$router.push('betHistory/betDetail', () => {})
    },
    getData(reset) {
      if (reset) this.pageNumber = 1
      const { betStatus, lotteryCode, pageNumber } = this
      const par = { pageNumber, pageSize: 30, lotteryCode, betStatus }
      betList(par).then(res => {
        if (res) {
          const { list } = res
          if (this.pageNumber === 1) this.bethistory = list
          else if (!list.length) this.$refs.history.forceUpdate()
          else this.bethistory.push(...list)
        } else {
          this.$refs.history.forceUpdate()
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .betH
    background-color #f5f5f5
    position relative
    .detail
      position absolute
      top 0
      left 0
      width 100%
      background-color #fff
      z-index 1
   .cont
      padding 8px 0 0
      border-top none
      font-size 12px
      color #999
      >li
        background-color #fff
        margin 6px 12px 12px
        height 110px
        box-shadow 0 2px 6px 0 rgba(101,105,109,0.06)
        border-radius 8px
    .tl
      height 41px
      line-height 42px
      display flex
      margin 0 16px
      justify-content space-between
      border-bottom 1px dashed #c8c8c8
      position relative
      svg
        font-size 15px
      &:after,&:before
        position absolute
        content: ''
        width 14px
        height 14px
        background-color #f5f5f5
        border-radius 50%
        bottom -8px
      &:after
        left -23px
      &:before
        right -23px
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
    .det
      display flex
      height 67px
      align-items center
      .ctent
        border-left 1px solid #e6e6e6
        padding-left 30px
        flex-grow 1
        text-align left
        span
          line-height 22px
          font-size 12px
        i
          color #151515
          font-weight 500
      p
        width 30%
        text-align center
        line-height 18px
        >span
          line-height 25px
          font-size 16px
          color #666
          display block
          font-weight 500
    .nam
      font-size 16px
      i
        font-weight 600
        color #333
    .bet_d
      max-width 100px
      overflow: hidden
      text-overflow: ellipsis;
      white-space: nowrap;
      display inline-block
  .select
    background-color #fff
    height 64px
    padding 12px
    box-sizing border-box
    &.active i
      transform: rotate(180deg);
    >div
      display flex
      height 40px
      justify-content space-between
      align-items center
      border-radius 20px
      font-size 16px
      padding-left 60px
      background-size contain
      background-repeat no-repeat
      background-color #eff7fc
      background-image url('../../assets/images/betHistory/lottery.png')
      >i
        transition: transform 0.3s ease-in-out
        width 32px
        height 32px
        margin-right 5px
        background-size cover
        background-image url('../../assets/images/betHistory/pulldown.png')
  .cube-tab-bar
    background-color #fff
    font-size 16px
    height 44px
    >>>.cube-tab
      color #C8C8C8
    >>>.cube-tab_active
      color #333
      div
        font-weight 550
  .betHistory
    height calc(100% - 110px)
</style>
<style lang="stylus">
  .betHistory
    .cube-pulldown-wrapper
      margin-top 8px
    .cube-pulldown-loaded
      font-size 16px
    .cube-pullup-wrapper
      font-size 16px
      .before-trigger,.after-trigger
        padding 12px
    .before-trigger
      padding-top 3px
</style>
