<!--
 * @Description: 圈子打卡签到模块
 * @Author: wangyun
 * @Date: 2019-11-23 11:31:09
 * @LastEditors: wangyun
 * @LastEditTime: 2019-12-12 16:15:27
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <!-- <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item> -->

        <el-form-item>
          <el-select v-model="queryList.s_EQ_type" clearable placeholder="请选择奖励类型">
            <el-option :label="'积分'" :value="1" />
            <el-option :label="'AC'" :value="2" />
            <el-option :label="'STC'" :value="3" />
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

      <el-table-column label="标签" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.label }}</template>
      </el-table-column>
      
      <el-table-column label="表达式" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.signDayExp }}</template>
      </el-table-column>

      <el-table-column label="第几级" sortable="level" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.level }}</template>
      </el-table-column>

      <el-table-column label="奖励分数" sortable="score" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="奖励类型" align="center" width="180">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type == 1" type="primary">积分</el-tag>
          <el-tag v-if="scope.row.type == 2" type="warning">AC</el-tag>
          <el-tag v-if="scope.row.type == 3" type="warning">STC</el-tag>
        </template>
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
  getPunchSetList,
  editPunchSet,
  deletePunchSet
} from '@/api/circleModule/punch'

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
      try {
        let res = await getPunchSetList(this.queryList)

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
            path: '/circle/punch/punch-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/circle/punch/punch-add_edit',
            query: { style, ...item }
          })
          break
      }
    },

    stateExchange(item, state) {
      this.$confirm(
        `你正在${
          state == 'disable' ? '关闭' : '打开'
        }该打卡记录配置，是否继续？`,
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
          editPunchSet(params).then(v => {
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
      this.$confirm(`你正在删除该打卡配置，是否继续？`, 'FBI WARNING', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          deletePunchSet({ id: item.id }).then(v => {
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
