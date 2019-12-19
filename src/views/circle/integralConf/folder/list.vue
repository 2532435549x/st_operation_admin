<!--
 * @Description: circle -> integralConf -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-20 11:28:33
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
          <el-input v-model="queryList.s_LIKE_name" placeholder="请输入积分名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_loopType" clearable placeholder="请选择循环类型">
            <el-option
              v-for="(item, index) in loopTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
            <el-form-item label="id">{{ row.id }}</el-form-item>

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

      <el-table-column label="图标" align="center" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.iconPreview" alt width="60" />
        </template>
      </el-table-column>

      <el-table-column label="积分名称" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="奖励次数" sortable="reward_num" align="center" width="160">
        <template slot-scope="{row}">{{ row.rewardNum }}</template>
      </el-table-column>

      <el-table-column label="奖励积分" sortable="reward_score" align="center" width="160">
        <template slot-scope="{row}">{{ row.rewardScore }}</template>
      </el-table-column>

      <el-table-column label="循环类型" align="center" width="160">
        <template slot-scope="{row}">
          <el-tag :type="row.loopType | typesFilter">{{ row.loopType | contentFilter }}</el-tag>
        </template>
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

      <el-table-column align="center" label="操作" fixed="right" width="240">
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
  getIntegralConfList,
  addIntegralConf,
  editIntegralConf,
  deleteIntegralConf
} from '@/api/circleModule/integral'

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
        pageSize: 10
      },
      loopTypeOptions: [
        { label: '不循环', value: 1 },
        { label: '每天', value: 2 },
        { label: '每周', value: 3 },
        { label: '每月', value: 4 }
      ]
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
        let res = await getIntegralConfList(this.queryList)

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
      return this.$message.warning('此功能关系重大，暂时关闭')

      this.$confirm(
        `${state == 'disable' ? '关闭' : '开启'}启用后，【${item.name}】将${
          state == 'disable' ? '禁用' : '使用'
        }，老哥谨慎操作哦！`,
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
          editIntegralConf(params).then(v => {
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
    },

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$message.warning('此功能关系重大，暂时关闭')
          // this.$router.push({
          //   path: '/circle/integralConf/integralConf-add_edit',
          //   query: { style }
          // })
          break
        case 'edit':
          this.$message.warning('此功能关系重大，暂时关闭')
          // this.$router.push({
          //   path: '/circle/integralConf/integralConf-add_edit',
          //   query: { style, ...item }
          // })
          break
      }
    },

    delItem(item) {
      return this.$message.warning('此功能关系重大，暂时关闭')

      this.$confirm(
        `你正在删除 【${item.name}】，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          deleteIntegralConf({ id: item.id }).then(v => {
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
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
</style>
