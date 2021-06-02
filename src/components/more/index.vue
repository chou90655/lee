<template>
  <div class="more">
    <heade :title='title' @config="config++" />
  </div>
</template>
<script>
import moreRouter from '../../data/moreRoutes'
export default {
  data: () => ({ config: 0 }),
  computed: {
    title() {
      const pathArr = this.$route.path.split('/')
      let item = moreRouter.find(_ => _.to === pathArr[3])
      if (pathArr[4]) item = item.children.find(_ => _.to === pathArr[4])
      return item.title
    }
  }
}
</script>
<style lang="stylus" scoped>
  .more
    flex-shrink 0
    background-color #fff
    width 100%
    z-index: 10100
    position absolute
    right -85.33%
    height 100%
    .more_view
      height calc(100% - 48px)
    ._head
      height 48px!important
      line-height 48px!important
</style>
<style lang="stylus">
  .more_view
    .list
      height calc(100% - 40px)
    .cube-scroll-list-wrapper>ul:not(.cont)
      border-top 1px solid #E6E6E6
      >li
        text-align center
        height 44px
        line-height 44px
        font-size 14px
        display flex
        color #333
        p
          font-weight 500
        >span
          flex-grow 1
        &:first-child
          line-height 55px
          height 49px
          p
            font-weight 400
            color #999!important
        &:nth-child(even)
          background-color #F5F5F5
    .info
      box-sizing border-box
      box-shadow 0 -1px 0 #e6e6e6
      height 40px
      line-height 40px
      font-size 14px
      color #999
      i
        font-size 18px
        color #FF3A39
  ._pulling
    .cube-pulldown-loaded
      font-size 16px
    .cube-pullup-wrapper
      font-size 16px
      .before-trigger,.after-trigger
        padding 12px
</style>
