<template>
  <div class="app-container">
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template slot-scope="scope">{{ scope.$index+1 }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="ID" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="表名" align="center">
        <template slot-scope="scope">{{ scope.row.dictName }}</template>
      </el-table-column>

      <el-table-column label="字段名" align="center">
        <template slot-scope="scope">{{ scope.row.dataName }}</template>
      </el-table-column>

      <el-table-column label="字段值" align="center">
        <template slot-scope="scope">{{ scope.row.dataValue }}</template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pageQury">
      <el-button-group>
        <el-button
          v-if="!list.isFirstPage"
          type="primary"
          icon="el-icon-arrow-left"
          @click="pageLoad(0)"
        >上一页</el-button>
        <el-button v-if="!list.isLastPage" type="primary" @click="pageLoad(1)">
          下一页
          <i class="el-icon-arrow-right el-icon--right" />
        </el-button>
      </el-button-group>
    </div>
    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title + ' [ '+form.dictName+' ] '">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="字段内容" prop="dataValue">
          <el-input v-model="form.dataValue" placeholder="请填入关键字名称" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
  </div>
</template>

<script>
import { dictionaryData, editDictData } from '@/api/dictionaryData'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 100
      },
      title: '编辑字段',
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        ownStatus: '1'
      },
      keywordSearch: '',
      rules: {
        dataValue: [
          { required: true, message: '输入修改字段值', trigger: 'blur' }
        ]
      }// rr
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData(params = {}) {
      this.listLoading = true
      console.log('xcq', params)
      dictionaryData(this.qureyList).then(response => {
        console.log(response.data)
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
    submitForm(formName) {
      console.log(this.form)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          editDictData(this.form).then(v => {
            console.log(v)
            if (v.code === 1000) {
              this.$message({
                message: `修改${v.message}`,
                type: 'success'
              })
            }
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel(formName) {
      this.dialogFormVisible = false
    },
    // 显示编辑弹出
    formVisible(data) { // 显示弹框
      if (data.dictName == 'app_language') {
        this.$message('此条不允许修改！')
        return
      }
      this.dialogFormVisible = true
      this.form = data
    }, // FormVisible
    pageLoad(style) {
      style === 0 && this.qureyList.pageNum--
      style === 1 && this.qureyList.pageNum++
      this.fetchData()
    }
  }
}
</script>
