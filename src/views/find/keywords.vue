<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="keywordSearch"
        placeholder="请输入搜索内容"
        style="width: 200px;"
        class="filter-item"
        @input="(e)=>{!e && fetchData()}"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="keyWordSearch(keywordSearch)"
      >搜索</el-button>
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-edit"
        @click="formVisible('add')"
      >新增</el-button>
    </div>
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
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="关键字名称">
        <template slot-scope="scope">{{ scope.row.words }}</template>
      </el-table-column>
      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteKeywords('delete',scope.row)">删除</el-button>
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
          <i class="el-icon-arrow-right el-icon--right"/>
        </el-button>
      </el-button-group>
    </div>
    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="字段名" prop="words">
          <el-input v-model="form.words" placeholder="请填入关键字名称"/>
        </el-form-item>

        <el-form-item label="分类排序" prop="sort">
          <el-input v-model="form.sort" placeholder="请填入分类排序,数字越大越靠后"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
  </div>
</template>

<script>
import { getKeywordsList, modifyKeywords, deleteKeywords, addKeywords } from '@/api/find'

export default {
  filters: {
    statusFilter (status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data () {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 10
      },
      title: '', // 弹出框标题；新增 --修改搜索关键字两种
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        id: '',
        sort: '',
        status: ''// 默认启用
      },
      keywordSearch: '',
      rules: {
        words: [
          { required: true, message: '请填入关键字名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入关键字排序', trigger: 'blur' }
        ]
      }// rr
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData (params = {}) {
      this.listLoading = true
      console.log('xcq', params)
      params.pageSize = this.qureyList.pageSize
      params.pageNum = this.qureyList.pageNum
      getKeywordsList(params).then(response => {

        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
    submitForm (formName) {
      console.log(formName)
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.title === '修改搜索关键字' && modifyKeywords(this.form).then(v => {
            console.log(v)
            if (v.code === 1000) {
              this.$message({
                message: `修改${v.message}`,
                type: 'success'
              })
            }
            this.fetchData()
          })
          this.form.wordsEn = this.form.words
          console.log('xcq', valid)
          console.log(this.form)
          this.title === '新增' && addKeywords(this.form).then(v => {
            console.log('xcq', v)
            this.fetchData()
            this.keywordSearch = ''
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    // 显示编辑弹出
    formVisible (statue, ...rest) { // 显示弹框
      console.log(statue)
      this.dialogFormVisible = true
      switch (statue) {
        case 'add':
          this.title = '新增'
          this.form = {
            categoryName: '',
            sort: '',
            status: ''// 默认启用
          }
          break
        default:// 编辑
          this.title = '修改搜索关键字'
          this.form = rest[0]
          break
      }
    }, // FormVisible
    // 删除操作
    deleteKeywords (form, rest) {
      console.log(form, rest)
      this.$confirm(`${rest.words}关键词将被删除，老哥谨慎操作哦！`, '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then((action) => {
          if (action === 'confirm') {
            deleteKeywords(rest).then(v => {
              v.code === 1000 && this.fetchData()
            })
          }
        }).catch(() => {
          console.log('取消删除')
        })
    },
    // 关键词搜索
    keyWordSearch (keyword) {
      console.log(keyword)
      this.fetchData({ s_LIKE_words: keyword })
    },
    // 分页查询 style = 0 为上一页 1 为下页
    pageLoad (style) {
      style === 0 && this.qureyList.pageNum--
      style === 1 && this.qureyList.pageNum++
      this.fetchData()
    }
  }
}
</script>
