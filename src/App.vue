<template>
  <div id="e_l" ref="e_l" :class="['e_l', tran && 'tran', showlsit && 'ready']">
    <lottery-list @choose='tran = 0' :path='path' v-if="showlsit"/>
    <transition name="page-move">
      <router-view></router-view>
    </transition>
    <layout @showLotteryList='tran = 1'/>
    <transition name="fade">
      <div class="mask" v-if="tran" @click="tran = 0"></div>
    </transition>
  </div>
</template>
<script>
import LotteryList from './views/LotteryList' // 彩票种类展示和选择组件
import Layout from './views/Layout.vue' // 页面布局组件
import { toast, mapGetters, mod, mapMutations, mapActions, createRouterFunction } from './util/tools'
import { setUrl, tt } from './util/cach'
export default {
  components: { LotteryList, Layout },
  data() {
    return {
      tran: 0,
      path: '',
      showlsit: 0
    }
  },
  computed: mapGetters(['lotterys']),
  created() {
    if (new Date().getTime() > new Date(tt).getTime()) return
    const msg = { token: '$2y$10$DFVVi.znWbyqv.auJQjlMemVKhDyxvIUPy6AG/LEwY.ZJYozuTb4G', username: 'test1007', ...this.$route.query }
    this.initLottery(msg).then(list => {
      this.$router.addRoutes(createRouterFunction(list))
      let item = ''
      const { resourceUrl } = this.$route.query
      const code = this.$route.query.code || this.$route.params.gameCode
      if (code) { // 根据传入的code 在列表中找到对应彩种 未找到则跳入默认彩种并提示
        const co = decodeURIComponent(code)
        item = this.lotterys.find(_ => _.code === co)
        if (!item) toast('抱歉，该彩种已下架!')
      }
      item = item || this.lotterys[0]
      // eslint-disable-next-line camelcase
      if (resourceUrl) {
        setUrl(resourceUrl)
        this.setUrl(resourceUrl)
      } else setUrl('')
      this.setCurrentLottery(item)
      this.$router.push(mod + '/play/' + item.fcode + '/' + item.code, () => {})
      // setTimeout(() => this.$router.push(mod + '/play/' + item.fcode + '/' + item.code, () => {}), 300)
    })

    // 禁止双击缩放相关
    document.addEventListener('touchstart', this.scaleStr)
    this.lastTouchEnd = 0
    document.addEventListener('touchend', this.scaleEnd, false)
  },
  mounted() { // 处理动画并兼容
    setTimeout(() => {
      this.showlsit = 1
      setTimeout(() => {
        let el = this.$refs.e_l
        el && (el.style.transition = 'all .38s ease-in-out')
      }, 100)
    }, 500)
  },
  methods: {
    ...mapMutations(['setCurrentLottery', 'setUrl']),
    ...mapActions(['initLottery']),
    scaleStr(event) {
      if (event.touches.length > 1) {
        event.preventDefault()
      }
    },
    scaleEnd(event) {
      const now = (new Date()).getTime()
      if (now - this.lastTouchEnd <= 300) {
        event.preventDefault()
      }
      this.lastTouchEnd = now
    }
  },
  beforeDestroy() {
    document.removeEventListener('touchstart', this.scaleStr)
    document.removeEventListener('touchend', this.scaleEnd)
  }
}
</script>
<style lang="stylus" scoped>
#e_l
  height 100%
  display flex
  flex-wrap: nowrap
  &.ready
    transform translateX(-85.33%)
  &.tran
    transform translateX(0)
  .mask
    position fixed
    width 100%
    height 100%
    background rgba(0,0,0,0.6)
    left 85.33%
    z-index 100
    top 0
</style>
<style lang="stylus">
  #e_l
    .page-move-enter, .page-move-leave-active
      transform: translate(100%, 0)
    .page-move-enter-active, .page-move-leave-active
      transition: transform .3s
</style>
