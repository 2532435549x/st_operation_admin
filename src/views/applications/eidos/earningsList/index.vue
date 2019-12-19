<!--
 * @Date: 2019-07-29 14:23:28
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:18:38
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-select v-model="params.s_EQ_subscribeRecordId" clearable placeholder="请选择挖矿认购记录">
            <el-option
              v-for="item in productListAll"
              :key="item.id"
              :label="item.subject"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item label>
          <el-input v-model="params.s_LIKE_account" placeholder="请输入接收账户" clearable />
        </el-form-item>

        <el-form-item label>
          <el-select v-model="params.s_EQ_success" clearable placeholder="请选择发放是否成功">
            <el-option :value="1" label="成功" />
            <el-option :value="0" label="未成功" />
          </el-select>
        </el-form-item>

        <el-form-item label>
          <!-- <el-input v-model="queryList.s_EQ_confirm" placeholder="发放是否已确认" clearable /> -->
          <el-select v-model="params.s_EQ_confirm" clearable placeholder="请选择发放是否已确认">
            <el-option :value="1" label="已确认" />
            <el-option :value="0" label="未确认" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <el-button type="primary" @click="formVisible('发放收益')">发送收益</el-button>
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

      <!-- <el-table-column label="挖矿记录认购ID" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.subscribeRecordId || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="挖矿产品配置ID" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.periodId || "暂无数据" }}</template>
      </el-table-column>-->

      <el-table-column label="当前发放轮数" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.issueOrdinal }}</template>
      </el-table-column>

      <el-table-column label="收益接收账号" align="center" width="130">
        <template slot-scope="scope">{{ scope.row.account || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="认购份额数量" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.subscribeNum }}</template>
      </el-table-column>

      <el-table-column label="发放收益数量" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.profitNum }}</template>
      </el-table-column>

      <el-table-column label="是否发放成功" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.success">
            <el-tag type="success">是</el-tag>
          </span>
          <span v-if="!scope.row.success">
            <el-tag>否</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="是否确认发放" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.confirm">
            <el-tag type="success">是</el-tag>
          </span>
          <span v-if="!scope.row.confirm">
            <el-tag>否</el-tag>
          </span>
        </template>
      </el-table-column>

      <el-table-column label="发放时间" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.issueTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="生成时间" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.createTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="链上交易ID" align="center" width="510">
        <template slot-scope="scope">{{ scope.row.transactionId || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="300">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            @click="$router.push({name:'transfer-list',query:{id:scope.row.id,type:2}})"
          >查看转账</el-button>

          <el-button
            type="primary"
            size="mini"
            @click="$router.push({name:'productDetail',query:{id:scope.row.periodId,type:2}})"
          >查看产品</el-button>
          <el-button
            type="success"
            size="mini"
            @click="$router.push({name:'subscription-list',query:{id:scope.row.subscribeRecordId}})"
          >查看认购</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="产品名称">
          <el-select v-model="ruleForm.periodId" placeholder="请选择发送收益">
            <el-option
              v-for="item in productListAll"
              :key="item.id"
              :label="item.subject"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <span>注意：如果发放收益失败,请在链上确认用户未收到转账后,再重试发放.</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="cancel('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->

    <!-- 分页栏 -->
    <div v-if="listData.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="listData.total"
          :page-size="listData.pageSize"
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
import * as earning from '@/api/eidos/earning'
import { productAllList } from '@/api/eidos/product'
export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('改项不能为空.'))
      } else {
        if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
          callback(new Error('请输入整数.'))
        }
        callback()
      }
    }
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      params: {
        s_EQ_subscribeRecordId: this.$route.query.earnid || ''
      },
      listData: {}, // 列表数据
      title: '',
      listLoading: false,
      dialogFormVisible: false,
      productListAll: [],
      ruleForm: {}, // 表单需要数据
      rules: {
        name: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        account: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        privateKey: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        eidosBalanceLimit: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        threadNum: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        nodeCode: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ]
      } // rules
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
    },
    params: {
      handler(val, oldVal) {
        console.log('val: ', val)
        this.queryList = {
          pageNum: 1,
          pageSize: 10
        }
      },
      deep: true
    }
  },
  async  created() {
    const result = await productAllList()
    if (result.code != 1000) {
      this.$message({
        message: result.message,
        duration: 2000
      })
      return
    } else {
      this.productListAll = result.data
    }
    console.log('result: ', result)
    // this.params.s_EQ_subscribeRecordId = this.$route.query.earnid
    // this.params.s_EQ_subscribeRecordId = 10000001
  },
  mounted() {
    this.fetchData()
  },
  methods: {
    aaa() {
      console.log('this.params: ', this.params)
      console.log(2)
    },
    // 切换排序
    changeSort(type) {
      console.log('type: ', type)
    },
    // 切换矿机状态
    async changeStatus(item) {
      // console.log('item: ', item)
      // let res
      // if (item.status == 1) {
      //   res = await earning.endEidos({ id: item.id })
      // }
      // if (item.status == 0) {
      //   res = await earning.startEidos({ id: item.id })
      // }
      // console.log('res: ', res)
      // this.fetchData()

      // return false
    },
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
        const res = await earning.earningList(params)
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

    formatDate(now) {
      if (now) {
        const newDate = new Date(now)
        const year = newDate.getFullYear()
        const month = newDate.getMonth() + 1
        const date = newDate.getDate()
        let hour = newDate.getHours()
        let minute = newDate.getMinutes()
        let second = newDate.getSeconds()
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        return (
          year +
          '-' +
          month +
          '-' +
          date +
          ' ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        )
      } else {
        return false
      }
    }, // 日期处理

    formVisible(state, ...rest) {
      this.title = state
      if (this.productListAll.length > 0) {
        this.ruleForm.periodId = this.productListAll[0].id
      }
      this.dialogFormVisible = true
    }, // 显示编辑弹出

    async submitForm(formName) {
      const res = await earning.sendEarning(this.ruleForm)
      if (res.code === 1000) {
        this.fetchData()
        this.$message({
          message: res.message,
          type: 'success'
        })
        this.dialogFormVisible = false
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
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

