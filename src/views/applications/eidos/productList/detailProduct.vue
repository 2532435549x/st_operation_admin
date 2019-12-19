<!--
 * @Date: 2019-07-29 14:23:28
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:18:38
 -->
<template>
  <div class="app-container">
    <el-form
      ref="ruleForm"
      :model="ruleForm"
      :rules="rules"
      label-width="200px"
      class="demo-ruleForm"
    >
      <el-form-item v-if="isLook" label="矿机挖矿账号">
        <el-input v-model="ruleForm.machineAccount" :readonly="isLook" />
      </el-form-item>

      <el-form-item v-if="isLook" label="已发放收益轮数">
        <el-input v-model="ruleForm.issuedOrdinal" :readonly="isLook" />
      </el-form-item>

      <el-form-item v-if="isLook" label="总发放收益轮数">
        <el-input v-model="ruleForm.totalIssueOrdinal" :readonly="isLook" />
      </el-form-item>

      <el-form-item v-if="isLook" label="当前状态">
        <span v-if="ruleForm.status == 1">
          <el-tag>认购中</el-tag>
        </span>
        <span v-if="ruleForm.status == 2">
          <el-tag>挖矿中</el-tag>
        </span>
        <span v-if="ruleForm.status == 3">
          <el-tag>等待挖矿</el-tag>
        </span>
        <span v-if="ruleForm.status == 4">
          <el-tag>已完成</el-tag>
        </span>
      </el-form-item>

      <el-form-item v-if="isLook" label="创建时间">
        <el-input v-model="ruleForm.createTime" :readonly="isLook" />
      </el-form-item>
      <!-- s -->

      <el-form-item label="挖矿矿机名称" prop="miningMachineId">
        <el-select :disabled="isLook" v-model="ruleForm.miningMachineId" placeholder="请选择">
          <el-option
            v-for="item in eidosList"
            :key="item.id"
            :label="item.account"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="当前产品期数" prop="periodOrdinal">
        <el-input :readonly="isLook" v-model="ruleForm.periodOrdinal" placeholder="请输入当前产品期数" />
      </el-form-item>

      <el-form-item label="总计EOS数量" prop="totalEosNum">
        <el-input :readonly="isLook" v-model="ruleForm.totalEosNum" placeholder="请输入EOS数量" />
      </el-form-item>

      <el-form-item label="单份额EOS数量" prop="unitEosNum">
        <el-input :readonly="isLook" v-model="ruleForm.unitEosNum" placeholder="请输入单份额EOS数量" />
      </el-form-item>

      <el-form-item label="挖矿开始时间" prop="periodStartTime">
        <el-date-picker
          v-model="ruleForm.periodStartTime"
          :editable="false"
          :readonly="isLook"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="挖矿结束时间" prop="periodEndTime">
        <el-date-picker
          v-model="ruleForm.periodEndTime"
          :editable="false"
          :readonly="isLook"
          format="yyyy-MM-dd HH:mm:ss"
          type="datetime"
          placeholder="选择结束时间"
          value-format="yyyy-MM-dd HH:mm:ss"
        />
      </el-form-item>

      <el-form-item label="份额单价" prop="unitPrice">
        <el-input :readonly="isLook" v-model="ruleForm.unitPrice" placeholder="请输入份额单价" />
      </el-form-item>

      <el-form-item label="产品名称" prop="subject">
        <el-input :readonly="isLook" v-model="ruleForm.subject" placeholder="请输入产品名称" />
      </el-form-item>

      <el-form-item label="产品英文名称" prop="subjectEn">
        <el-input :readonly="isLook" v-model="ruleForm.subjectEn" placeholder="请输入产品英文名称" />
      </el-form-item>

      <el-form-item label="单订单认购份额限制" prop="subscribeLimitNum">
        <el-input
          :readonly="isLook"
          v-model="ruleForm.subscribeLimitNum"
          placeholder="请输入单订单认购份额限制"
        />
      </el-form-item>

      <el-form-item label="订单未支付释放份额时间(秒)" prop="expiredSecond">
        <el-input :readonly="isLook" v-model="ruleForm.expiredSecond" placeholder="请输入订单未支付释放份额时间" />
      </el-form-item>

      <el-form-item label="是否开启认购" prop="enable">
        <el-switch
          :active-value="true"
          :inactive-value="false"
          :readonly="isLook"
          v-model="ruleForm.enable"
        />
      </el-form-item>

      <el-form-item v-if="!isLook">
        <el-button type="primary" @click="submitForm('ruleForm')">确定</el-button>
        <el-button @click="$router.back()">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as product from '@/api/eidos/product'
import * as eidos from '@/api/eidos'

export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('改项不能为空.'))
      } else {
        // if (!/^(-?d )(.d )?$/.test(value)) {
        //   callback(new Error('输入错误.'))
        // }
        if (!/^[0-9]*[1-9][0-9]*$/.test(value)) {
          callback(new Error('请输入整数.'))
        }
        callback()
      }
    }
    return {
      listData: {}, // 列表数据
      listLoading: false,
      eidosList: [],
      ruleForm: {}, // 表单需要数据
      rules: {
        miningMachineId: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        periodOrdinal: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        totalEosNum: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        unitEosNum: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        threadNum: [
          { required: true, validator: validatePass, trigger: 'blur' }
        ],
        unitPrice: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        subject: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        subscribeLimitNum: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ],
        expiredSecond: [
          { required: true, message: '改项不能为空', trigger: 'blur' }
        ]
      } // rules
    }
  },
  computed: {
    isLook () {
      return this.$route.query.type == 2
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      if (to.query.type == 0) {
        to.meta.title = '新增产品'
      } else if (to.query.type == 1) {
        to.meta.title = '编辑产品'
      } else {
        to.meta.title = '查看产品详情'
      }
    })
  },
  watch: {
  },
  async created () {
    const result = await eidos.eidosAllList()
    console.log('result: ', result)
    if (result.code != 1000) {
      this.$message({
        message: result.message,
        duration: 2000
      })
      return
    }
    this.eidosList = result.data
    if (this.$route.query.id) {
      this.fetchData()
    }
  },
  methods: {
    /**
     * @description: 为避免饿了么组件交替显示时发生抖动，延迟触发某些操作
     * @methods: closeLoading cancelOperation
     * @param: none
     * @return: none
     */

    openLoading () {
      this.listLoading = true
    },

    closeLoading () {
      setTimeout(() => {
        this.listLoading = false
      }, 200)
    },

    cancelOperation () {
      setTimeout(() => {
        this.$message({
          message: '已取消操作',
          duration: 2000
        })
      }, 200)
    },

    async fetchData () {
      this.openLoading()
      const params = Object.assign({}, {
        id: this.$route.query.id
      })
      try {
        const res = await product.detailProduct(params)
        if (res.code === 1000) {
          this.ruleForm = res.data
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

    formatDate (now) {
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

    submitForm (formName) {
      console.log('this.ruleForm: ', this.ruleForm)
      // return
      this.$refs[formName].validate(async valid => {
        console.log('valid: ', valid)
        if (valid) {
          let res
          if (this.$route.query.type == 1) {
            res = await product.editProduct(this.ruleForm)
          } else {
            res = await product.addProduct(this.ruleForm)
          }
          if (res.code === 1000) {
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
          this.$router.back()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    } // 提交
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

