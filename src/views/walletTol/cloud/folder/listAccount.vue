<!--
 * @Description: walletTol -> cloud -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-21 17:44:04
 -->

<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.push({name: 'WalletTol-cloudBackup-listTol'})" content="云备份总览"></el-page-header>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="list"
      element-loading-text="Loading"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="用户UID" min-width="300" align="center">
        <template slot-scope="scope">{{scope.row.customerUid}}</template>
      </el-table-column>

      <el-table-column label="上次备份时间" min-width="300" align="center">
        <template slot-scope="scope">{{scope.row.lastBackUpTime}}</template>
      </el-table-column>

      <el-table-column label="备份数量" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.count }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.chainType | typeFilter">{{row.chainType | chainTypeTxT}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('detail',scope.row)">继续查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->
  </div>
</template>

<script>
import { getCloAccountList } from '@/api/walletTolModule/cloud'

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
        orderBy: 'last_backup_time DESC'
      },
      list: []
    }
  },
  watch: {},
  created() {
    if (this.$route.query.customerUid) {
      this.queryList = Object.assign({}, this.queryList, {
        customerUid: this.$route.query.customerUid
      })
      this.fetchData()
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
      try {
        let res = await getCloAccountList(this.queryList)
        this.list = res.data

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
            name: 'WalletTol-cloudBackup-listChain',
            query: { customerUid: item.customerUid, chainType: item.chainType }
          })
          break
      }
    }
  }
}
</script>

