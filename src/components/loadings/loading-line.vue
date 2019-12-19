<!--
 * @Description: loader line
 * @Author: wangyun
 * @Date: 2019-09-03 14:34:37
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-15 11:41:52
 -->
<template>
  <div class="loader">
    <div class="loader-inner line">
      <div
        v-for="index in 9"
        :key="index"
        :style="{animationDelay: index * 0.15 + 's', backgroundColor: theme}"
      ></div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'loading-line',
  props: {
    background: {
      type: String,
      default: '#000'
    }
  },
  data() {
    return {
      // styleObject: {
      //   animationDelay: index * 0.1 + 's',
      //   backgroundColor: theme
      // },
      theme: this.background
    }
  }
}
</script>
<style lang="scss" scoped>
.loader {
  height: 100px;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  flex: 0 1 auto;
  flex-direction: column;
  flex-grow: 1;
  flex-shrink: 0;
  flex-basis: 25%;
  max-width: 25%;
  align-items: center;
  justify-content: center;
  &-inner {
    position: relative;
  }
  .line div {
    width: 8px;
    height: 50px;
    margin-right: 5px;
    -webkit-animation: animate 1s infinite;
    animation: animate 0.8s infinite;
    float: left;
  }
  @keyframes animate {
    50% {
      -webkit-transform: scaleY(0);
      transform: scaleY(0);
    }
  }
}
</style>