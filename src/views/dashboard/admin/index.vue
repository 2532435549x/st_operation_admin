<!--
 * @Description: index
 * @Author: wangyun
 * @Date: 2019-08-29 14:39:00
 * @LastEditors: wangyun
 * @LastEditTime: 2019-08-31 08:58:43
 -->
<template>
  <div class="dashboard-container">
    <h1>小老弟，后台正在努力开发中，稍安勿躁~</h1>
    <div class="dashboard-text">
      name：{{name}} <el-tag>{{roles}}</el-tag>
      </div>
    <!-- <div class="dashboard-text">
      roles: {{roles}}
    </div> -->
    <h2>以下数据均为模拟，不要在意~</h2>
    <panel-group @handleSetLineChartData="handleSetLineChartData" />
  </div>
</template>
<script>
import PanelGroup from './components/PanelGroup'
import { mapGetters } from 'vuex'

const lineChartData = {
  newVisitis: {
    expectedData: [100, 120, 161, 134, 105, 160, 165],
    actualData: [120, 82, 91, 154, 162, 140, 145]
  },
  messages: {
    expectedData: [200, 192, 120, 144, 160, 130, 140],
    actualData: [180, 160, 151, 106, 145, 150, 130]
  },
  purchases: {
    expectedData: [80, 100, 121, 104, 105, 90, 100],
    actualData: [120, 90, 100, 138, 142, 130, 130]
  },
  shoppings: {
    expectedData: [130, 140, 141, 142, 145, 150, 160],
    actualData: [120, 82, 91, 154, 162, 140, 130]
  }
}
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup
  },
  computed: {
    ...mapGetters(['name', 'roles'])
  },
  data() {
    return {
      lineChartData: lineChartData.newVisitis
    }
  },
  methods: {
    handleSetLineChartData(type) {
      this.lineChartData = lineChartData[type]
    }
  }
}
</script>
<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 20px;
  }
  &-text {
    font-size: 18px;
    line-height: 52px;
  }
}
</style>