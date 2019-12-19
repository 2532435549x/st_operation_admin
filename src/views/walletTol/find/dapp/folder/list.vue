<!--
 * @Description: walletTol -> find -> dapp
 * @Author: wangyun
 * @Date: 2019-08-16 14:14:26
 * @LastEditTime: 2019-11-19 14:10:45
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_appName" placeholder="输入DApp名称" clearable />
        </el-form-item>

        <el-form-item label prop="s_LIKE_status">
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择DApp状态">
            <el-option
              v-for="(item,index) in statusOptions"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
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
      v-loading="listLoading"
      :data="listData.list"
      element-loading-text="Loading"
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
            <el-form-item label="id">{{ scope.row.id }}</el-form-item>

            <el-form-item label="语言">{{ scope.row.languages }}</el-form-item>

            <el-form-item label="描述">{{ scope.row.description }}</el-form-item>
            <el-form-item label="所属分类">{{ scope.row.categoryName }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum - 1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center" width="120">
        <template slot-scope="scope">
          <img :src="scope.row.logoPreview" alt width="60" />
        </template>
      </el-table-column>

      <el-table-column label="DApp名称" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">
          {{ scope.row.appName }}
          <el-tag v-if="scope.row.isOfficial" size="mini" type="danger">ST</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="开发者" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>

      <el-table-column label="描述" align="center" width="220" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column label="评分值" align="center" sortable="count" width="120">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.chainTypes }}</template>
      </el-table-column>

      <el-table-column align="center" label="状态" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">审核阶段</span>
          <span v-if="scope.row.status===2">正常</span>
          <span v-if="scope.row.status===3">下架</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="审核" fixed="right" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 1" type="info" size="small" disabled>审核中</el-button>
          <el-button
            v-if="scope.row.status == 2"
            type="danger"
            size="mini"
            @click="delItem('remove', scope.row)"
          >下架</el-button>
          <el-button v-if="scope.row.status == 3" type="danger" size="small" disabled>已下架</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="formVisible('detail', scope.row)">详情</el-button>
          <el-button type="primary" size="mini" @click="formVisible('edit', scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="formVisible('delete', scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible">
      <span slot="title">
        <b>{{title.text}}</b>
      </span>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="DApp名称">
          <el-input v-model="form.appName" readonly />
        </el-form-item>

        <el-form-item :label="title.text + '理由'" prop="message">
          <el-input v-model="form.message" type="textarea" placeholder="此处为必填" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
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
  getDappList,
  getDappDetail,
  removeDapp,
  auditPassDapp,
  auditRejectDapp,
  deleteDapp
} from '@/api/findModule/dapp'
export default {
  data() {
    return {
      dialogFormVisible: false,
      listLoading: false,
      listData: {},
      form: {
        message: ''
      },
      title: {
        state: '',
        text: ''
      },
      queryList: {
        pageNum: 1,
        pageSize: 10,
      },
      statusOptions: [
        { label: '审核阶段', value: 1 },
        { label: '正常', value: 2 },
        { label: '下架', value: 3 }
      ],
      rules: {
        message: [{ required: true, message: '请填写理由', trigger: 'blur' }]
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
    this.fetchData()
  },

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
      this.listLoading = true
      this.dialogFormVisible = false
      try {
        let res = await getDappList(this.queryList)
        this.listLoading = false

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    }, // fetchData

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/walletTol/find/dapp/dapp-detail',
            query: { style, moduleName: 'DApp列表', ...item }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/find/dapp/dapp-edit',
            query: { style, ...item }
          })
          break
        case 'delete':
          this.$confirm('此操作将永久删除该DApp, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              deleteDapp({ id: item.id }).then(res => {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
              })
            })
            .catch(e => {
              console.log(e)
            })
          break
      }
    }, // 操作

    delItem(state, item) {
      this.dialogFormVisible = true
      const { id, appName } = item
      this.title = Object.assign({}, { state, text: '下架' })
      this.form = Object.assign({}, { appId: id, appName, message: '' })
      console.log('this.form: ', this.form)
    }, // 下架dapp

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将${
              this.title.state == 'remove'
                ? `${this.title.text}【${this.form.appName}】`
                : `拒绝【${this.form.appName}】上架`
            }, 是否继续？`,
            '提示',
            {
              confirmButtonText: '确定了',
              cancelButtonText: '再想想',
              type: 'warning'
            }
          )
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              console.log(e)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, // 确认操作

    async submitHandler() {
      if (this.title.state == 'remove') {
        let res = await removeDapp(this.form)
        res.code === 1000 &&
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
      } else if (this.title.state == 'deny') {
        let res = await auditRejectDapp(this.form)
        res.code === 1000 &&
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
      }
      this.fetchData()
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    cancelForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },

    changeTableSort(payload) {
      console.log('payload: ', payload)
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = 'score DESC'
          break
        case 'descending':
          rule = 'score ASC'
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
    }, // 改变排序

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style scope>
.el-tooltip__popper {
  max-width: 50%;
  line-height: 30px;
}
.icon img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  vertical-align: middle;
  cursor: pointer;
}
.icon.type2 img {
  opacity: 0.2;
}
</style>
