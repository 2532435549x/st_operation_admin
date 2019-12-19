<!--
 * @Description: devPlatform -> audit
 * @Author: wangyun
 * @Date: 2019-08-16 14:14:26
 * @LastEditTime: 2019-11-20 16:24:32
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_appName" placeholder="输入DApp名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="审核通过后的DApp会直接显示在DApp列表中，不会在项目审核模块中出现"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item label="审核状态">
          <el-select v-model="queryList.s_LIKE_auditStatus">
            <el-option
              v-for="(item,index) in auditStatusOptions"
              :label="item.label"
              :value="item.value"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-button class="filter-item" type="primary" @click="refresh">刷新</el-button>
    </div>
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
            <el-form-item label="ID：">{{ scope.row.id }}</el-form-item>
            <el-form-item label="描述：">{{ scope.row.description }}</el-form-item>
            <el-form-item label="所属分类：">{{ scope.row.categoryName }}</el-form-item>

            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum - 1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center" width="100">
        <template slot-scope="scope">
          <img :src="scope.row.logoPreview" alt width="80%" />
        </template>
      </el-table-column>

      <el-table-column label="DApp名称" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.appName }}</template>
      </el-table-column>

      <el-table-column label="DApp描述" align="center" min-width="200">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column label="开发者" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>

      <el-table-column label="评分值" align="center" sortable="score" width="120">
        <template slot-scope="scope">{{ scope.row.score }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" min-width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.chainTypes }}</template>
      </el-table-column>

      <el-table-column align="center" label="审核状态" width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.auditStatus===1">审核中</span>
          <span v-if="scope.row.auditStatus===2">审核成功</span>
          <span v-if="scope.row.auditStatus===3">审核失败</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.auditStatus == 1" placement="top">
            <div style="text-align: center; margin: 12px;">
              <el-button size="mini" type="success" @click="auditHandler('pass', scope.row)">审核通过</el-button>
              <el-button type="danger" size="mini" @click="auditHandler('deny', scope.row)">审核拒绝</el-button>
            </div>
            <el-button slot="reference" size="small" type="primary">审核</el-button>
          </el-popover>
          <el-button v-if="scope.row.auditStatus == 2" disabled size="small" type="success">审核通过</el-button>
          <el-button v-if="scope.row.auditStatus == 3" disabled size="small" type="danger">审核拒绝</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="formVisible('detail', scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

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
import { setContextData, getContextData } from '@/utils/validate'

import {
  getDappList,
  getDappDetail,
  removeDapp,
  auditPassDapp,
  auditRejectDapp
} from '@/api/findModule/dapp'

export default {
  data() {
    return {
      listLoading: false,
      listData: {},
      queryList: {
        pageNum: 1,
        pageSize: 10,
        s_LIKE_status: 1
      },
      auditStatusOptions: [
        { label: '待审核', value: 1 },
        { label: '已拒绝', value: 3 }
      ],
      dialogFormVisible: false,
      form: {
        message: ''
      },
      title: {
        state: '',
        text: ''
      },
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
    },

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/walletTol/find/dapp/dapp-detail',
            query: { style, id: item.id, moduleName: '项目审核' }
          })
          break
      }
    },

    auditHandler(style, item) {
      const { id: appId, appName } = item
      if (style == 'pass') {
        this.$confirm(`此操作将批准【${appName}】上架，是否继续？`, '提示', {
          confirmButtonText: '确定了',
          cancelButtonText: '再想想',
          type: 'warning'
        })
          .then(async () => {
            let res = await auditPassDapp({ appId })
            res.code == 1000 &&
              this.$notify.success({
                title: '成功',
                message: '操作成功'
              })
            this.fetchData()
          })
          .catch(e => {
            console.log(e)
          })
      } else if (style == 'deny') {
        this.dialogFormVisible = true
        this.title = Object.assign({}, { state: style, text: '审核拒绝' })
        this.form = Object.assign({}, { appId, appName, message: '' })
      }
    }, // 审核操作

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将拒绝【${this.form.appName}】上架，是否继续？`,
            '提示',
            {
              confirmButtonText: '确定了',
              cancelButtonText: '再想想',
              type: 'warning'
            }
          )
            .then(async () => {
              if (this.title.state == 'deny') {
                let res = await auditRejectDapp(this.form)
                res.code === 1000 &&
                  this.$notify.success({
                    title: '成功',
                    message: `拒绝成功`
                  })
              }
              this.fetchData()
              this.dialogFormVisible = false
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

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    cancelForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },

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
.description {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>
