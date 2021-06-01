<template>
  <div class="bet">
    <div class="rodio">
      <ul>
        <li v-for="(it, i) in tabData" :class="{t_bc: rodioIndex === i}" @click="i && (rodioIndex = i)" :style = "{width: 100 / tabData.length + '%'}" :key=i>{{it}}</li>
      </ul>
    </div>
    <cube-scroll :options="{ scrollbar: true }" :data = "trendData" ref="scroll">
      <ul class="num cont" ref="num">
        <li v-for="(_, i) in trendData" :key="i">{{_.title}}</li>
      </ul>
      <canvas ref="canvas" :width="size.cWidth" :height="size.cHeight"></canvas>
    </cube-scroll>
    <transition name="fade">
      <div class="cfg" v-if='showConfig'></div>
    </transition>
    <transition name="scale">
      <div v-if='showConfig' class="cfg content">
        <div class="head">走势图设置</div>
        <div class="cfgc">
          <div v-for="(_, _i) in cfgData" :key="_i">
            <p class="name">{{_.name}}：</p>
            <p v-for="(item, i) in _.option" :key="i" @click="_.index = i">
              <icon :href="i === _.index ? 'check_bule' : 'uncheck_normal'"/>{{item}}
            </p>
          </div>
        </div>
        <div class="btng">
          <cube-button class="t_bd" light inline @click="showConfig = 0">取消</cube-button>
          <cube-button class="t_b" inline @click="confirm">确认</cube-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script>
