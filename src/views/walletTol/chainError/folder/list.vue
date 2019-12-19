<!--
 * @Description: chainError -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-30 17:41:01
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索，箭头向下展开详情">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_code" placeholder="输入错误码" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_asserts" placeholder="输入断言内容" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_error" placeholder="输入错误内容" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_formatError" placeholder="输入格式化错误内容" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_formatErrorEn" placeholder="输入英文格式化错误内容" clearable />
        </el-form-item>

        <!-- <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="''" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">添加链错误信息</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
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
            <el-form-item label="错误内容">{{ row.error }}</el-form-item>

            <el-form-item label="断言错误内容">{{ row.asserts }}</el-form-item>

            <el-form-item label="格式化错误内容">{{ row.formatError }}</el-form-item>

            <el-form-item label="格式化错误内容(EN)">{{ row.formatErrorEn }}</el-form-item>

            <el-form-item label="创建时间">{{ row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum - 1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="错误码" align="center" sortable="code" min-width="200">
        <template slot-scope="scope">{{ scope.row.code }}</template>
      </el-table-column>

      <el-table-column label="错误内容" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.error }}</template>
      </el-table-column>

      <el-table-column label="断言错误内容" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.asserts }}</template>
      </el-table-column>

      <el-table-column label="格式化错误内容" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.formatError }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.chainType }}</template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="140">
        <template slot-scope="scope">
          <el-tag :type=" scope.row.status | statusFilter">{{ scope.row.status | textFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteKeywords('delete',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="160px" class="demo-ruleForm">
        <el-form-item label="错误码" prop="code">
          <el-input v-model="form.code" placeholder="请填写错误码" />
        </el-form-item>

        <el-form-item label="断言错误" prop="asserts">
          <el-input
            v-model="form.asserts"
            type="textarea"
            :autosize="{minRows:2,maxRows:4}"
            placeholder="请填写断言错误"
          />
        </el-form-item>

        <el-form-item label="错误内容" prop="error">
          <el-input
            v-model="form.error"
            type="textarea"
            :autosize="{minRows:2,maxRows:4}"
            placeholder="请填写错误内容"
          />
        </el-form-item>

        <el-form-item label="格式化错误内容" prop="formatError">
          <el-input
            v-model="form.formatError"
            type="textarea"
            :autosize="{minRows:2,maxRows:4}"
            placeholder="请填写格式化错误内容"
          />
        </el-form-item>

        <el-form-item label="格式化错误内容(EN)" prop="formatErrorEn">
          <el-input
            v-model="form.formatErrorEn"
            type="textarea"
            :autosize="{minRows:2,maxRows:4}"
            placeholder="请填写英文格式化错误内容"
          />
        </el-form-item>

        <!-- <el-form-item label="所属链类型" prop="chainType">
          <el-select v-model="form.chainType" multiple placeholder="请选择所属链(支持多个)">
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>-->

        <el-form-item label="所属链类型" prop="chainType">
          <el-input v-model="form.chainType" placeholder="请填写所属链类型(支持多个，用,隔开)" />
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择状态">
            <el-option
              v-for="(item, index) in statusOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <!-- <el-form-item label="状态管理" v-if="title!=='新增'" prop="status">
          <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框 -->

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
  getChainErrorList,
  addChainError,
  deleteChainError,
  editChainError
} from '@/api/walletTolModule/chainError'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        '1': 'danger',
        '2': 'success',
        '3': 'info'
      }
      return statusMap[status]
    },
    textFilter(status) {
      const textMap = {
        '1': '未处理',
        '2': '已处理',
        '3': '无效'
      }
      return textMap[status]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      listData: {},
      dialogFormVisible: false,
      form: {},
      title: '',
      statusOptions: [
        { label: '未处理', value: '1' },
        { label: '已处理', value: '2' },
        { label: '无效', value: '3' }
      ],
      rules: {
        code: [{ required: true, message: '请填写错误码', trigger: 'blur' }],
        error: [{ required: true, message: '请填写错误内容', trigger: 'blur' }],
        asserts: [
          { required: true, message: '请填写断言错误', trigger: 'blur' }
        ],
        formatError: [
          { required: true, message: '请填写格式化错误内容', trigger: 'blur' }
        ],
        formatErrorEn: [
          {
            required: true,
            message: '请填写英文格式化错误内容',
            trigger: 'blur'
          }
        ],
        chainType: [
          {
            required: true,
            message: '请填写所属链类型(支持多个用,连接)',
            trigger: 'blur'
          }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'change' }]
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
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
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
        let res = await getChainErrorList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: e }
      }
    },

    formVisible(state, item) {
      this.dialogFormVisible = true
      switch (state) {
        case 'add':
          this.title = '添加'
          this.form = Object.assign({}, { status: '1' })
          break
        default:
          this.title = '编辑'
          this.form = item
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        let params = Object.assign({}, { ...this.form })
        console.log('params: ', params)
        if (valid) {
          if (this.title === '编辑') {
            let ev = await editChainError(params)
            this.$message({
              message: `编辑${ev.message}`,
              type: 'success'
            })
          } else if (this.title === '添加') {
            let av = await addChainError(params)
            this.$message({
              message: `添加${av.message}`,
              type: 'success'
            })
          }
          this.fetchData() // 成功与否都重新请求一次
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
      this.fetchData()
    },

    deleteKeywords(state, item) {
      this.$confirm(`是否【删除】本条信息？，老哥谨慎操作哦！`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(action => {
          if (action === 'confirm') {
            console.log('item.id: ', item.id)
            deleteChainError({ id: item.id }).then(v => {
              this.$notify.success('删除成功')
              this.fetchData()
            })
          }
        })
        .catch(e => {
          this.$notify.info('取消删除')
        })
    }, // 删除操作

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>

