<template>
  <div class="single">
    <textarea @touchstart.stop="show=true" v-model="ctt" placeholder="223232"></textarea>
    <div class="btns"><p class="t_b" v-for="(_,i) in ['删除错误项','格式校验','清空文本框']" :key="i" @click="hdclik(i)">{{_}}</p></div>
    <!-- <van-number-keyboard theme='custom' :show="show" get-container="#e_l" :extra-key="['粘贴','空格']" close-button-text="完成" @blur="show=false" @input="onInput" @delete="onDelete"/> -->
  </div>
</template>
<script>
import { toast } from '../util/tools'
export default {
  data() {
    return {
      show: false,
      ctt: '',
      past: ''
    }
  },
  created() {
    window.__this = this
  },
  computed: {
  },
  methods: {
    hdclik(i) {
      console.log(i)
    },
    onDelete(i) {
      console.log(i)
    },
    async onInput(i) {
      if (i === '粘贴') {
        try {
          const text = await navigator.clipboard.readText()
          toast('' + text)
        } catch {
          toast('失败')
        }
      }
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
    color: #333;
    line-height: 20px;
  }
}
</style>
