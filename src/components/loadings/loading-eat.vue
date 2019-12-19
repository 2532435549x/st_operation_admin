<!--
 * @Description: loader eat
 * @Author: wangyun
 * @Date: 2019-09-03 14:00:46
 * @LastEditors: wangyun
 borderTop: 25px solid theme,
    borderLeft: 25px solid theme,
    borderBottom: 25px solid theme}
 * @LastEditTime: 2019-11-14 17:12:08
 -->
<template>
  <div class="loader">
    <div class="loader-inner eat">
      <div :style="{borderTopColor: theme, borderLeftColor: theme, borderBottomColor: theme}"></div>
      <div v-for="index in 4" :key="index" :style="{backgroundColor: theme}"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    background: {
      type: String,
      default: '#000'
    }
  },
  data() {
    return {
      theme: this.background
    }
  }
}
</script>
<style lang="scss" scoped>
$-black: rgba(0, 0, 0, 1);
$-white: rgba(255, 255, 255, 1);

%divBox {
  position: absolute;
  background-color: $-black;
  width: 15px;
  height: 15px;
  border-radius: 100%;
  margin: 2px;
  -webkit-transform: translate(0, -6.25px);
  -ms-transform: translate(0, -6.25px);
  transform: translate(0, -6.25px);
  top: 25px;
  left: 100px;
}

.loader {
  height: 200px;
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
  .eat > div:first-of-type {
    width: 0px;
    height: 0px;
    border-right: 25px solid transparent;
    border-top: 25px solid $-black;
    border-left: 25px solid $-black;
    border-bottom: 25px solid $-black;
    border-radius: 25px;
  }
  .eat > div:nth-child(2) {
    @extend %divBox;
    animation: eat-balls 1s 0s infinite linear;
  }
  .eat > div:nth-child(3) {
    @extend %divBox;
    animation: eat-balls 1s 0.25s infinite linear;
  }
  .eat > div:nth-child(4) {
    @extend %divBox;
    animation: eat-balls 1s 0.5s infinite linear;
  }
  .eat > div:nth-child(5) {
    @extend %divBox;
    animation: eat-balls 1s 0.75s infinite linear;
  }
  @keyframes eat-balls {
    75% {
      opacity: 0.7;
    }

    100% {
      -webkit-transform: translate(-100px, -6.25px);
      transform: translate(-100px, -6.25px);
    }
  }
}
</style>