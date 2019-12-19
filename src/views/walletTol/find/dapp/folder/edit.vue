<template>
  <div class="app-container">
    <!-- <el-popover
      placement="top-start"
      width="200"
      trigger="hover"
      content=""
    >
      <i slot="reference" class="el-icon-info" />
    </el-popover>-->
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="demo-form-inline">
      <el-form-item label="DApp图标">
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
        <el-tag size="small">DApp图标 建议尺寸 w:80px h:80px</el-tag>
      </el-form-item>

      <el-form-item label="DApp名称" prop="appName">
        <el-input v-model="form.appName" placeholder="请填写DApp名称" />
      </el-form-item>

      <el-form-item label="DApp关键词" prop="cateIndex">
        <el-input v-model="form.cateIndex" placeholder="请填写DApp关键词" />
      </el-form-item>

      <el-form-item label="DApp描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{minRows: 2, maxRow: 5}"
          placeholder="请填写DApp描述"
        />
      </el-form-item>

      <el-form-item label="DApp内容说明" prop="context">
        <el-input
          v-model="form.context"
          type="textarea"
          :autosize="{minRows: 2, maxRow: 5}"
          placeholder="请填写DApp内容说明"
        />
      </el-form-item>

      <el-form-item label="DApp地址" prop="path">
        <el-input v-model="form.path" placeholder="请填写DApp地址" />
      </el-form-item>

      <el-form-item label="是否推荐" prop="recommend">
        <el-switch v-model="form.recommend" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item label="是否支持Android" prop="supportAndroid">
        <el-switch v-model="form.supportAndroid" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item label="是否支持Ios" prop="supportIos">
        <el-switch v-model="form.supportIos" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item label="是否官方应用" prop="isOfficial">
        <el-switch v-model="form.isOfficial" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item label="是否全屏应用" prop="hasFullScreen">
        <el-switch v-model="form.hasFullScreen" active-color="#13ce66" inactive-color="#ff4949" />
      </el-form-item>

      <el-form-item label="评分状态" prop="scoreStatus">
        <el-switch v-model="form.scoreStatus" inactive-text="关闭" active-text="开启" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { editDapp } from '@/api/findModule/dapp'
export default {
  data() {
    return {
      ruleForm: { type: 5 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐 5DApp logo
      imgLoading: false, // 图片上传加载
      form: {},
      rules: {
        appName: [{ required: true, message: '请填写DApp名称' }],
        cateIndex: [
          { required: true, message: '请填写DApp关键词', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写DApp描述', trigger: 'blur' }
        ],
        context: [
          { required: true, message: '请填写DApp内容说明', trigger: 'blur' }
        ],
        path: [{ required: true, message: '请填写DApp地址', trigger: 'blur' }]
      }
    }
  },
  watch: {},
  created() {
    if (this.$route.query) {
      let query = this.$route.query
      let BooleanArr = [
        'recommend',
        'supportAndroid',
        'supportIos',
        'isOfficial',
        'hasFullScreen',
        'scoreStatus'
      ]
      BooleanArr.forEach(v => {
        if (query[v]) query[v] = JSON.parse(query[v])
      })
      this.form = Object.assign({}, this.form, query)
      console.log('this.form: ', this.form)
    }
  },

  methods: {
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
    }, // 文件上传成功时的钩子方法

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
    }, // 上传文件之前的钩子方法，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。

    submitForm(formName) {
      if (!this.form.logo) {
        this.$message.error('小老弟，你图标都不上传，我很难办啊！')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将【${
              this.$route.query.style == 'add' ? '添加' : '编辑'
            }】该DApp, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定了',
              cancelButtonText: '再想想',
              type: 'warning'
            }
          )
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              this.$notify({
                type: 'info',
                title: '提示',
                message: `已取消${
                  this.$route.query.style == 'add' ? '添加' : '编辑'
                }`
              })
            })
        } else {
          this.$message.error('小老弟，请填写完整表单')
          return false
        }
      })
    }, // 表单验证

    submitHandler() {
      let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form }, { status })
      console.log('params: ', params)
      if (this.$route.query.style == 'edit') {
        editDapp(params).then(v => {
          if (v.code == 1000) {
            this.$notify({
              title: '提示',
              message: '编辑成功',
              type: 'success'
            })
            this.$router.push({
              path: '/walletTol/find/dapp/dapp-list'
            })
          }
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  transition: all 0.4s ease;
}

.avatar-uploader img {
  width: 80px;
}

.el-input {
  width: 500px;
}
</style>
