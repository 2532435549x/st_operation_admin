<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.go(-1)" content="上一级"></el-page-header>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      element-loading-text="Loading"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="用户UID">{{ scope.row.customerUid }}</el-form-item>
            <el-form-item label="创建时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="账户名" align="center" width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="备份IP" align="center" min-width="160">
        <template slot-scope="scope">{{ scope.row.actionIp }}</template>
      </el-table-column>

      <el-table-column label="账号公钥" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.publicKey }}</template>
      </el-table-column>

      <el-table-column label="操作类型" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag
            :type="row.actionType | typeFilter"
            effect="plain"
          >{{row.actionType | actionTypeTxT}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.actionTime }}</template>
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
import { getCloAccountDetailList } from '@/api/walletTolModule/cloud'

export default {
  filters: {
    actionTypeTxT(val) {
      const actionTypeMaps = {
        1: '备份',
        2: '读取',
        3: '删除'
      }
      return actionTypeMaps[val]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        accountId: ''
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
    if (this.$route.query) {
      let accountId = this.$route.query.accountId
      this.queryList = Object.assign({}, this.queryList, { accountId })
    }
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
        let res = await getCloAccountDetailList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: 'fail' }
      }
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>

