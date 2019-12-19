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
          <el-select v-model="queryList.s_LIKE_sendType" clearable placeholder="请选择发送类型">
            <el-option :label="'短信/邮箱'" :value="null" />
            <el-option :label="'短信'" :value="1" />
            <el-option :label="'邮箱'" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_sendSuccess" clearable placeholder="请选择发送状态">
            <el-option :label="'成功/失败'" :value="null" />
            <el-option :label="'成功'" :value="1" />
            <el-option :label="'失败'" :value="0" />
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
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="外部数据">{{ row.externalData }}</el-form-item>

            <el-form-item label="发送时间">{{ row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="接收账号名" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.receiveName }}</template>
      </el-table-column>

      <el-table-column label="验证码" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.authorizationCode }}</template>
      </el-table-column>

      <el-table-column label="是否发送成功" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.sendSuccess" type="success">成功</el-tag>
          <el-tag v-else type="danger">失败</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="验证码隐藏状态" align="center" width="180">
        <template slot-scope="{row}">
          <el-button
            v-if="row.isHidden"
            size="small"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="showCode(row)"
          >点击查看验证码</el-button>
          <el-tag v-else type="info">已显示</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="发送类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag v-if="row.sendType == 1" type="primary">短信</el-tag>
          <el-tag v-if="row.sendType == 2" type="warning">邮箱</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="发送时间" sortable="create_time" align="center" width="240">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogVisible">
      <span slot="title">
        <b>{{title}}</b>
      </span>

      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="名称" prop="receiveName">
          <el-input v-model="form.receiveName" type="text" placeholder="请输入接收账号名（手机号/邮箱）" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 弹出编辑框结束 -->

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
import { getAuthCodeList, getAuthCodeSendList } from '@/api/casModule'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      sendCode: '',
      dialogVisible: false,
      form: { receiveName: '' },
      title: '',
      rules: {
        receiveName: [
          {
            required: true,
            message: '请输入接收账号名（手机号/邮箱）',
            trigger: 'blur'
          }
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
        let res = await getAuthCodeList(this.queryList)

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

    showCode(item) {
      this.title = '查看验证码'
      this.form = Object.assign(
        {},
        {
          id: item.id,
          receiveName: ''
        }
      )
      this.dialogVisible = true
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`你正在查看该账户的验证码，是否继续？`, '提示', {
            confirmButtonText: '确定了',
            cancelButtonText: '再想想',
            type: 'warning'
          })
            .then(() => {
              getAuthCodeSendList(this.form).then(v => {
                this.dialogVisible = false
                this.sendCode = res.data

                this.$notify.success({
                  title: '成功',
                  message: `请求成功`
                })

                this.$alert(`验证码为【${this.sendCode}】`, '提示', {
                  confirmButtonText: '确定'
                })
              })
            })
            .catch(e => {
              console.log(e)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    cancelForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
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
