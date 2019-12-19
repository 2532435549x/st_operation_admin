<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form-inline">

      <el-form-item label="链名称" prop="name">
        <el-input
          v-model="form.name"
          type="text"
          placeholder="请填写链名称"
        />
      </el-form-item>

      <el-form-item label="链描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{maxRows: 5}"
          placeholder="请填写链描述"
        />
      </el-form-item>

      <el-form-item label="状态管理" prop="status">
        <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
      </el-form-item>
      <br />

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表单处理 -->
  </div>
</template>
<script>
import { addChain, editChain } from '@/api/walletTolModule/chain'
export default {
  data() {
    return {
      form: {}, // 表单内容
      rules: {
        name: [{ required: true, message: '请填写链名称', trigger: 'blur' }],
        description: [{ required: true, message: '请填写链描述', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.initFetch()
  },
  methods: {
    initFetch() {
      if (this.$route.query) {
        let query = this.$route.query

        if (typeof query.type == 'string') {
          query.type = Number(query.type)
        }

        if (typeof query.status == 'string') {
          query.status = JSON.parse(query.status)
        }

        this.form = Object.assign({}, this.form, query)

        let text = ''
        let state = query.style
        state == 'add' && (text = '添加')
        state == 'edit' && (text = '编辑')
        this.title = Object.assign({}, { state, text })
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`是否进行【${this.title.text}】？`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              e == 'cancel'
                ? this.$notify.info({
                    title: '提示',
                    message: `已取消${this.title.text}`
                  })
                : this.$message.error({
                    title: '错误',
                    message: `${e}`
                  })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitHandler() {
      let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form }, { status })
      if (this.title.state === 'edit') {
        editChain(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.go(-1)
        })
      } else if (this.title.state == 'add') {
        addChain(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.go(-1)
        })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 重置
  }
}
</script>
<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 88px;
  height: 88px;
  line-height: 88px;
  text-align: center;
}

.avatar {
  width: 88px;
  display: block;
}

.el-input {
  width: 500px;
}
</style>