<!--
 * @Description: circle -> integralAdmin -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-20 17:21:12
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
        <el-form-item>
          <el-input v-model="queryList.customerNick" placeholder="输入用户昵称查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.code" placeholder="输入功能代码查询" clearable />
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
            <el-form-item label="id">{{ row.id }}</el-form-item>
            <el-form-item label="dataId">{{ row.dataId }}</el-form-item>

            <el-form-item label="用户Uid">{{ row.customerUid }}</el-form-item>

            <el-form-item label="功能编码">{{ row.code }}</el-form-item>

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

      <el-table-column label="用户头像" align="center" width="140">
        <template slot-scope="{row}">
          <el-avatar :size="70" :src="row.customerAvatar" @error="errorHandler">
            <img src="/static/publicImgs/default-avatar.png" style="width: 70px; height: 70px" />
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="用户昵称" align="center" width="140">
        <template slot-scope="{row}">{{ row.customerNick }}</template>
      </el-table-column>

      <el-table-column label="用户邮箱" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="{row}">{{ row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="用户电话" align="center" min-width="140">
        <template slot-scope="{row}">{{ row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="功能名称" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="{row}">{{row.name}}</template>
      </el-table-column>

      <el-table-column label="功能英文名称" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="{row}">{{row.nameEn}}</template>
      </el-table-column>

      <el-table-column label="积分" sortable="score" align="center" width="120">
        <template slot-scope="{row}">{{row.score}}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="200">
        <template slot-scope="{row}">{{ row.createTime }}</template>
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
import { getIntegralAwardList } from '@/api/circleModule/integral'

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
    }
  },
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
        console.log('this.queryList.pageNum: ', this.queryList.pageNum)
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
      this.dialogFormVisible = false
      try {
        let res = await getIntegralAwardList(this.queryList)

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
.el-collapse-item__header {
  font-size: 14px;
  color: #409eff;
  font-weight: 700;
}

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
</style>
