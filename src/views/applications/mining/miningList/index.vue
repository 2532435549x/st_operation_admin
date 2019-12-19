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
          <el-input v-model="queryList.toName" placeholder="请输入接收收益的账户名" clearable />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="queryList.fromName" placeholder="请输入发放收益的账户名" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.isAbnormal" clearable placeholder="请选择异常状态">
            <el-option
              v-for="(item, index) in conditionOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.status" clearable placeholder="请选择收益发放状态">
            <el-option
              v-for="(item, index) in incomeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <el-button type="primary" @click="handleclearSelection">取消选择</el-button>
          <el-badge :value="itemCheckedLength" class="item" v-if="listData.total>=1">
            <el-button type="primary" @click="checkAllHander">批量发放收益</el-button>
          </el-badge>
        </el-form-item>
      </el-form>
    </div>

    <!-- @expand-change="expandFun" -->
    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      max-height="800"
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      >
      <!-- 拓展 -->
      <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-form class="demo-table-expand" style="float: left">
            <p style="color:#0277BD; font-size:16px; font-weight: bold;">EOS相关数据</p>
            <el-form-item label="EOS发放账户：">{{ scope.row.fromName || '暂无数据' }}</el-form-item>
            <el-form-item label="权限：">{{ scope.row.permission || '暂无数据' }}</el-form-item>
            <el-form-item label="合约类型：">{{ scope.row.type || '暂无数据' }}</el-form-item>
            <el-form-item label="合约账号：">{{ scope.row.contractName || '暂无数据' }}</el-form-item>
            <el-form-item label="备注：">{{ scope.row.memo || '暂无数据' }}</el-form-item>
          </el-form>
          <el-form class="demo-table-expand" style="float: right">
            <p style="color:#0277BD; font-size:16px; font-weight: bold;">游戏币相关数据</p>
            <el-form-item label="游戏币发放账户：">{{ scope.row.coinsForm || '暂无数据' }}</el-form-item>
            <el-form-item label="权限：">{{ scope.row.coinsPermission || '暂无数据' }}</el-form-item>
            <el-form-item label="合约账户：">{{ scope.row.coinsContract || '暂无数据' }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column type="selection" width="55"></el-table-column>

      <el-table-column label="序号" align="center" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="收益接收账户" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.toName || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="收益类型" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.source || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="币种" align="center">
        <template slot-scope="scope">{{ scope.row.symbol || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="金额（EOS）" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.quantity || 0 }}</template>
      </el-table-column>

      <el-table-column label="游戏币数量" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.coins || 0 }}</template>
      </el-table-column>

      <el-table-column label="预测年化收益率" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.estimateApr || 0 }}</template>
      </el-table-column>

      <el-table-column label="实际年化收益率" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.concreteApr || 0 }}</template>
      </el-table-column>

      <el-table-column label="预测收益" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.estimateProceeds || 0 }}</template>
      </el-table-column>

      <el-table-column label="时间" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.timer || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="异常状态" align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.isAbnormal === 0 ? 'danger' : 'success'"
          >{{scope.row.isAbnormal === 0 ? '异常' : '正常'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="发放收益状态" align="center" width="150">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status === 0 ? 'danger' : 'success'"
          >{{scope.row.status === 0 ? '未发放' : '已发放'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button
            :type="scope.row.status === 1 ?'info' : 'primary' "
            @click="confirmHandler(scope.row)"
          >发放收益</el-button>
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
        <el-form-item label="EOS发放账户" prop="toName">
          <el-input v-model="ruleForm.fromName" placeholder="请填入EOS发放账户名" :disabled="true" />
        </el-form-item>

        <el-form-item label="游戏币发放账户" prop="toName">
          <el-input v-model="ruleForm.coinsForm" placeholder="请填入游戏币发放账户名" :disabled="true" />
        </el-form-item>

        <el-form-item label="收益接收账户" prop="toName">
          <el-input v-model="ruleForm.toName" placeholder="请填入收益接收账户名" :disabled="true" />
        </el-form-item>

        <el-form-item label="时间" prop="timeStamp">
          <el-input v-model="ruleForm.timer" placeholder="请填入时间" :disabled="true" />
        </el-form-item>

        <el-form-item label="游戏币数量" prop="coins">
          <el-input v-model="ruleForm.coins" placeholder="请填入游戏币数量" />
        </el-form-item>

        <el-form-item label="金额（EOS）" prop="quantity">
          <el-input v-model="ruleForm.quantity" placeholder="请填入金额（EOS）数量" />
        </el-form-item>

        <el-form-item label="备注" prop="memo">
          <el-input v-model="ruleForm.memo" placeholder="请填入备注" />
        </el-form-item>

        <el-form-item label="异常状态">
          <el-radio-group v-model="ruleForm.isAbnormal">
            <el-radio :label="0">异常</el-radio>
            <el-radio :label="1">正常</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="收益发放状态">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">未发放</el-radio>
            <el-radio :label="1">已发放</el-radio>
          </el-radio-group>
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
import * as Mining from '@/api/miningMoudle'
export default {
  // filters: {
  //   statusFilter(status) {
  //     const statusMap = {
  //       published: 'success',
  //       draft: 'gray',
  //       deleted: 'danger'
  //     }
  //     return statusMap[status]
  //   }
  // },
  data() {
    return {
      incomeOptions: [
        { label: '已发放', value: 1 },
        { label: '未发放', value: 0 }
      ], // 收益发放

      conditionOptions: [
        { label: '异常', value: 0 },
        { label: '正常', value: 1 }
      ], // 异常状态

      queryList: {
        pageNum: 1,
        pageSize: 20,
        toName: '',
        fromName: ''
      },
      // details: {}, // 展开详情
      listData: {}, //列表数据
      multipleSelection: [],

      title: '',

      listLoading: false,
      dialogFormVisible: false,

      ruleForm: {}, //表单需要数据
      rules: {
        fromName: [
          { required: false, message: '请填入发放收益账户名', trigger: 'blur' }
        ],
        toName: [
          { required: false, message: '请填入接收收益账户名', trigger: 'blur' }
        ],
        timeStamp: [
          { required: false, message: '请填入接收收益账户名', trigger: 'blur' }
        ],
        quantity: [
          { required: true, message: '请填入金额（EOS）数量', trigger: 'blur' }
        ],
        coins: [
          { required: true, message: '请填入游戏币数量', trigger: 'blur' }
        ],
        memo: [{ required: true, message: '请填入备注', trigger: 'blur' }]
      } // rules
    }
  },
  computed: {
    itemCheckedLength() {
      return this.multipleSelection.length
    }
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

    handleclearSelection() {
      this.$refs.multipleTable.clearSelection()
    }, // 清空

    handleSelectionChange(val) {
      this.multipleSelection = val
    }, // 全选

    checkAllHander() {
      this.$confirm(
        `此次操作将批量发放这${this.itemCheckedLength}位用户的收益, 小老弟确定了么？ 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定了',
          cancelButtonText: '再想想',
          type: 'warning'
        }
      )
        .then(async () => {
          if (this.multipleSelection.length === 0) {
            setTimeout(() => {
              this.$message({
                message: '至少选一个嘛，老兄',
                type: 'warning'
              })
            }, 200)
            return
          }
          let res = await this.sendProfitHandler(this.multipleSelection)
          if (res.result) {
            this.$message({
              message: res.text,
              type: 'success'
            })
          } else {
            this.$message({
              message: res.text,
              type: 'error'
            })
          }
        })
        .catch(() => {
          this.cancelOperation()
        })
      console.log(this.multipleSelection)
    }, // 一键发放收益

    confirmHandler(optations) {
      console.log('optations: ', optations)
      if (optations.status === 1) {
        this.$message({
          message: '当前收益已经发放了哦',
          type: 'warning'
        })
      } else if (optations.status === 0) {
        this.$confirm(
          `此操作将发放收益给${optations.toName}这位老兄, 小老弟 是否继续?`,
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '再想想',
            type: 'warning'
          }
        )
          .then(async () => {
            let res = await this.sendProfitHandler(optations)
            if (res.result) {
              this.$message({
                message: res.text,
                type: 'success'
              })
            } else {
              this.$message({
                message: res.text,
                type: 'error'
              })
            }
          })
          .catch(() => {
            this.cancelOperation()
          })
      }
    }, // 单次发放收益

    async sendProfitHandler(optations) {
      this.openLoading()
      let Arr = []
      if (Object.prototype.toString.call(optations) === '[object Array]') {
        Arr = optations
      } else {
        let params = JSON.parse(JSON.stringify(optations))
        Arr.push(params)
      }
      try {
        let res = await Mining.sendProfit(Arr)
        console.log('res: ', res)
        this.closeLoading()
        if (res.code == 1000) {
          this.fetchData()
          return { result: true, text: res.data }
        } else {
          return { result: false, text: '发放收益失败' }
        }
      } catch (e) {
        this.closeLoading()
        return { result: false, text: '发放收益失败' }
      }
    }, // 发放收益

    async refresh() {
      let res = await this.fetchData()
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
      this.multipleSelection.length = 0
      let params = JSON.parse(JSON.stringify(this.queryList))
      console.log('params: ', params)
      try {
        let res = await Mining.getProfitList(params)
        if (res.code === 1000) {
          this.listData = res.data
          this.listData.list.forEach(item => {
            item.timer = this.formatDate(item.timeStamp * 1000)
            item.coinsTimer = this.formatDate(item.coinsTime * 1000)
          })
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
    }, // 获取列表数据

    formatDate(now) {
      if (now) {
        let newDate = new Date(now)
        let year = newDate.getFullYear()
        let month = newDate.getMonth() + 1
        let date = newDate.getDate()
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

    // async expandFun(row, expandedRows) {
    //   this.openLoading()
    //   expandedRows.length > 1 && expandedRows.shift()
    //   let params = {
    //     toName: row.toName,
    //     timeStamp: row.timeStamp
    //   }
    //   let res = await Mining.getProfitDetails(params)
    //   this.details = { coins: res.data.coins }
    //   this.closeLoading()
    // }, // 拓展行执行方法

    formVisible(state, ...rest) {
      this.dialogFormVisible = true
      switch (state) {
        case 'edit':
          // this.title = '编辑'
          this.ruleForm = rest[0]
          break
        default:
          this.title = 'xxx'
          break
      }
    }, // 显示编辑弹出

    submitForm(formName) {
      console.log(this.ruleForm)
      this.$refs[formName].validate(valid => {
        if (valid) {
          Mining.editProfit(this.ruleForm)
            .then(res => {
              if (res.code === 1000) {
                this.fetchData()
                this.$message({
                  message: res.data.data,
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.data.data,
                  type: 'error'
                })
              }
            })
            .catch(e => {
              console.log(e)
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, // 提交

    cancel(formName) {
      this.dialogFormVisible = false
      setTimeout(() => {
        this.$message({
          type: 'info',
          message: '已取消编辑'
        })
      }, 200)
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


