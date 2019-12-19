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
          <el-input v-model="queryList.s_LIKE_appName" placeholder="输入应用名称搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="请选择状态">
            <el-option :label="'开启/关闭'" :value="null" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
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
            <el-form-item label="Key">{{ row.appKey }}</el-form-item>

            <el-form-item label="通知地址">{{ row.notifyUrl }}</el-form-item>

            <el-form-item label="通知范围">{{ row.notifyScope }}</el-form-item>

            <el-form-item label="服务器白名单">{{ row.whiteIps }}</el-form-item>

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

      <el-table-column label="应用Logo" align="center" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.logoPreview " alt width="80" />
        </template>
      </el-table-column>

      <el-table-column label="应用名称" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.appName }}</template>
      </el-table-column>

      <el-table-column label="通知地址" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.notifyUrl }}</template>
      </el-table-column>

      <el-table-column label="通知范围" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.notifyScope }}</template>
      </el-table-column>

      <el-table-column label="服务器白名单" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.whiteIps }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已开启，点击可关闭"
            icon="el-icon-check"
            circle
            size="mini"
            @click="stateExchange(scope.row,'disable')"
          />
          <el-button
            v-else
            type="danger"
            title="已关闭，点击可开启"
            icon="el-icon-close"
            circle
            size="mini"
            @click="stateExchange(scope.row,'open')"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit', scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem(scope.row)">删除</el-button>
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
import { getCasAppList, editCasApp, deleteCasApp } from '@/api/casModule'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      tt: '',
      queryList: {
        pageNum: 1,
        pageSize: 10
      }
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
        let res = await getCasAppList(this.queryList)

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

    stateExchange(item, state) {
      this.$confirm(
        `你正在${state == 'open' ? '开启' : '关闭'}该应用，是否继续？`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editCasApp(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消操作'
          })
        })
    },

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/cas/application/application-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/cas/application/application-add_edit',
            query: { style, ...item }
          })
          break
      }
    },

    delItem(item) {
      this.$confirm(`你正在删除该应用，是否继续？`, 'FBI WARNING', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          deleteCasApp({ id: item.id }).then(v => {
            if (v.code == 1000) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.fetchData()
            }
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消删除'
          })
        })
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
