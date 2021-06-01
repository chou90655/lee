<template>
  <div :class="['play_area', change && 'switch']">
    <cube-scroll :data="plays" :options="{ scrollbar: true }" class="class" ref='scroll'>
      <ul>
        <li v-for="(it, i) in plays" :class="{t_a: active === it.value}" @click="active = it.value" :key=i>{{it.label}}</li>
      </ul>
    </cube-scroll>
    <router-view class="cube-view" name="play" :play='active' :change='change' ref="plays"></router-view>
  </div>
</template>
<script>
export default {
  data() {
    return {
      active: this.plays[0].value
    }
  },
  props: {
    plays: Array,
    change: Number
  },
  watch: {
    plays() {
      this.active = this.plays[0].value
    }
  },
  mounted() {
    window.addEventListener('orientationchange', this.fitHeiht)
  },
  beforeDestroy() {
    window.removeEventListener('orientationchange', this.fitHeiht)
  },
  methods: {
    fitHeiht() {
      setTimeout(() => {
        document.querySelector('.display').style.height = document.querySelector('.play_area').offsetHeight - 10 + 'px'
        const { checkbox, rodio, mainPlay } = this.$refs.plays.$refs
        checkbox && checkbox.refresh()
        rodio && rodio.refresh()
        mainPlay && mainPlay.refresh()
      }, 100)
    }
  }
}
</script>
<style lang="stylus" scoped>
  .play_area
    height calc(100% - 262px)
    background #f0f0f0
    padding-top 10px
    display flex
    color #999
    position relative
    box-sizing content-box
    .class
      height 100%
      width 80px
      background-color #f8f8f8
      border-right 1px solid #f2f2f2
      box-sizing border-box
      li
        line-height 48px
        font-size 16px
        text-align center
        &.t_a
          font-size 18px
</style>
<style lang="stylus">
  [class^="_t"]
    background-size cover
    text-indent -9999px
    border-radius 0px!important
  ._t1
    background-image url('../assets/images/k3/t1.png')!important
  ._t2
    background-image url('../assets/images/k3/t2.png')!important
  ._t3
    background-image url('../assets/images/k3/t3.png')!important
  ._t4
    background-image url('../assets/images/k3/t4.png')!important
  ._t5
    background-image url('../assets/images/k3/t5.png')!important
  ._t6
    background-image url('../assets/images/k3/t6.png')!important
  .rodio, .checkbox
    .cube-scroll-content
      display: inline-block
  .play_area .display
    height 100%
    background-color #fff
    width calc(100% - 80px)
    display flex
    flex-direction column
    .sprt_title
      width 100%
      height 36px
      line-height 36px
      color #999!important
      font-size 16px
      box-sizing border-box
      margin-bottom 8px
      border-top 1px solid #f2f2f2
      border-bottom 1px solid #f2f2f2
      text-align left
      padding-left 14px
      position relative
      span
        position absolute
        width 3px
        height 3px
        border-radius 50%
        background-color #999
        top calc(50% - 1.5px)
        left 8px
    ._first
      padding-top 0!important
    .checkbox
      flex-shrink 0
      height 48px
      box-shadow:0px 1px 1px 0px rgba(0,0,0,0.06);
      ul
        font-size 14px
        padding 0 8px
        white-space nowrap
        li
          display inline-block
          box-sizing border-box
          width 54px
          height 32px
          line-height 32px
          text-align center
          border-radius 16px
          border 1px solid #c8c8c8
          margin 8px 3px
          vertical-align middle

    .main_play
      padding-bottom 10px
      .odds
        font-size 16px
        font-weight 600
        text-align center
        margin-top 10px
        line-height 22px
      .hasOdd
        li
          height 48px!important
        i
          display none
      ul
        display flex
        flex-wrap wrap
        justify-content center
        text-align center
        &:last-of-type
          padding-bottom 6px
        p,i
          box-sizing border-box
  div:not(.switch).play_area .display .main_play
    ul
      padding-top 6px
    li
      height 60px
      width 48px
      margin 6px 12px
      position relative
    i
      position absolute
      bottom 0
      left 0
      font-size 12px
      line-height 17px
      height 18px
      width 100%
      background-color #fff
      border-radius 9px
      color #999
    p:not(.odds)
      font-size 24px
      height 48px
      border-radius 50%
      line-height 48px
    .square
      li
        height 48px
        width 62px
        margin 4px 4px
        border-radius 2px
      p
        font-size 15px
        height 30px
        line-height 31px
        white-space nowrap
        color #333
        font-weight 600
        border-radius 2px 2px 0 0
        border-bottom none
      i
        border-radius 0 0 2px 2px
  .switch .display
    .rodio li
      width 147px
    .main_play
      .sprt_title
        margin-bottom 0
        border-top none
      .odds
        border-bottom 1px solid #f2f2f2
      ul
        justify-content flex-start
        &+ul:not(.group)
          border-top 1px solid #f2f2f2
          margin-top -1px
      ul:not(.group) li
        width 50%
        display flex
        font-size 18px
        height 48px
        justify-content center
        align-items center
        box-sizing border-box
        border-bottom 1px solid #f2f2f2!important
        &:nth-of-type(2n + 1)
          border-right 1px solid #f2f2f2!important
        &.t_b
          i
            color #fff!important
      li p
        margin-right 10px
      .ball p
        width 34px
        height 34px
        line-height 34px
        border-radius 50%
        background-color #fff
      .square
        li.t_b p
          color #fff!important
        p
          border none
          background-color transparent
          font-weight 500
      i
        font-size 18px
        border none
        color #C8C8C8
        min-width 36px
</style>
