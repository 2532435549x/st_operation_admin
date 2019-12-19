<!--
 * @Description: marketChain -> list
 * @Author: wangyun
 * @Date: 2019-09-16 11:41:45
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-28 16:54:21
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单处理 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_name" placeholder="请输入名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
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
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
            <el-option :label="'开启/关闭'" :value="''" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单处理 -->
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
            <el-form-item label="ID：">{{ scope.row.id }}</el-form-item>

            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="名称" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="排序" sortable="custom" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='BOS'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center">
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

      <el-table-column label="创建时间" align="center" width="400">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" @click="delItem(scope.row)">删除</el-button>
          <!-- <el-button type="primary" @click="formVisible('set',scope.row)">配置DApp</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title.text">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="行情链名称" prop="name">
          <el-input v-model="form.name" placeholder="请填入行情链名称" />
        </el-form-item>

        <el-form-item label="所属链类型" prop="chainType">
          <el-select v-model="form.chainType" placeholder="请选择所属链">
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input
            v-model="form.sort"
            type="number"
            min="0"
            step="1"
            placeholder="请填入排序,数字越大越靠前(默认为0)"
          />
        </el-form-item>

        <el-form-item label="状态管理" prop="status">
          <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        :total="listData.total"
        :page-size="listData.pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="queryList.pageNum"
        v-if="listData.total !=0"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>
<script>
import { setContextData, getContextData } from '@/utils/validate'

import {
  getMarketChainList,
  getMarketChainDetail,
  addMarketChain,
  editMarketChain,
  deleteMarketChain
} from '@/api/walletTolModule/market'
export default {
  data() {
    return {
      dialogFormVisible: false,
      queryList: {
        pageNum: 1,
        pageSize: 20,
        s_LIKE_name: '',
        orderBy: ''
      },
      listData: {}, // 列表数据
      form: {}, // 弹出框数据
      title: { state: '', text: '' }, // 弹出框标题 新增/编辑
      rules: {
        name: [{ required: true, message: '请填入行情链名称', trigger: 'blur' }],
        sort: [{ required: true, message: '请输入分类排序', trigger: 'blur' }],
        chainType: [
          { required: true, message: '请选择所属链类型', trigger: 'change' }
        ]
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
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.queryList.pageNum === 1 && this.fetchData()
  },
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
        let res = await getMarketChainList(this.queryList)
        console.log('res: ', res)
        this.listData = res.data

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)
        return { result: false, text: e }
      }
    },

    stateExchange(item, state) {
      this.$confirm(
        `${state == 'disable' ? '关闭' : '开启'}启用后,前台【${item.name}】将${
          state == 'disable' ? '隐藏' : '显示'
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
          editMarketChain(params).then(v => {
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

    changeTableSort(payload) {
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = 'sort DESC'
          break
        case 'descending':
          rule = 'sort ASC'
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
    }, // 排序

    formVisible(style, item) {
      this.dialogFormVisible = ['add', 'edit'].includes(style)

      switch (style) {
        case 'add':
          this.form = {}
          this.title = Object.assign({}, { state: style, text: '新增' })
          break
        case 'edit':
          this.form = { ...item }
          this.title = Object.assign({}, { state: style, text: '编辑' })
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`是否进行【${this.title.text}】操作`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              this.$message.info({
                title: '提示',
                message: `已取消${this.title.text}`
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitHandler() {
      let params = Object.assign({}, { ...this.form })
      if (this.title.state === 'edit') {
        editMarketChain(params).then(v => {
          if (v.code === 1000) {
            this.$notify.success({
              title: '成功',
              message: `${this.title.text}成功`
            })
            this.fetchData()
          }
        })
      } else if (this.title.state == 'add') {
        addMarketChain(params).then(v => {
          if (v.code === 1000) {
            this.$notify.success({
              title: '成功',
              message: `${this.title.text}成功`
            })
            this.fetchData()
          }
        })
      }
    },

    cancel(formName) {
      this.dialogFormVisible = false
      this.$notify.info({
        title: '提示',
        message: `已取消${this.title.text}`
      })
    },

    delItem(item) {
      this.$confirm(
        `你正在删除 【${item.name}】，删除之后就没法找到了，老哥谨慎操作哦！`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteMarketChain({ ...item }).then(v => {
            if (v.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '删除成功'
              })
              this.fetchData()
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '取消删除'
          })
        })
    }, // 删除操作

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>