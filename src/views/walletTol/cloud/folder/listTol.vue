<!--
 * @Description: walletTol -> cloud -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-21 17:43:05
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_customerNick" placeholder="输入用户昵称查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      element-loading-text="Loading"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="用户UID：">{{ scope.row.customerUid }}</el-form-item>
            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="用户头像" align="center" min-width="140">
        <template slot-scope="scope">
          <img :src="scope.row.customerAvatar" alt width="80" />
        </template>
      </el-table-column>

      <el-table-column label="用户昵称" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.userNick }}</template>
      </el-table-column>

      <el-table-column label="用户电话" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="用户邮箱" min-width="180" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{ scope.row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="可用容量" sortable="available_capacity" align="center" width="160">
        <template slot-scope="scope">{{ scope.row.availableCapacity }}</template>
      </el-table-column>

      <el-table-column label="最大存入容量" sortable="maximum_capacity" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.maximumCapacity }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('detail',scope.row)">查看用户链备份</el-button>
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
        :hide-on-single-page="true"
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
import { getCloudList } from '@/api/walletTolModule/cloud'

export default {
  filters: {},
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      listData: {}
    }
  },
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
    this.queryList.pageNum == 1 && this.fetchData()
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      res.result &&
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
    },

    async fetchData() {
      this.dialogFormVisible = false
      try {
        let res = await getCloudList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: 'fail' }
      }
    },

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            name: 'WalletTol-cloudBackup-listAccount',
            query: { customerUid: item.customerUid }
          })
          break
      }
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>