// import { queryNowBet } from '../../api/interface'
import { getTheme } from '../../util/cach'
export default {
  props: {
    config: Number
  },
  mounted() {
    const theme = '#' + getTheme()
    const { scroll, num } = this.$refs
    this.size = { cWidth: scroll.$el.offsetWidth - num.offsetWidth, cHeight: num.offsetHeight }
    this.$nextTick(() => {
      const { canvas } = this.$refs
      if (canvas.getContext) {
        const { cWidth, cHeight } = this.size
        var ctx = canvas.getContext('2d')
        this.trendData.forEach((_, i) => {
          ctx.fillStyle = i % 2 ? '#f8f8f8' : '#fff'
          i ? ctx.fillRect(0, 36 * i - 6, cWidth, 36) : ctx.fillRect(0, 30, cWidth, 30)
        })
        ctx.font = '14px PingFangSC-Regular,PingFan'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        const { data } = this.trendData[0]
        const width = cWidth / data.length
        data.forEach((_, i) => {
          ctx.fillStyle = '#C8C8C8'
          ctx.fillRect(width * i, 0, 0.5, cHeight)
          ctx.fillStyle = '#333'
          ctx.fillText(_, width * (i + 0.5) + 0.5, 15)
        })
        const acIndexArr = []
        ctx.fillStyle = '#999'
        this.trendData.forEach((_, i) => i && _.data.forEach((_i, index) => {
          const position = [width * (index + 0.5) + 0.5, 30 + 36 * i - 16]
          _.i === index ? acIndexArr.push([_i, ...position]) : ctx.fillText(_i, ...position)
        }))
        // 画连接线
        ctx.strokeStyle = theme
        ctx.beginPath()
        acIndexArr.forEach((_, i) => ctx[i ? 'lineTo' : 'moveTo'](_[1], _[2] - 1.5))
        ctx.stroke()
        // 画圆和白色文字
        acIndexArr.forEach(_ => {
          ctx.beginPath()
          ctx.fillStyle = theme
          ctx.arc(_[1], _[2] - 1.5, 12, 0, Math.PI * 2, true)
          ctx.fill()
          ctx.fillStyle = '#fff'
          ctx.fillText(..._)
        })
      }
    })
  },
  data() {
    const baseArr = Array(10).fill(1)
    const mkdate = () => {
      let num = 33
      const arr = Array(30).fill(1).map(_ => ({ title: '第' + num-- + '期', data: baseArr.map(_ => Math.floor(Math.random() * 10)), i: Math.floor(Math.random() * 10) }))
      arr.unshift({ title: '期数', data: baseArr.map((_, i) => i) })
      return arr
    }
    return {
      showConfig: 0,
      cfgData: [
        { name: '期数', option: [ '近30期', '近50期', '近100期', '近200期' ], index: 0 },
        { name: '折线', option: [ '显示折线', '隐藏折线' ], index: 0 },
        { name: '遗漏', option: [ '显示遗漏', '隐藏遗漏' ], index: 0 }
      ],
      tabData: ['号码', '万位', '千位', '百位', '十位', '个位'],
      rodioIndex: 1,
      trendData: [{ 'title': '期数', 'data': [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] }, { 'title': '第33期', 'data': [6, 0, 6, 5, 0, 3, 3, 7, 0, 6], 'i': 6 }, { 'title': '第32期', 'data': [4, 2, 7, 9, 7, 7, 7, 6, 0, 2], 'i': 2 }, { 'title': '第31期', 'data': [7, 4, 8, 5, 0, 4, 6, 6, 2, 4], 'i': 0 }, { 'title': '第30期', 'data': [7, 5, 6, 7, 8, 4, 3, 7, 5, 6], 'i': 9 }, { 'title': '第29期', 'data': [5, 5, 2, 9, 7, 9, 4, 5, 7, 1], 'i': 8 }, { 'title': '第28期', 'data': [9, 7, 9, 4, 8, 0, 6, 8, 3, 8], 'i': 0 }, { 'title': '第27期', 'data': [0, 3, 0, 1, 4, 5, 7, 6, 2, 0], 'i': 3 }, { 'title': '第26期', 'data': [5, 4, 3, 6, 4, 9, 1, 4, 3, 3], 'i': 2 }, { 'title': '第25期', 'data': [6, 6, 2, 2, 2, 8, 2, 5, 9, 4], 'i': 6 }, { 'title': '第24期', 'data': [2, 9, 1, 0, 9, 6, 9, 2, 7, 6], 'i': 7 }, { 'title': '第23期', 'data': [6, 3, 6, 6, 2, 7, 8, 1, 8, 9], 'i': 6 }, { 'title': '第22期', 'data': [6, 3, 2, 4, 0, 9, 8, 3, 6, 5], 'i': 4 }, { 'title': '第21期', 'data': [4, 2, 0, 5, 5, 0, 5, 0, 7, 1], 'i': 6 }, { 'title': '第20期', 'data': [2, 1, 8, 5, 4, 6, 6, 7, 3, 8], 'i': 8 }, { 'title': '第19期', 'data': [2, 0, 7, 8, 6, 0, 4, 5, 3, 6], 'i': 6 }, { 'title': '第18期', 'data': [6, 8, 5, 2, 6, 1, 9, 0, 0, 8], 'i': 7 }, { 'title': '第17期', 'data': [9, 0, 3, 4, 5, 5, 0, 8, 9, 0], 'i': 9 }, { 'title': '第16期', 'data': [2, 0, 9, 1, 0, 7, 0, 2, 5, 9], 'i': 6 }, { 'title': '第15期', 'data': [9, 8, 0, 1, 5, 3, 9, 1, 4, 1], 'i': 9 }, { 'title': '第14期', 'data': [2, 5, 7, 4, 5, 5, 5, 8, 3, 2], 'i': 5 }, { 'title': '第13期', 'data': [9, 5, 5, 2, 1, 0, 4, 2, 8, 5], 'i': 5 }, { 'title': '第12期', 'data': [0, 3, 5, 4, 4, 2, 9, 7, 0, 7], 'i': 1 }, { 'title': '第11期', 'data': [7, 1, 6, 3, 7, 8, 3, 5, 4, 7], 'i': 7 }, { 'title': '第10期', 'data': [9, 5, 4, 0, 4, 0, 0, 0, 2, 8], 'i': 1 }, { 'title': '第9期', 'data': [6, 3, 4, 1, 5, 3, 4, 5, 8, 0], 'i': 4 }, { 'title': '第8期', 'data': [0, 1, 4, 0, 6, 3, 6, 3, 6, 5], 'i': 8 }, { 'title': '第7期', 'data': [2, 2, 8, 6, 4, 3, 9, 2, 6, 4], 'i': 5 }, { 'title': '第6期', 'data': [4, 9, 2, 8, 9, 3, 2, 4, 6, 3], 'i': 0 }, { 'title': '第5期', 'data': [9, 8, 4, 3, 1, 8, 7, 8, 3, 8], 'i': 7 }, { 'title': '第4期', 'data': [3, 5, 1, 0, 6, 9, 6, 2, 7, 0], 'i': 6 }],
      size: { cWidth: 0, cHeight: 0 }
    }
  },
  methods: {
    confirm() {
      this.showConfig = 0
      if (this.cfgData.some(({ index }, i) => index !== this.indexs[i])) {
        this.cfgData.forEach(({ index }, i) => (this.indexs[i] = index))
        console.log(this.indexs)
      }
    }
  },
  watch: {
    config(v) {
      this.indexs.forEach((_, i) => (this.cfgData[i].index = _))
      this.showConfig = 1
    },
    cfgData(v) {
      console.log(v)
    }
  },
  created() {
    this.indexs = [ 0, 0, 0 ]
  }
}
</script>
<style lang="stylus" scoped>
  .bet
    .num
      width 76px
      li
        font-size 14px
        height 36px
        line-height 36px
        text-align center
        &:nth-child(even)
          background-color #f8f8f8
        &:first-child
          height 30px
          line-height 30px
          color #999
    >>>.cube-scroll-wrapper
      height calc(100% - 40px)
    >>>.cube-scroll-list-wrapper
      display flex
    .cfg
      position absolute
      top 0
      left 0
      background-color rgba(0, 0, 0, .5)
      width 100%
      height 100%
      z-index 1
    .content
      z-index 2
      width 340px
      height 373px
      left calc(50% - 170px)
      top calc(50% - 186.5px)
      background-color #fff
      border-radius 8px
      .head
        height 57px
        line-height 57px
        color #333
        font-size 18px
        font-weight 500
        text-align center
      .cfgc
        height 224px
        background-color #f5f5f5
        border-radius 4px
        margin 0 15px
        padding-top 12px
        font-size 16px
        color #333
        >div
          position relative
          padding-left 72px
          display flex
          justify-content space-between
          flex-wrap wrap
          p
            width 112px
            height 50px
            line-height 50px
            &:first-child
              position absolute
              left 24px
              color #999
              width 48px
            svg
              margin-right 8px
      .btng
        margin 24px 8px 0
        display flex
        justify-content space-around
        button
          box-sizing border-box
          width 152px
          height 44px
          box-shadow none
          border-radius 22px
          font-size 18px
          font-weight 500
          &.t_b:active
            opacity .8
    .rodio li
      font-size 14px
      color #999
</style>
