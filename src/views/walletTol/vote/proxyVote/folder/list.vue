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
          <el-input v-model="queryList.s_LIKE_account" placeholder="输入账户名搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="null"></el-option>
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
            <el-form-item label="官网地址">
              <a class="activeLink" :href="row.website" target="_blank">{{row.website}}</a>
            </el-form-item>

            <el-form-item label="代理名称">{{ row.name }}</el-form-item>

            <el-form-item label="标语">{{ row.slogan }}</el-form-item>

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
          <img :src="scope.row.logo" alt width="60" />
        </template>
      </el-table-column>

      <el-table-column label="账户名" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="代理名称" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="标语" align="center" min-width="150" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.slogan }}</template>
      </el-table-column>

      <el-table-column label="排序" sortable="sort" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="160">
        <template slot-scope="{row}">
          <el-tag :type="row.chainType | chainTypeFilter">{{ row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="150">
        <template slot-scope="scope">
          <el-popover v-if="scope.row.status == 1" placement="top">
            <div style="text-align: center; margin: 12px;">
              <el-button type="success" size="mini" @click="auditHandler('pass', scope.row)">审核通过</el-button>
              <el-button type="danger" size="mini" @click="auditHandler('deny', scope.row)">审核拒绝</el-button>
            </div>
            <el-button slot="reference" size="small" type="primary">审核</el-button>
          </el-popover>
          <el-button v-if="scope.row.status == 2" disabled size="small" type="danger">审核失败</el-button>
          <el-button v-if="scope.row.status == 3" disabled size="small" type="success">审核成功</el-button>
          <el-button v-if="scope.row.status == 4" disabled size="small" type="info">无效</el-button>
        </template>
      </el-table-column>

      <el-table-column align="center" label="详情" fixed="right" width="150">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="formVisible('detail', scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <!-- <el-dialog :visible.sync="dialogVisible">
      <span slot="title">
        <b>{{title.text}}</b>
      </span>
      <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item label="名称">
          <el-input v-model="form.account" readonly />
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
    </!-->
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
import {
  getProxyVoteList,
  auditPassProxyVote,
  auditRejectProxyVote
} from '@/api/walletTolModule/vote'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      }
      // dialogVisible: false,
      // form: {
      //   id: ''
      // }
      // title: {
      //   state: '',
      //   text: ''
      // },
      // rules: {
      //   message: [{ required: true, message: '请填写理由', trigger: 'blur' }]
      // }
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
      this.dialogVisible = false
      try {
        let res = await getProxyVoteList(this.queryList)

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

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/walletTol/vote/proxyVote/proxyVote-detail',
            query: { style, id: item.id, moduleName: '代理投票' }
          })
          break
      }
    },

    auditHandler(style, item) {
      const { id } = item
      if (style == 'pass') {
        this.$confirm(`你正在执行【审核通过】操作，是否继续？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定了',
          cancelButtonText: '再想想'
        })
          .then(async () => {
            let res = await auditPassProxyVote({ id })
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
        this.$confirm(`你正在执行【审核拒绝】操作，是否继续？`, '提示', {
          type: 'warning',
          confirmButtonText: '确定了',
          cancelButtonText: '再想想'
        })
          .then(async () => {
            let res = await auditRejectProxyVote({ id })
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.fetchData()
          })
          .catch(e => {
            console.log(e)
          })
      }
    },

    // submitForm(formName) {
    //   this.$refs[formName].validate(valid => {
    //     if (valid) {
    //       this.$confirm(
    //         `此操作将拒绝【${this.form.appName}】上架，是否继续？`,
    //         '提示',
    //         {
    //           confirmButtonText: '确定了',
    //           cancelButtonText: '再想想',
    //           type: 'warning'
    //         }
    //       )
    //         .then(async () => {
    //           if (this.title.state == 'deny') {
    //             let res = await auditRejectProxyVote(this.form)
    //             this.$notify.success({
    //               title: '成功',
    //               message: `拒绝成功`
    //             })
    //           }
    //           this.fetchData()
    //         })
    //         .catch(e => {
    //           console.log(e)
    //         })
    //     } else {
    //       console.log('error submit!!')
    //       return false
    //     }
    //   })
    // },

    // resetForm(formName) {
    //   this.$refs[formName].resetFields()
    // },

    // cancelForm(formName) {
    //   this.$refs[formName].resetFields()
    //   this.dialogVisible = false
    // },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
</style>
