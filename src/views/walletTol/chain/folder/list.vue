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

        <!-- <el-form-item>
          <el-input v-model="queryList.s_LIKE_name" placeholder="输入链名称搜索" clearable />
        </el-form-item>-->

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_name" clearable placeholder="选择链名称">
            <el-option :label="'全部'" :value="''" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_EQ_status" clearable placeholder="请选择状态">
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

      <el-table-column label="链名称" align="center" min-width="200">
        <template slot-scope="scope">
          <el-tag :type=" scope.row.name | chainTypeFilter ">{{ scope.row.name }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status ?  'success' : 'danger'"
            :icon="scope.row.status ? 'el-icon-check' : 'el-icon-close' "
            @click="stateExchange(scope.row,`${scope.row.status ? 'disable' : 'open'}`)"
            circle
            size="mini"
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
import {
  getChainList,
  editChain,
  deleteChain
} from '@/api/walletTolModule/chain'

export default {
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
      this.$store.dispatch('setChains')
      try {
        let res = await getChainList(this.queryList)

        this.listData = res.data
        return { result: true, text: 'success' }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/walletTol/chain/chain-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/chain/chain-add_edit',
            query: { style, ...item }
          })
          break
      }
    },

    stateExchange(item, state) {
      this.$confirm(
        `你正在${state == 'disable' ? '关闭' : '打开'}链配置，是否继续？`,
        'FBI WARNING',
        {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }
      )
        .then(_ => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editChain(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    }, // 修改状态

    delItem(item) {
      this.$confirm(`你正在删除链配置，是否继续？`, 'FBI WARNING', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          deleteChain({ id: item.id }).then(v => {
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
