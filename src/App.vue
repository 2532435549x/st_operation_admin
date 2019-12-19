<!--
 * @Description: app.vue
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-12-12 12:06:27
 -->
<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  watch: {
    $route(to, from) {
      // console.log(to)
      // console.log(from)
    }
  },
  created() {
    // this.initFetch()
  },
  methods: {
  }
}
</script>

<style lang="scss">
// .description {
//   white-space: nowrap;
//   overflow: hidden;
//   text-overflow: ellipsis;
// }
</style>
