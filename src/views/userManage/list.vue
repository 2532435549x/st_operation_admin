<!--
 * @Description: userManage -> list
 * @Author: wangyun
 * @Date: 2019-09-09 17:38:26
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:26:51
 -->
<template>
  <div class="app-container">
    <el-page-header @back="$router.go(-1)" content="钱包用户管理"></el-page-header>
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