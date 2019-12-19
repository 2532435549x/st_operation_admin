<!--
 * @Date: 2019-07-29 14:23:28
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:18:38
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label>
          <el-select v-model="params.s_EQ_subscribeRecordId" clearable placeholder="请选择挖矿认购记录">
            <el-option
              v-for="item in productListAll"
              :key="item.id"
              :label="item.subject"
              :value="item.id"
            />
          </el-select>
        </el-form-item>-->

        <el-form-item label>
          <el-el-input v-model="queryList.s_EQ_subscribeRecordId" placeholder="请输入认购ID" clearable />
        </el-form-item>

        <el-form-item label>
          <el-el-input
            v-model="queryList.s_EQ_profitIssueRecordId"
            placeholder="请输入收益ID"
            clearable
          />
        </el-form-item>

        <el-form-item label>
          <el-select v-model="queryList.s_EQ_success" clearable placeholder="请选择发放是否成功">
            <el-option :value="true" label="成功" />
            <el-option :value="false" label="未成功" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <!-- <el-button type="primary" @click="handleclearSelection">取消选择</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- @expand-change="expandFun" -->
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      max-height="800"
    >
      <!--   @sort-change="changeSort" -->
      <!-- 拓展 -->
      <!-- <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-form class="demo-table-expand" style="float: right">
            <p style="color:#0277BD; font-size:16px; font-weight: bold;">游戏币相关数据</p>
            <el-form-item label="游戏币发放账户：">{{ scope.row.coinsForm || '暂无数据' }}</el-form-item>
            <el-form-item label="权限：">{{ scope.row.coinsPermission || '暂无数据' }}</el-form-item>
            <el-form-item label="合约账户：">{{ scope.row.coinsContract || '暂无数据' }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>-->

      <!-- <el-table-column type="selection" width="55" /> -->

      <el-table-column label="序号" align="center" width="50" prop="scope">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="历史ID" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.id || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="调用合约名称" align="center" width="130">
        <template slot-scope="scope">{{ scope.row.contractName || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="链交易ID" align="center">
        <template slot-scope="scope">{{ scope.row.trxId || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="是否成功" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.success">
            <el-tag type="success">是</el-tag>
          </span>
          <span v-if="!scope.row.success">
            <el-tag type="danger">否</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="是否异常" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.hasException">
            <el-tag type="danger">是</el-tag>
          </span>
          <span v-if="!scope.row.hasException">
            <el-tag>否</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="100">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible('查看详情',scope.row.id)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="ruleForm" :model="ruleForm" label-width="120px" class="demo-ruleForm">
        <el-form-item label="挖矿认购ID">
          <el-input v-model="ruleForm.subscribeRecordId" readonly type="text" />
        </el-form-item>

        <el-form-item label="发放收益ID">
          <el-input v-model="ruleForm.profitIssueRecordId" readonly type="text" />
        </el-form-item>

        <el-form-item label="调用合约名称">
          <el-input v-model="ruleForm.contractName" readonly type="text" />
        </el-form-item>

        <el-form-item label="链交易ID">
          <el-input :value="ruleForm.trxId || '暂无ID'" readonly type="text" />
        </el-form-item>

        <el-form-item label="是否成功">
          <el-input :value="ruleForm.success ? '是' :'否'" readonly type="text" />
        </el-form-item>

        <el-form-item label="调用节点地址">
          <el-input v-model="ruleForm.nodeUrl" readonly type="text" />
        </el-form-item>

        <el-form-item label="是否异常">
          <el-input :value="ruleForm.hasException ?'是':'否'" readonly type="text" />
        </el-form-item>

        <el-form-item label="创建时间">
          <el-input v-model="ruleForm.createTime" readonly type="text" />
        </el-form-item>

        <el-form-item label="合约返回内容">
          <el-input v-model="ruleForm.responseText" :rows="6" readonly type="textarea" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->

    <!-- 分页栏 -->
    <div v-if="listData.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          v-if="listData.total>0"
          :hide-on-single-page="true"
          :total="listData.total"
          :page-size="listData.pageSize"
          :current-page.sync="queryList.pageNum"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!listData.total" class="list list1">暂无数据</div>
    </div>
  </div>
</template>

<script>
import * as transfer from '@/api/eidos/transfer'
export default {
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        s_EQ_profitIssueRecordId: this.$route.query.id || ''
      },
      listData: {}, // 列表数据
      title: '',
      listLoading: false,
      dialogFormVisible: false,
      productListAll: [],
      ruleForm: {} // 表单需要数据
    }
  },
  computed: {
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        if (val) {
          this.fetchData()
        }
      },
      deep: true
    }
  },
  async  created() {
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    /**
     * @description: 为避免饿了么组件交替显示时发生抖动，延迟触发某些操作
     * @methods: closeLoading cancelOperation
     * @param: none
     * @return: none
     */

    openLoading() {
      this.listLoading = true
    },

    closeLoading() {
      setTimeout(() => {
        this.listLoading = false
      }, 200)
    },

    cancelOperation() {
      setTimeout(() => {
        this.$message({
          message: '已取消操作',
          duration: 2000
        })
      }, 200)
    },

    async refresh() {
      const res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '刷新失败！',
          type: 'error'
        })
      }
    }, // 刷新操作

    async fetchData() {
      this.openLoading()
      const params = Object.assign({}, this.params, this.queryList)
      try {
        const res = await transfer.historyList(params)
        if (res.code === 1000) {
          this.listData = res.data
          this.dialogFormVisible = false
          this.closeLoading()
          return { result: true, text: 'success' }
        } else {
          this.closeLoading()
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.closeLoading()
        return { result: false, text: e }
      }
    },
    // 获取列表数据

    async formVisible(state, ...rest) {
      const result = await transfer.historyDetail({ id: rest[0] })
      console.log('result: ', result)
      if (result.code != 1000) {
        this.$message({
          message: result.message,
          type: 'error'
        })
        return
      }
      this.title = state
      this.ruleForm = result.data
      this.dialogFormVisible = true
    }, // 显示编辑弹出

    async submitForm(formName) {
      this.dialogFormVisible = false
    }, // 提交

    cancel(formName) {
      this.dialogFormVisible = false
    }, // 取消

    getPage(type) {
      this.queryList.pageNum = type
    } // 分页查询 style = 0 为上一页 1 为下页
  }
}
</script>
<style>
.demo-table-expand {
  font-size: 0;
  width: 50%;
}
.demo-table-expand label {
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  /* width: 50%; */
}
</style>

