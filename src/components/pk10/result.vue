<template>
  <div class="result">
   <p>{{openInfo.lotteryNum}}期</p>
    <ul class="ball" v-if="gameResult">
      <li v-for="(it, i) in gameResult" :key="i" :class="'_pk' + it">{{it}}</li>
    </ul>
    <p v-else>{{'正在开奖……'}}</p>
    <ul class="attach" v-if="openInfo.resultProperty">
      <li v-for="(it, i) in openInfo.resultProperty.split(',')" :key="i">{{it}}</li>
    </ul>
  </div>
</template>
<script>
import { resultMixin } from '../mixin'
import { mapState } from '../../util/tools'
export default {
  mixins: [resultMixin],
  computed: {
    ...mapState(['currentLottery', 'status']),
    gameResult() {
      return this.openInfo.result && this.openInfo.result.split(',').map(_ => _ < 10 ? +_ : _)
    }
  }
}
</script>
