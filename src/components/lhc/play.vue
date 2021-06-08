<template>
  <div class="display" id="xgc">
    <cube-scroll v-if='rD.rodio' :data="rD.rodio" class="rodio" direction="horizontal" ref='rodio'>
      <ul>
        <li v-for="(it, i) in rD.rodio" :class="{t_bc: rodioIndex === i}" @click="rodioIndex = i" :key=i>{{it.name}}</li>
      </ul>
    </cube-scroll>
    <cube-scroll class="main_play" :options="options" ref=mainPlay :class="[change && 'change']">
      <p v-if="rD.odds" class="odds t_bc"> 赔率：{{rD.rodio ? rD.rodio[rodioIndex].odds : rD.odds}}</p>
      <div class="aid" v-if="rD.aid || (rD.rodio && rD.rodio[rodioIndex].aid)">
        <p v-for="(it, i) in rD.aid || (rD.rodio && rD.rodio[rodioIndex].aid)" :key="i" :class="i === aidIndex ? 't_b': 't_bd'" @click="handleAid(i, it)">{{it.title}}</p>
      </div>
      <div class="aid" v-if="rD.bet && !(play==='tpz' && rodioIndex === 0)">
        <p v-for="(it, i) in rD.bet" :key="i" :class="i === betIndex ? 't_b': 't_bd'" @click="betIndex = i">{{it}}</p>
      </div>
      <ul v-if='rD.ball || (rD.balls && rD.balls[rodioIndex])' :class="['ball', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.ball || (rD.balls && rD.balls[rodioIndex])" @click="handleChose(it)" :key=i :class="[it.choose && 'chosen', it.lock && 'lock', getColor(it.name), +it.isopen||'ntp']">
          <p>{{it.name}}</p>
          <i>{{it.odds}}</i>
        </li>
      </ul>
      <ul v-if='rD.square || (rD.squares && rD.squares[rodioIndex])' :class="['square', rD.odds && 'hasOdd']">
        <li v-for="(it, i) in rD.square || (rD.squares && rD.squares[rodioIndex])" @click="handleChose(it)" :key=i :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.sort || (rD.sorts && rD.sorts[rodioIndex]) || []" :key="i" :class="{square: item.square, ball: item.ball, _first: i===0}">
        <div class="sprt_title"><span></span>{{item.title}}</div>
        <li v-for="(it, i) in item.square || item.ball" @click="handleChose(it, item.square)" :key=i :class="{t_b: change && it.choose, ntp:!+it.isopen}">
          <p :class="it.choose && !change ? 't_b': 't_bd'">{{it.name}}</p>
          <i :class="[it.choose ? 't_bc' : '', !change && 't_bd']">{{it.odds}}</i>
        </li>
      </ul>
      <ul v-for="(item, i) in rD.group || (rD.groups && rD.groups[rodioIndex]) || []" :key="i" :class="['group', item.lock && 'lock', item.choose && 'chosen', item.numbers.length > 5 && 'many', +item.isopen||'ntp']" @click="handleChose(item)" >
        <icon href='select'/>
        <div class="group_title">{{item.name + ' ' + item.odds}}</div>
        <li v-for="(it, i) in item.numbers" :key=i :class="[item.choose && 'chosen', getColor(it)]">
          <p :class="[item.choose && 't_b']">{{it}}</p>
        </li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { getColor, toast, mapState, mapMutations } from '../../util/tools'
