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
            <el-form-item label="备份账户名">{{ scope.row.account }}</el-form-item>

            <el-form-item label="账号公钥">{{ scope.row.publicKey }}</el-form-item>

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

      <el-table-column label="账户ID" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="备份账户名" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="账号公钥" align="center" min-width="200" >
        <template slot-scope="scope">{{ scope.row.publicKey }}</template>
      </el-table-column>

      <el-table-column label="上次备份时间" align="center" width="200" >
        <template slot-scope="scope">{{ scope.row.lastBackUpTime }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.chainType | typeFilter">{{row.chainType | chainTypeTxT}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="160">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('detail',scope.row)">继续查看</el-button>
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
import { getCloAccountChainList } from '@/api/walletTolModule/cloud'

export default {
  filters: {
    chainTypeTxT(val) {
      const chainTypeMaps = {
        0: 'EOS',
        1: 'BOS',
        2: 'MEETONE',
        3: 'ETH',
        4: 'BTC',
        5: 'USDT'
      }
      return chainTypeMaps[val]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        customerUid: '',
        chainType: null
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
      let customerUid = this.$route.query.customerUid
      let chainType = this.$route.query.chainType
      this.queryList = Object.assign({}, this.queryList, {
        customerUid,
        chainType
      })
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
        let res = await getCloAccountChainList(this.queryList)
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
            name: 'WalletTol-cloudBackup-listAccountDetail',
            query: { accountId: item.id }
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

