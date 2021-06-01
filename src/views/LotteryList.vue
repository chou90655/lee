<template>
  <div class="drawer">
    <header class="t_b"><span v-show="url" class="f_m" @click="back"><icon href='fanhuishouye'/>返回</span></header>
    <div class="content">
      <cube-scroll :data="gameList" :options="options" class="mainkind">
        <ul>
          <li v-for="(it, i) in gameList" :class="{t_a: active === i}" @click="active = i" :key=i>{{it.label}}</li>
        </ul>
      </cube-scroll>
      <cube-scroll v-if="gameList[active] && gameList[active].children" :data="gameList[active].children" :options="options" class="kind">
        <ul>
          <li v-for="(item, i) in gameList[active].children" :class="{active: item.chosen}" @click="choose(item)" :key=i>
            <i class="lty_icon" :style="{background: 'url('+item.url +')'}"></i><span>{{item.title}}<icon href='in'/></span>
          </li>
        </ul>
      </cube-scroll>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations, mod, mapGetters } from '../util/tools'
import { getUrl } from '../util/cach'

export default {
  data() {
    return {
      options: { scrollbar: true },
      active: 0
    }
  },
  props: {
    path: String // 进入彩票之前的地址
  },
  computed: {
    ...mapState(['lotteryList', 'url']),
    ...mapGetters(['lotterys']),
    gameList() { // 组合彩种列表和热门
      // return [{ children: this.lotterys.filter(_ => _.hot), label: '热门' }, ...this.lotteryList]
      return [...this.lotteryList]
    }
  },
  watch: {
    $route(v) { // 监听路由变化并设置当前彩种
      const item = this.lotterys.find(_ => _.code === v.params.gameCode)
      item && this.setCurrentLottery(item)
    }
  },
  methods: {
    ...mapMutations(['setCurrentLottery']),
    choose(item) { // 处理彩种选择函数
      this.$router.push(`${mod}/play/${item.fcode}/${item.code}`, () => {})
      this.$emit('choose')
    },
    back() {
      const resourceUrl = getUrl()
      if (resourceUrl) location.href = resourceUrl.indexOf('http') === -1 ? ('https://' + resourceUrl) : resourceUrl
    }
  }
}
</script>

<style lang="stylus" scoped>
  .drawer
    flex-shrink 0
    width 85.33%
    header
      height 50px
      line-height 50px
      font-size 16px
      .l_icon
        font-size 18px
        padding 0 10px 0 18px
    .content
      display flex
      background-color #eee
      height calc(100% - 50px)
      font-size 16px
    .mainkind
      width 100px
      background-color #f8f8f8
      li
        height  50px
        line-height 50px
        text-align center
        color #999999
    .kind
      background-color #fff
      width calc(100% - 100px)
      li
        color #333
        height 60px
        line-height 60px
        text-align left
        display flex
        align-items center
        &:last-of-type span:after
          content ''
          position absolute
          width 100%
          height 1px
          background-color #e6e6e6
          bottom 1px
          left 0
        .lty_icon
          width 30px
          height 30px
          background-size cover!important
          margin 0 12px
        span
          flex-grow 1
          max-height 60px
          border-top 1px solid #E6E6E6
          position relative
          .l_icon
            float right
            margin-right 17px
            color #C8C8C8
            height 60px

</style>
