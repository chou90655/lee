
import { mapState, mapMutations } from '../util/tools'
export const resultMixin = {
  computed: { ...mapState(['openInfo']) }
}
export const mixin = {
  data() {
    window.__this1 = this
    return {
      options: { scrollbar: true },
      hleper: 1 + Math.random(),
      rodioIndex: 0
    }
  },
  watch: {
    lotteryData() {
      this.storeRD = false
      this.storeData = false
      this.rodioIndex = 0
      this.setBetData([])
    },
    play() {
      this.storeRD = false
      this.rodioIndex = 0
      this.setBetData([])
    },
    rodioIndex() {
      this.storeRD = false
      this.setBetData([])
    },
    change() {
      const { checkbox, rodio, mainPlay } = this.$refs
      checkbox && checkbox.refresh()
      rodio && rodio.refresh()
      mainPlay && mainPlay.refresh()
    },
    rmk: {
      handler(v) {
        this.setRemark(v)
      },
      immediate: true
    },
    isReset(v) {
      if (v) {
        this.storeRD = false
        this.hleper = Math.random() + 1
        this.setBetData([])
        this.setIsReset(0)
      }
    }
  },
  props: {
    play: String,
    change: Number
  },
  mounted() {
    // alert(navigator.userAgent.toLowerCase().includes('version/10'))
    document.querySelector('.display').style.height = document.querySelector('.play_area').offsetHeight - 10 + 'px'
  },
  computed: {
    ...mapState(['lotteryData', 'isReset', 'currentLottery']),
    rightData() {
      return this.currentLottery.fcode === this.$route.path.split('/')[3]
    },
    rmk() {
      const { remark, remarks } = this.rD
      return remark || (remarks && remarks[this.rodioIndex])
    }
  },
  methods: mapMutations(['setBetData', 'setIsReset', 'setRemark'])
}
