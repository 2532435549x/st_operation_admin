<!--
 * @Description: 圈子打卡签到模块
 * @Author: wangyun
 * @Date: 2019-11-23 11:31:09
 * @LastEditors: wangyun
 * @LastEditTime: 2019-12-12 17:35:57
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-select v-model="handleKey" clearable placeholder="请选择搜索条件">
          <el-option
            v-for="(item, index) in handleOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-form-item v-if="handleKey == 'customerNick'">
          <el-input v-model="queryList.customerNick" placeholder="输入用户昵称搜索" clearable />
        </el-form-item>

        <el-form-item v-if="handleKey == 'customerMobile'">
          <el-input v-model="queryList.customerMobile" placeholder="输入用户手机号搜索" clearable />
        </el-form-item>

        <el-form-item v-if="handleKey == 'customerEmail'">
          <el-input v-model="queryList.customerEmail" placeholder="输入用户邮箱搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.type" clearable placeholder="请选择奖励类型">
            <el-option :label="'积分'" :value="1" />
            <el-option :label="'AC'" :value="2" />
            <el-option :label="'STC'" :value="3" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="创建时间">{{ row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="头像" align="center" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.customerAvatar " alt width="60" />
        </template>
      </el-table-column>

      <el-table-column label="昵称" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.customerNick }}</template>
      </el-table-column>

      <el-table-column label="手机号" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="邮箱地址" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="奖励分数" sortable="score" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>

      <el-table-column label="连续签到天数" sortable="signDay" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.signDay }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="奖励类型" align="center" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1" type="primary">积分</el-tag>
          <el-tag v-if="scope.row.type == 2" type="warning">AC</el-tag>
          <el-tag v-if="scope.row.type == 3" type="warning">STC</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        v-if="listData.total !=0"
        :total="listData.total"
        :page-size="listData.pageSize"
        :current-page.sync="queryList.pageNum"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { getPunchList } from '@/api/circleModule/punch'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      handleKey: '',
      handleOptions: [
        { label: '昵称', value: 'customerNick' },
        { label: '手机号', value: 'customerMobile' },
        { label: '邮箱地址', value: 'customerEmail' }
      ]
    }
  },
  computed: {},
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  mounted() {},
  methods: {
    async refresh() {
      let res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },

    async fetchData() {
      try {
        let res = await getPunchList(this.queryList)

        this.listData = res.data
        return { result: true, text: 'success' }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // hCC
  }
}
</script>
<style lang="scss" scope>
</style>
