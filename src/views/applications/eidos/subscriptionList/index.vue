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
          <el-input v-model="queryList.s_EQ_periodId" placeholder="请输入挖矿产品id" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_account" placeholder="请输入收益接收帐号" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.s_EQ_id" placeholder="根据认购ID查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <!-- <el-button type="primary" @click="formVisible('新增')">新增</el-button> -->
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

      <el-table-column label="认购记录ID" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.id || "暂无数据" }}</template>
      </el-table-column>

      <!-- <el-table-column label="购买订单ID" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.orderRecordId || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="挖矿产品ID" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.periodId || "暂无数据" }}</template>
      </el-table-column>-->

      <el-table-column label="挖矿产品期数" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.periodOrdinal || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="收益接收账号" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.account || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="挖矿开始时间" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.periodStartTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="挖矿结束时间" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.periodEndTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="认购份额数" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.subscribeNum || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="认购金额" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.subscribePrice || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="认购时间" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.subscribeTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="发放收益总额" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.profitNumTotal || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.createTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <!-- <el-button type="primary" size="mini" @click="formVisible('编辑',scope.row)">查看订单</el-button> -->
          <el-button
            type="success"
            size="mini"
            @click="$router.push({name:'productDetail',query:{id:scope.row.periodId,type:2}})"
          >查看产品</el-button>

          <el-button
            type="warning"
            size="mini"
            @click="$router.push({name:'earnings-list',query:{earnid:scope.row.id}})"
          >查看收益</el-button>
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
        <el-form-item label="矿机名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入矿机名称" />
        </el-form-item>

        <el-form-item label="矿机挖矿账号" prop="account">
          <el-input v-model="ruleForm.account" placeholder="请输入挖矿账号" />
        </el-form-item>

        <el-form-item label="矿机挖矿私钥" prop="privateKey">
          <el-input
            v-model="ruleForm.privateKey"
            type="textarea"
            placeholder="请输入矿机挖矿私钥，如果误操，请输入'***'以不进行修改"
          />
        </el-form-item>

        <el-form-item label="余额下限" prop="eidosBalanceLimit">
          <el-input v-model="ruleForm.eidosBalanceLimit" placeholder="该内容为整数，需要自行将余额*10000" />
        </el-form-item>

        <el-form-item label="矿机挖矿线程数" prop="threadNum">
          <el-input v-model="ruleForm.threadNum" placeholder="请输入矿机挖矿线程数" />
        </el-form-item>

        <el-form-item label="矿机唯一标识符" prop="nodeCode">
          <el-input v-model="ruleForm.nodeCode" placeholder="请输入矿机挖矿线程数" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
          <el-button @click="cancel('ruleForm')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->

    <!-- 分页栏 -->
    <div class="pageQury">
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
import * as subscribe from '@/api/eidos/subscribe'
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
        pageSize: 10,
        s_EQ_id: this.$route.query.id || '',
        s_EQ_periodId: this.$route.query.subscribeRecordId || ''
      },
      listData: {}, // 列表数据
      title: '',
      listLoading: false,
      dialogFormVisible: false,

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
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 切换排序
    changeSort(type) {
      console.log('type: ', type)
    },
    // 切换矿机状态
    async changeStatus(item) {
      console.log('item: ', item)
      // let res
      // if (item.status == 1) {
      //   res = await subscribe.endEidos({ id: item.id })
      // }
      // if (item.status == 0) {
      //   res = await subscribe.startEidos({ id: item.id })
      // }
      // console.log('res: ', res)
      // this.fetchData()

      return false
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
      const params = Object.assign({}, this.queryList)
      try {
        const res = await subscribe.subscribeList(params)
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
      this.dialogFormVisible = true
      if (state == '编辑') {
        this.ruleForm = rest[0]
      } else {
        this.ruleForm = {}
      }
    }, // 显示编辑弹出

    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        console.log('valid: ', valid)
        if (valid) {
          let res
          if (this.title == '编辑') {
            res = await eidos.editEidos(this.ruleForm)
          } else {
            res = await eidos.addEidos(this.ruleForm)
          }
          if (res.code === 1000) {
            this.fetchData()
            this.$message({
              message: res.message,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.message,
              type: 'error'
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
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

