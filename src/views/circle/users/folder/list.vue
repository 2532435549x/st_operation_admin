<!--
 * @Description: circle -> users
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-21 15:28:26
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.customerNick" placeholder="输入用户昵称搜索" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.customerMobile" placeholder="输入用户手机号搜索" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.customerEmail" placeholder="输入用户邮箱搜索" clearable />
        </el-form-item>

        <el-form-item label="注册时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
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
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="用户昵称">{{ scope.row.customerNick }}</el-form-item>

            <el-form-item label="手机号">{{ scope.row.customerMobile }}</el-form-item>

            <el-form-item label="邮箱">{{ scope.row.customerEmail }}</el-form-item>

            <el-form-item label="注册时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="用户头像" align="center" width="100">
        <template slot-scope="{row}">
          <el-avatar :size="50" :src="row.customerAvatar" @error="errorHandler">
            <img src="/static/publicImgs/default-avatar.png" style="width: 50px; height: 50px" />
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="用户昵称" align="center" min-width="100">
        <template slot-scope="scope">{{ scope.row.customerNick }}</template>
      </el-table-column>

      <el-table-column label="手机号" align="center" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="邮箱" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="粉丝数" sortable="fan_num" align="center" width="120">
        <template slot-scope="scope">{{scope.row.fanNum}}</template>
      </el-table-column>

      <el-table-column label="收藏数" sortable="favorite_num" align="center" width="120">
        <template slot-scope="scope">{{scope.row.favoriteNum}}</template>
      </el-table-column>

      <el-table-column label="发帖数" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.postCount }}</template>
      </el-table-column>

      <el-table-column label="评论数" align="center" width="100">
        <template slot-scope="scope">{{scope.row.commentCount}}</template>
      </el-table-column>

      <el-table-column label="积分数" align="center" width="100">
        <template slot-scope="scope">{{scope.row.score}}</template>
      </el-table-column>

      <el-table-column label="用户类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typesFilter">{{ row.type === 1 ? '普通用户' : '管理用户' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="注册时间" sortable="create_time" align="center" width="180">
        <template slot-scope="scope">{{scope.row.createTime}}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('detail', scope.row)">查看详情</el-button>
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
import { setContextData, getContextData } from '@/utils/validate'

import { getUserList } from '@/api/circleModule/users'

export default {
  filters: {
    typesFilter(status) {
      const typesMap = {
        1: 'info',
        2: 'primary'
      }
      return typesMap[status]
    }
  },
  data() {
    return {
      listLoading: true,
      listData: {}, // 列表总数据
      form: {}, // 验证数据表
      queryList: {
        pageNum: 1,
        pageSize: 15,
        start: '',
        end: ''
      },
      dateRange: '' // 日期范围
    }
  },
  computed: {},
  watch: {
    dateRange(val) {
      this.queryList.start = val ? val[0] : ''
      this.queryList.end = val ? val[1] : ''
      this.queryList.pageNum = 1
    },

    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
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
      this.listLoading = true
      try {
        let res = await getUserList(this.queryList)
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
    },

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/circle/users/users-detail',
            query: { style, id: item.id, customerUid: item.customerUid }
          })
          break
      }
    }, // 操作

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
</style>
