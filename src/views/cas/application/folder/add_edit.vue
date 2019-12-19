<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form-inline">
      <el-form-item label="上传应用Logo">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.logoPreview" :src="form.logoPreview" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag size="small">图标 建议尺寸 w:88px h:88px</el-tag>
      </el-form-item>

      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="form.appName" placeholder="请填写应用名称" />
      </el-form-item>

      <el-form-item label="appKey" prop="appKey">
        <el-input v-model="form.appKey" placeholder="请填写APPKey" />
      </el-form-item>

      <el-form-item label="IP白名单" prop="whiteIps">
        <el-input v-model="form.whiteIps" placeholder="请填写IP白名单" />
      </el-form-item>

      <el-form-item label="通知范围" prop="notifyScope">
        <el-input v-model="form.notifyScope" placeholder="请填写通知范围" />
      </el-form-item>

      <el-form-item label="通知地址" prop="notifyUrl">
        <el-input v-model="form.notifyUrl" placeholder="请填写通知地址" />
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
import { addCasApp, editCasApp } from '@/api/casModule'
export default {
  data() {
    return {
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      form: {}, // 表单内容
      rules: {
        appName: [
          { required: true, message: '请填写应用名称', trigger: 'blur' }
        ],
        appKey: [{ required: true, message: '请填写APPKey', trigger: 'blur' }],
        whiteIps: [
          { required: true, message: '请填写IP白名单', trigger: 'blur' }
        ],
        notifyScope: [
          { required: true, message: '请填写通知范围', trigger: 'blur' }
        ],
        notifyUrl: [
          { required: true, message: '请填写通知地址', trigger: 'blur' }
        ]
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
        this.form = Object.assign({}, this.form, query)

        let text = ''
        let state = query.style
        state == 'add' && (text = '添加')
        state == 'edit' && (text = '编辑')
        this.title = Object.assign({}, { state, text })
      }
    },

    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片的格式不符合要求!')
        this.imgLoading = false
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!')
        this.imgLoading = false
      }
      return isJPG && isLt2M
    },

    handleAvatarSuccess(res, file) {
      if (res.code == 1000) {
        this.form.logo = res.data.savePath // 后台需要字段
        this.form.logoPreview = res.data.previewPath // 前端展示字段
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
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
                : this.$notify.error({
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
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editCasApp(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.go(-1)
        })
      } else if (this.title.state == 'add') {
        addCasApp(params).then(v => {
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