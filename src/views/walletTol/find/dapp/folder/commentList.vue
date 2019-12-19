<!--
 * @Description: find -> dapp -> commentList
 * @Author: wangyun
 * @Date: 2019-08-20 13:44:40
 * @LastEditTime: 2019-11-16 14:11:42
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.appName" placeholder="请输入DApp名称" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.account" placeholder="请输入用户名" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.comment" placeholder="请输入评论内容" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="null" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      :data="listData.list"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="id">{{ scope.row.id }}</el-form-item>

            <el-form-item label="评论内容">{{ scope.row.commentText }}</el-form-item>

            <el-form-item label="评论时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="DAppId" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.appId }}</template>
      </el-table-column>

      <el-table-column label="DApp名称" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.appName }}</template>
      </el-table-column>

      <el-table-column label="用户名" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="评论内容" align="center" min-width="300">
        <template slot-scope="scope">
          <div class="description">{{ scope.row.commentText }}</div>
        </template>
      </el-table-column>

      <el-table-column label="评分" sortable="score" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>

      <el-table-column label="评论时间" sortable="create_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.chainType | chainTypeFilter">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>
    </el-table>

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
import { getCommentList } from '@/api/findModule/dapp'

export default {
  data() {
    return {
      listData: {},
      queryList: {
        pageNum: 1,
        pageSize: 10,
        account: '', // 用户名
        start: '',
        end: '',
        chainType: '',
        comment: '' // 评论内容
      },
      dateRange: '', // 日期范围

      coinsOptions: [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }]
    }
  },
  computed: {
    returnChainType() {
      return this.queryList.chainType
    }
  },
  watch: {
    dateRange(val) {
      this.queryList.start = val ? val[0] : ''
      this.queryList.end = val ? val[1] : ''
    },
    queryList: {
      handler(val) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      res.result && this.$message.success('刷新成功')
    },

    async fetchData() {
      this.listLoading = true
      try {
        let res = await getCommentList(this.queryList)
        this.listLoading = false

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    }, // fetchData

    handleCurrentChange(currentPage) {
      this.queryList.pageNum = currentPage
      this.fetchData()
    } // getPage
  }
}
</script>
<style lang="scss" scope>
.icon img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  vertical-align: middle;
  cursor: pointer;
}
.icon.type2 img {
  opacity: 0.2;
}
.description {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>

