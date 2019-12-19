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
          <el-input v-model="queryList.s_LIKE_name" placeholder="输入标签名称查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_type" clearable placeholder="选择标签类型">
            <el-option :label="'系统标签'" :value="1"></el-option>
            <el-option :label="'等级标签'" :value="2"></el-option>
            <el-option :label="'自定义标签'" :value="3"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
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
    <el-table :data="listData.list" :max-height="fullHeight" border fit highlight-current-row>
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="描述">{{ row.description }}</el-form-item>

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

      <el-table-column label="图标" align="center" width="140">
        <template slot-scope="{row}">
          <img :src="row.previewIcon" width="70" />
        </template>
      </el-table-column>

      <el-table-column label="标签名称" align="center" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="标签名称(EN)" align="center" show-overflow-tooltip min-width="150">
        <template slot-scope="scope">{{ scope.row.nameEn }}</template>
      </el-table-column>

      <el-table-column label="标签背景色" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.backgroundColor }}</template>
      </el-table-column>

      <el-table-column label="文字颜色(16进制)" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.textColor }}</template>
      </el-table-column>

      <el-table-column label="线条颜色(16进制)" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.lineColor }}</template>
      </el-table-column>

      <el-table-column label="标签类型" align="center" width="150">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter">{{ row.type | typeTxtFilter}}</el-tag>
        </template>
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
import {
  getUserLabelList,
  editUserLabel,
  deleteUserLabel
} from '@/api/circleModule/userLabel'

export default {
  filters: {
    typeTxtFilter(status) {
      const txtMap = {
        1: '系统标签',
        2: '等级标签',
        3: '自定义标签'
      }
      return txtMap[status]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      listData: {} // 列表总数据
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
      res.result &&
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
    },

    async fetchData() {
      this.dialogFormVisible = false
      try {
        let res = await getUserLabelList(this.queryList)

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
        `${state == 'disable' ? '关闭' : '开启'}启用后，【${item.name}】将${
          state == 'disable' ? '禁用' : '使用'
        }，请谨慎操作！`,
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
          editUserLabel(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          console.log('e: ', e)
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    },

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/circle/userLabel/userLabel-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/circle/userLabel/userLabel-add_edit',
            query: { style, ...item }
          })
          break
      }
    },

    delItem(item) {
      this.$confirm(
        `你正在删除 【${item.name}】，删除之后就没法找到了，请谨慎操作！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          deleteUserLabel({ id: item.id }).then(v => {
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