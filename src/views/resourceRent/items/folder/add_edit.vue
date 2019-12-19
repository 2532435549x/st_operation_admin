
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form-inline">
      <!-- <el-form-item label="id" v-if="form.style == 'edit'">
        <el-input v-model="form.id" disabled />
      </el-form-item>

      <el-form-item label="创建时间" v-if="form.style == 'edit'">
        <el-input v-model="form.createTime" disabled />
      </el-form-item> -->

      <el-form-item label="所属链" prop="chainType">
        <el-select v-model="form.chainType" placeholder="请选择所属链">
          <el-option
            v-for="(item, index) in chainTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="租赁类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择租赁项类型">
          <el-option
            v-for="(item, index) in rentTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写名称" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize placeholder="请填写描述" />
      </el-form-item>

      <el-form-item label="英文名称" prop="name">
        <el-input v-model="form.nameEn" placeholder="请填写英文名称" />
      </el-form-item>

      <el-form-item label="英文描述" prop="descriptionEn">
        <el-input v-model="form.descriptionEn" type="textarea" autosize placeholder="请填写英文描述" />
      </el-form-item>

      <el-form-item label="租赁可用天数" prop="availableDays">
        <el-input
          type="number"
          v-model="form.availableDays"
          @blur="checkNumberHandler(form.availableDays, 'availableDays')"
          placeholder="请填写可用天数"
          min="0"
          step="1"
        />
      </el-form-item>

      <el-form-item label="租赁EOS数量" prop="amount">
        <el-input
          type="number"
          v-model="form.amount"
          @blur="checkNumberHandler(form.amount, 'amount')"
          placeholder="请填写租赁EOS数量"
          min="0"
          step="1"
        />
      </el-form-item>

      <el-form-item
        label="支付金额"
        prop="availableDays"
        v-if="!(form.chainType == 'EOS' && form.type == 3)"
      >
        <el-input
          type="number"
          v-model="form.price"
          @blur="checkNumberHandler(form.price, 'price')"
          placeholder="请填写支付金额（备注：EOS链下的RAM支付金额不用填写 系统自动计算）"
          min="0"
        />
      </el-form-item>

      <el-form-item label="是否有效" prop="status" v-if="form.style == 'edit'">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getResourceItemList,
  getResourceItemDetail,
  addResourceItem,
  editResourceItem
} from '@/api/resourceRent/items'
export default {
  data() {
    return {
      form: {
        type: 1, // 默认'1: CPU'
        chainType: 'EOS' // 默认为'EOS'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空' }],

        description: [{ required: true, message: '描述不能为空' }],

        nameEn: [{ required: true, message: '英文名称不能为空' }],

        descriptionEn: [{ required: true, message: '英文描述不能为空' }],

        availableDays: [{ required: true, message: '租赁可用天数不能为空' }],

        amount: [{ required: true, message: '租赁EOS数量不能为空' }],

        chainType: [
          { required: true, message: '请选择所属链', trigger: 'change' }
        ],
        type: [{ required: true, message: '请选择租赁类型', trigger: 'change' }]
      }
    }
  },
  computed: {
    eosAmount() {
      return this.form.amount
    }
  },
  watch: {
    eosAmount(val) {
      if (String(val).match(/\d{0,8}(\.\d{0,4})?/)) {
        this.form.amount = String(val).match(/\d{0,8}(\.\d{0,4})?/)[0]
      }
    }
  },
  created() {
    if (this.$route.query) {
      this.form = Object.assign({}, this.form, this.$route.query)
      if (this.$route.query.id) {
        getResourceItemDetail({ id: this.$route.query.id }).then(v => {
          v.data.amount = Number(v.data.amount).toFixed(4)
          this.form = Object.assign({}, this.form, v.data)
        })
      }
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `是否进行【${
              this.$route.query.style == 'add' ? '添加' : '编辑'
            }】操作?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              console.log('e: ', e)
            })
        } else {
          this.$message.error('大哥，请填写完整表单！')
          return false
        }
      })
    }, // 表单验证

    submitHandler() {
      this.form.amount = parseFloat(this.form.amount).toFixed(4)
      let params = Object.assign({}, this.form)
      if (this.form.style == 'add') {
        addResourceItem(params)
          .then(v => {
            this.$notify({
              title: '成功',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}成功`,
              type: 'success'
            })
            this.$router.push({
              path: '/resourceRent/items/items-list'
            })
          })
          .catch(e => {
            console.log('e: ', e)
          })
      } else if (this.form.style == 'edit') {
        editResourceItem(params)
          .then(v => {
            this.$notify({
              title: '成功',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}成功`,
              type: 'success'
            })
            this.$router.push({
              path: '/resourceRent/items/items-list'
            })
          })
          .catch(e => {
            console.log('e: ', e)
          })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 表单重置
  }
}
</script>

<style scoped>
.el-input {
  width: 600px;
}
</style>

