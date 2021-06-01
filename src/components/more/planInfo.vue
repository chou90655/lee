<template>
  <div class="wol">
    <cube-scroll :options="options" :data="result" ref="list" class="list _pulling"  @pulling-down="onPullingDown" @pulling-up="onPullingUp">
      <ul>
        <li v-for="(it, i) in result" :key="i">
          <p>{{it.typeName}}</p>
          <p>{{it.minBetLimit || 1}}</p>
          <p>{{it.betLimit}}</p>
          <p>{{it.playLimit}}</p>
        </li>
        <li v-if='result.length < 2'><span>暂无数据</span></li>
      </ul>
    </cube-scroll>
  </div>
</template>
<script>
import { limitList } from '../../api/interface'
import { mapState } from '../../util/tools'
const result = [{ betLimit: '单注最高', playLimit: '单项最高', typeName: '类型', minBetLimit: '单注最低' }]
export default {
  data() {
    return {
      result,
      total: {},
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
      }
    }
  },
  created() {
    this.onPullingDown()
  },
  computed: {
    ...mapState(['currentLottery'])
  },
  methods: {
    onPullingDown() {
      this.pageNum = 1
      this.getData()
    },
    onPullingUp() {
      this.pageNum++
      this.getData()
    },
    getData() {
      limitList({ pageSize: 30, pageNumber: this.pageNum, lotteryCode: this.currentLottery.code }).then(res => {
        if (this.pageNum === 1) this.result = [...result]
        if (res.list.length) this.result.push(...res.list)
        else this.$refs.list.forceUpdate()
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
  .wol
    .list
      height 100%
      p
        width (100% / 4)
        &:first-child
          width 32%
          overflow hidden
          text-overflow ellipsis
          white-space nowrap
        &:nth-child(2)
          width 18%
    .info
      display flex
      justify-content space-between
      padding 0 12px
      i
        padding 0 5px
</style>
