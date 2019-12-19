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
          <el-input v-model="queryList.s_LIKE_name" placeholder="输入国家（中文）名称搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_nameEn" placeholder="输入国家（英文）名称搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_nameLocal" placeholder="输入国家（当地语言）名称搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_enable" clearable placeholder="请选择状态">
            <el-option :label="'开启/关闭'" :value="null" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
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
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>
      <el-table-column label="国家名称" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.name}}</template>
      </el-table-column>

      <el-table-column label="国家名称(英文)" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.nameEn}}</template>
      </el-table-column>
      <el-table-column label="国家名称(当地语言)" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">
          <input v-model="scope.row.nameLocal" type="text" />
        </template>
      </el-table-column>
      <el-table-column label="是否开放验证" align="center" width="180">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.enable"
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
       <el-table-column fixed="right" label="确认是否修改" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="primary" @click="SetCountry(scope.row)">确定修改</el-button>
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
import { setCountry, getCountryList } from '@/api/casModule'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      tt: '',
      queryList: {
        pageNum: 1,
        pageSize: 10
        // orderBy:'id DESC'
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.getCountryLists()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.getCountryLists()
  },
  mounted() {},
  methods: {
    async refresh() {
      let res = await this.getCountryLists()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },
    //获取国家列表
    async getCountryLists() {
      this.dialogFormVisible = false
      try {
        let res = await getCountryList(this.queryList)

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: xl', this.listData)
          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    SetCountry(item) {
      this.$confirm(`你正在做修改操作，是否继续？`, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(_ => {
          // let params= Object.assign({},item)
          let params = {
            id: item.id,
            name: item.name,
            nameEn: item.nameEn,
            nameLocal: item.nameLocal,
            enable: item.enable,
            version: item.version
          }
          //  params.enable = !params.enable
          setCountry(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.getCountryLists()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消操作'
          })
        })
    },
    stateExchange(item, state) {
      this.$confirm(
        `你正在${state == 'open' ? '开启' : '关闭'}开放验证，是否继续？`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // item.enable = !item.enable
          let params = Object.assign({}, item)
          params.enable = !params.enable
          setCountry(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.getCountryLists()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消操作'
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
input {
  width: 100%;
  height: 42px;
  border: none;
  background-color: #ecf5ff;
  text-align: center;
}
</style>
