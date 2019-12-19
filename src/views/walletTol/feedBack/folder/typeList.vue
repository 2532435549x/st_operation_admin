<!--
 * @Description: walletTol -> cloud -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-12 18:38:05
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="支持模糊搜索"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_dataName" placeholder="输入字典数据查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData"
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
            <el-form-item label="创建时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{ scope.$index + 1 }}</template>
      </el-table-column>

      <el-table-column label="Id" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="字典数据值" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dataValue }}</template>
      </el-table-column>

      <el-table-column label="字典数据名称" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dataName }}</template>
      </el-table-column>

      <el-table-column label="字典名称" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.dictName }}</template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <!-- <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            :disabled="scope.row.status == 2"
            @click="signHandler(scope.row)"
          >{{scope.row.status == 2 ? '已读': '标记已读'}}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
    <!-- 表格处理 -->
  </div>
</template>

<script>
import {
  getFeedBackTypeList,
  readFeedBack
} from '@/api/walletTolModule/feedBack'

export default {
  filters: {},
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'create_time DESC'
      },
      listData: []
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
        let res = await getFeedBackTypeList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: 'fail' }
      }
    }

    // signHandler(item) {
    //   readFeedBack({ id: item.id })
    //     .then(v => {
    //       this.$notify.success('操作成功')
    //       this.fetchData()
    //     })
    //     .catch(e => {
    //       console.log('e: ', e)
    //     })
    // }
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 800px;
  padding: 20px;
  overflow-y: auto;
}
</style>



