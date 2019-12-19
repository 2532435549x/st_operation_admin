<!--
 * @Description: launch -> guide
 * @Author: wangyun
 * @Date: 2019-09-05 19:45:34
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 10:35:18
 -->
<template>
  <div class="app-container">
    <el-page-header @back="$router.go(-1)" content="引导页管理"></el-page-header>
    <el-calendar v-model="value"></el-calendar>
  </div>
</template>
<script>
export default {
  data() {
    return {
      value: new Date()
    }
  }
}
</script>