import { filter, hndleData, handleZx } from './util'
export default {
  data() {
    window.__this1 = this
    return {
      options: { scrollbar: true },
      hleper: 1 + Math.random(),
      rodioIndex: 0,
      aidIndex: -1,
      betIndex: 0
    }
  },
  watch: {
    lotteryData() {
      this.rodioIndex = 0
      this.storeData = false
      this.init()
    },
    play() {
      this.rodioIndex = 0
      this.init()
    },
    rodioIndex() {
      this.init()
    },
    betIndex() {
      this.storeRD = false
      this.hleper = Math.random() + 1
      this.setBetData([])
    },
    change() {
      const { checkbox, rodio, mainPlay } = this.$refs
      checkbox && checkbox.refresh()
      rodio && rodio.refresh()
      mainPlay && mainPlay.refresh()
    },
    isReset(v) {
      if (v) {
        this.storeRD = false
        this.hleper = Math.random() + 1
        this.setBetData([])
        this.setIsReset(0)
      }
    },
    rmk: {
      handler(v) {
        this.setRemark(v)
      },
      immediate: true
    }
  },
  props: {
    play: String,
    change: Number
  },
  computed: {
    ...mapState(['lotteryData', 'isReset', 'currentLottery']),
    rD() {
      const agr = (this.rodioIndex + this.hleper) && this.play && this.lotteryData && this.currentLottery.lcode === 'lhc'
      let result = {}
      if (agr) {
        try {
          result = this.storeRD || hndleData(this, this.storeData || filter(this.lotteryData), this.play)
        } catch (e) {
          setTimeout(() => (this.hleper = Math.random() + 1), 500)
        }
      }
      return result
    },
    rmk() {
      const { remark, remarks } = this.rD
      return remark || (remarks && remarks[this.rodioIndex])
    }
  },
  mounted() {
    // alert(navigator.userAgent.toLowerCase().includes('version/10'))
    document.querySelector('.display').style.height = document.querySelector('.play_area').offsetHeight - 10 + 'px'
  },
  methods: {
    ...mapMutations(['setBetData', 'setIsReset', 'setRemark']),
    init() {
      this.storeRD = false
      this.aidIndex = -1
      this.betIndex = 0
      this.setBetData([])
    },
    handleChose(it, item) {
      if (!+it.isopen) return toast('抱歉，该玩法暂停销售', false)
      if (it.lock) return
      let choose = !it.choose
      if (this.play === 'gg') item.forEach(_ => (_.choose = false))
      it.choose = choose
      const IctIndex = ({ lx: this.rodioIndex + 2, bz: this.rodioIndex + 8, lm: 10, dxzy: this.rodioIndex + 8, tpz: [ 0, 13, 10, 9, 9 ][this.rodioIndex] })[this.play]
      if (IctIndex && !this.betIndex) {
        if (this.rD.data.filter(_ => _.choose).length > IctIndex) {
          it.choose = !it.choose
          return toast('选择不能多于' + IctIndex + '个!', false)
        }
      } else if (this.betIndex && this.handleLock()) it.lock = 1
      this.hleper = Math.random() + 1
      this.setBetData(this.CalcLen(this.rD.data.filter(_ => _.choose)))
    },
    CalcLen(Chosedata) {
      let finalData = []
      switch (true) {
        case this.play === 'lm': handleZx(Chosedata, this.rodioIndex > 1 ? 2 : 3, finalData); break
        case this.play === 'bz': handleZx(Chosedata, this.rodioIndex + 5, finalData); break
        case [2, 3, 4].includes(this.rodioIndex) && this.play === 'sx': handleZx(Chosedata, this.rodioIndex, finalData); break
        case [1, 2, 3].includes(this.rodioIndex) && this.play === 'ws': handleZx(Chosedata, this.rodioIndex + 1, finalData); break
        default: finalData = Chosedata.map(_ => ({ ..._, zhushu: 1, number: _.num || _.name })); break
      }
      return finalData
    },
    handleLock() {
      const lockDa = this.rD.data.filter(_ => _.lock)
      switch (this.play) {
        case 'sxl':return this.rodioIndex < 4 ? lockDa.length < this.rodioIndex + 1 : lockDa.length < this.rodioIndex - 3
        case 'wsl':return this.rodioIndex < 3 ? lockDa.length < this.rodioIndex + 1 : lockDa.length < this.rodioIndex - 2
        case 'bz':return lockDa.length < this.rodioIndex + 4
        case 'dxzy':return lockDa.length < this.rodioIndex + 4
        case 'tpz':return lockDa.length < this.rodioIndex
        default: return false
      }
    },
    handleGg(Chosedata, finalData) {
      if (Chosedata.length < 2) {
        finalData.err = '选择不能少于2个'
      } else {
        let finalItem = { ...Chosedata[0] }
        Chosedata.reduce((_, c, i) => {
          if (i) {
            _.name += ',' + c.name
            _.odds *= c.odds
            _.playCode += '@' + c.playCode
          }
          return _
        }, finalItem)
        finalItem.odds = finalItem.odds.toFixed(3)
        finalData.push(finalItem)
      }
    },
    handleAid(i, it) {
      this.aidIndex = i
      switch (it.type) {
        case 'num':
          switch (i) {
            case 0: this.rD.data.forEach(_ => (_.choose = _.playCode.slice(-1) % 2)); break
            case 1: this.rD.data.forEach(_ => (_.choose = _.playCode.slice(-1) % 2 === 0)); break
            case 2: this.rD.data.forEach(_ => (_.choose = _.playCode.slice(-1) > 4)); break
            case 3: this.rD.data.forEach(_ => (_.choose = _.playCode.slice(-1) < 5)); break
          }
          break
        default: this.rD.data.forEach(_ => (_.choose = (i ? _.beast : !_.beast))); break
      }
      this.hleper = Math.random() + 1
      this.setBetData(this.CalcLen(this.rD.data.filter(_ => _.choose)))
    },
    getColor(n) {
      return getColor('xgc', +n)
    }
  }
}
</script>
<style lang="stylus" scoped>
  #xgc.display .main_play
    .group
      margin-top -1px
      padding 8px 0 6px
      position relative
      justify-content space-around
      &.many
        justify-content flex-start
        padding-left 6px
      &:first-child
        margin-top 0
      &.chosen
        box-shadow 0 0 0 1px #54B1FF inset
        color #54B1FF
        .l_icon
          display block
      &.lock
        background-color #eee
      .group_title
        line-height 22px
        width 100%
        font-size 16px
      .l_icon
        width 20px
        height 20px
        position absolute
        top 0
        right 0
        display none
      li
        height 48px
        width 48px
        margin 6px 4px
    .aid
      display flex
      box-sizing border-box
      padding 4px 12px 8px
      flex-wrap wrap
      justify-content space-between
      p
        box-sizing border-box
        margin-top 8px
        width 132px
        height 36px
        border-radius 2px
        font-size 16px
        line-height 36px
        text-align center
  .red_b > *
    border 1px solid #FF3A39
    color  #FF3A39
  .blue_b > *
    border 1px solid #54B1FF
    color  #54B1FF
  .green_b > *
    border 1px solid #0EBF29
    color  #0EBF29
  .change .chosen
    p
      background-color #fff
    i
      color #fff
    &.red_b
      background-color #FF3A39
    &.blue_b
      background-color #54B1FF
    &.green_b
      background-color #0EBF29
  .group
    li
      background-color transparent!important
    p
      font-size 24px
      height 48px
      width 48px
      border-radius 50%
      line-height 48px
  div:not(.change).main_play .chosen, .group .chosen
    &.red_b
      i
        color #FF3A39!important
      p
        background-color #FF3A39
    &.blue_b
      i
        color #54B1FF!important
      p
        background-color #54B1FF
    &.green_b
      i
        color #0EBF29!important
      p
        background-color #0EBF29
    & p
      color #fff
  .lock>p
    background-color #bbb!important
    border-color #bbb!important
  .change .lock
    >p
      background-color #f5f5f5!important
  .switch .display .square i
    min-width 55px
</style>
