<template>
  <div class="single">
    <textarea @touchstart.stop="show=true" v-model="ctt" placeholder="每注号码以空格进行分割" @input="hdipt"></textarea>
    <div class="btns"><p class="t_b" v-for="(_,i) in ['删除错误项','格式校验','清空文本框']" :key="i" @click="hdclik(i)">{{_}}</p></div>
  </div>
</template>
<script>
import { toast } from '../util/tools'
export default {
  props: { hasz: Boolean, data: Object },
  data() {
    return { ctt: '' }
  },
  created() {
    this.abd = []
    this.avid = []
    window.__this = this
  },
  watch: {
    ctt() {
      this.$emit('data', this.avid)
    },
    data() {
      this.abd = []
      this.avid = []
      this.ctt = ''
    }
  },
  methods: {
    hdclik(i) {
      switch (i) {
        case 0:
          if (this.ctt) {
            if (this.abd.length) {
              toast('已删除不正确的内容：' + this.abd.join(), false)
              this.ctt = this.avid.join(' ')
              this.abd = []
            } else toast('没有错误项', false)
          } else toast('请输入内容', false)
          break
        case 1:
          if (this.ctt) {
            if (this.abd.length) toast('以下投注格式不正确：' + this.abd.join(), false)
            else toast('全部投注格式正确', false)
          } else toast('请输入内容', false)
          break
        case 2: this.ctt = ''; this.abd = []; this.avid = []; break
      }
    },
    hdipt(e) {
      const v = e.target.value
      if (v) {
        const ctt = v.replace(/[^0-9\s]*/g, '')
        this.ctt = ctt.replace(/\s{2,}/g, ' ').replace(/^\s*/, '')
        e.target.value = this.ctt
        this.ctt && this.hdsplt(this.ctt, this.data.l)
      }
    },
    hdsplt(val, lt = 5) {
      const spt = val.split(' ')
      this.abd = []
      this.avid = []
      spt.forEach(_ => {
        if (this.hasz) {

        } else this[_.length === lt ? 'avid' : 'abd'].push(_)
      })
    }
  }
}
</script>
<style lang="less" scoped>
.van-number-keyboard {
  left: 320px;
  padding-bottom: 8px;
}
.single {
  font-size: 14px;
  width: 100%;
  padding: 5px;
  box-sizing: border-box;
  .btns {
    display: flex;
    font-size: 14px;
    line-height: 32px;
    justify-content: space-between;
    margin-top: 6px;
    p {
      padding: 0 8px;
      border-radius: 3px;
    }
  }
  textarea {
    height: 270px;
    width: 100%;
    border-color: #ddd;
    border-radius: 2px;
    box-sizing: border-box;
    resize:none;
    padding: 5px;
    color: #333;
    line-height: 20px;
    font-size: 14px;
  }
}
</style>
