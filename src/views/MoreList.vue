<template>
  <div :class="['more', showTheme && 'fade']">
    <div class="user t_b">
      <div class="ava" @click="!token && $router.push('/login', () => {})"></div>
      <div class="info">
        <p class="name">{{userInfo.username}}</p>
        <p v-if="token">余额：{{userInfo.memberBal || '0.00'}}元</p>
        <p v-if="!token" class="log" @click="!token && $router.push('/login', () => {})">登陆</p>
      </div>
    </div>
    <ul class="route">
      <li v-for="(it,i) in routers" :key="i" @click='click(it)' class="af">
        <p class="title">
          <icon :href = "it.icon"/>
          <span>{{it.title}}</span>
        </p>
        <p class="atch">
          <span :class="{ los: (it.amount || '').includes('-')}">{{it.amount}}</span>
          <icon href='in'/>
        </p>
      </li>
    </ul>
    <transition name="slide">
      <ul class="theme" v-if="showTheme">
        <li class="t_b"><icon class="back" href='back' @click.native="showTheme = 0" />{{routers.slice(-1)[0].title}}</li>
        <li v-for="(it, i) in themes" :key="i" class="af" @click="choseTheme(it)">
          <i :style="{background: '#' + it.color}"></i>
          <p>{{it.name}}</p>
          <icon :href="it.inuse"/>
        </li>
      </ul>
    </transition>
  </div>
</template>
<script>
import routers from '../data/moreRoutes'
import { mapState, mod, toast } from '../util/tools'
import { setTheme, getTheme, getToken } from '../util/cach'
import { getBetReport } from '../api/interface'
export default {
  data() {
    return {
      routers: [...routers, { icon: 'pifu', title: '一键换肤' }],
      showTheme: 0,
      token: getToken(),
      themes: [
        { color: 'c80d0d', name: '古典红', inuse: 'uncheck_normal' },
        { color: '3c3c3c', name: '魅力黑', inuse: 'uncheck_normal' },
        { color: '54b1ff', name: '冰川蓝', inuse: 'uncheck_normal' },
        { color: '9127e9', name: '高贵紫', inuse: 'uncheck_normal' },
        { color: 'ffb32c', name: '帝王黄', inuse: 'uncheck_normal' },
        { color: 'f41f1e', name: '激情红', inuse: 'uncheck_normal' },
        { color: 'fad066', name: '土豪金', inuse: 'uncheck_normal' }
      ]
    }
  },
  computed: mapState(['userInfo', 'currentLottery']),
  created() {
    (this.themes.find(_ => _.color === getTheme())).inuse = 'check_bule' // 设置主题选择状态
    const jrsy = this.routers.find(_ => _.icon === 'jinrishuying')
    const jszd = this.routers.find(_ => _.icon === 'jishizhudan')
    this.token && getBetReport().then(res => { // 查询并设置及时注单和今日输赢金额
      if (res) {
        jrsy.amount = '￥' + res.winLosAmount.toFixed(2)
        jszd.amount = '￥' + res.currentAmount.toFixed(2)
      }
    })
  },
  methods: {
    choseTheme(item) {
      this.themes.forEach(_ => (_.inuse = 'uncheck_normal'))
      item.inuse = 'check_bule'
      document.body.className = document.body.className.replace(/theme-[^\s]+/, 'theme-color' + item.color)
      setTheme(item.color)
      this.$emit('chooseTheme')
    },
    click({ to, icon, needLogin, state }) { // 处理点击列表方法
      if (needLogin) {
        if (getToken()) {
          if (state !== undefined) this.$router.push(mod + '/more/betHistory?state=' + state, () => {})
          else this.$router.push(mod + '/more/' + to, () => {})
        } else {
          toast('请登陆！')
        }
      } else if (icon === 'pifu') this.showTheme = 1
      else if (icon === 'jinrishuying') this.$emit('chooseTheme')
      else this.$router.push(mod + '/more/' + to, () => {})
    }
  }
}
</script>
<style lang="stylus" scoped>
  .more
    position absolute
    top 0
    right 0
    z-index 10013
    width 74.7%
    height 100%
    background-color #fff
    overflow hidden
    .user
      right: 0
      transition right .5s
      position relative
      padding-left 16px
      height 80px
      display flex
      align-items center
      .ava
        height 40px
        width 40px
        background-image url('../assets/images/avatar/ava.png')
        background-size cover
        border-radius 50%
      .info
        height 45px
        width 120px
        margin-left 12px
        font-size 12px
        line-height 20px
        .name
          font-size 18px
          line-height 25px
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        .log
          height 45px
          line-height 45px
          font-size 18px
    .route
      right: 0
      transition right .5s
      position relative
      padding 0 12px 0 18px
      li
        height 50px
        line-height 50px
        display flex
        font-size 16px
        justify-content space-between
        position relative
        &:after
          left 30px
      .title
        display flex
        align-items center
        svg
          font-size 20px
        span
          margin-left 10px
      .atch span
        color #FF3A39
        &.los
          color #bc8b63
  .fade
    .route,.user
      right 100%
  .theme
    position absolute
    width 100%
    height 100%
    top 0
    right 0
    background-color #fff
    li
      padding 0 16px
      height 50px
      font-size 18px
      line-height 50px
      display flex
      justify-content space-between
      align-items center
      position relative
      &.t_b
        justify-content flex-start
        padding-left 1px
        .back
          padding 10px 3px 10px 9px
      &:after
        left 40px
      i
        width 22px
        height 22px
        border-radius 4px
      svg
        font-size 20px
      p
        flex-grow 1
        text-align left
        padding-left 12px
  .af:after
    content ''
    position absolute
    height 1px
    width 100%
    background-color #e6e6e6
    bottom 0
</style>
