<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="默认以最后登录时间倒序排列">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_userNick" placeholder="输入用户昵称搜索" clearable />
        </el-form-item>

        <!-- <el-form-item>
          <el-select v-model="queryList.s_LIKE_sendType" clearable placeholder="请选择注册类型">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'手机注册'" :value="1" />
            <el-option :label="'邮箱注册'" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_locked" clearable placeholder="请选择锁定状态">
            <el-option :label="'锁定/未锁定'" :value="null" />
            <el-option :label="'锁定'" :value="1" />
            <el-option :label="'未锁定'" :value="0" />
          </el-select>
        </el-form-item>-->

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
            <el-form-item label="用户备注信息">{{ row.userDescription }}</el-form-item>
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
        <template slot-scope="scope">
          <img :src="scope.row.userAvatar" alt width="60" />
        </template>
      </el-table-column>

      <el-table-column label="用户昵称" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.userNick }}</template>
      </el-table-column>

      <el-table-column label="用户名" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>

      <el-table-column label="用户手机号" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.userMobile }}</template>
      </el-table-column>

      <el-table-column label="用户邮箱" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.userEmail }}</template>
      </el-table-column>

      <el-table-column label="用户积分" sortable="register_type" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.registerType }}</template>
      </el-table-column>

      <el-table-column label="最后登录ip" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.lastLoginIp }}</template>
      </el-table-column>

      <el-table-column label="最后登录时间" sortable="last_login_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.lastLoginTime }}</template>
      </el-table-column>

      <el-table-column label="手机地区码" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.regionCode }}</template>
      </el-table-column>

      <el-table-column label="注册ip" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.registerIp }}</template>
      </el-table-column>

      <el-table-column label="注册时间" sortable="register_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.registerTime }}</template>
      </el-table-column>

      <el-table-column label="注册类型" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-tag v-if="row.sendType == 1" type="primary">手机注册</el-tag>
          <el-tag v-if="row.sendType == 2" type="success">邮箱注册</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否锁定" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.locked" type="primary">已锁定</el-tag>
          <el-tag v-else type="warning ">未锁定</el-tag>
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
import { getCasUserList } from '@/api/casModule'

export default {
  filters: {
    typesFilter(status) {
      const typesMap = {
        1: 'primary',
        2: 'success',
        3: 'warning',
        4: 'danger'
      }
      return typesMap[status]
    },
    contentFilter(status) {
      const contentMap = {
        1: '不循环',
        2: '每天',
        3: '每周',
        4: '每月'
      }
      return contentMap[status]
    }
  },
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'last_login_time DESC'
      }
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
        let res = await getCasUserList(this.queryList)

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
</style>
