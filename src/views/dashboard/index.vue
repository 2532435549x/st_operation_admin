<!--
 * @Description: admin
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditors: wangyun
 * @LastEditTime: 2019-08-29 14:51:50
 -->
<template>
  <div class="dashboard-container">
    <admin-dashboard></admin-dashboard>
  </div>
</template>

<script>
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  components: {
    adminDashboard,
    editorDashboard
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
