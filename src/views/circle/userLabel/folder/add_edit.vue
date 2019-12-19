<!--
 * @Description: circle -> userLabel -> add_edit
 * @Author: wangyun
 * @Date: 2019-11-14 18:15:30
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-15 22:44:41
 -->
<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="demo-form-inline">
      <el-form-item label="图标icon上传">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.previewIcon" :src="form.previewIcon" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag size="small">图标 建议尺寸 w:88px h:88px</el-tag>
      </el-form-item>

      <el-form-item label="标签名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写标签名称" />
      </el-form-item>

      <el-form-item label="标签名称(EN)" prop="nameEn">
        <el-input v-model="form.nameEn" placeholder="请填写标签名称(EN)" />
      </el-form-item>

      <el-form-item label="标签背景色" prop="backgroundColor">
        <el-input v-model="form.backgroundColor" placeholder="请填写标签背景色" />
      </el-form-item>

      <el-form-item label="文字颜色(16进制)" prop="textColor">
        <el-input v-model="form.textColor" placeholder="请填写文字颜色(16进制)" />
      </el-form-item>

      <el-form-item label="线条颜色(16进制)" prop="lineColor">
        <el-input v-model="form.lineColor" placeholder="请填写线条颜色(16进制)" />
      </el-form-item>

      <el-form-item label="标签类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择标签类型">
          <el-option :label="'系统标签'" :value="1"></el-option>
          <el-option :label="'等级标签'" :value="2"></el-option>
          <el-option :label="'自定义标签'" :value="3"></el-option>
        </el-select>
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
import { addUserLabel, editUserLabel } from '@/api/circleModule/userLabel'
export default {
  data() {
    return {
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      form: {
        icon: '', // 后台需要字段
        previewIcon: '' // 前端展示字段
      }, // 表单内容

      rules: {
        name: [{ required: true, message: '请请填写标签名称' }],
        nameEn: [{ required: true, message: '请填写标签英文名称' }],
        backgroundColor: [{ required: true, message: '请填写标签背景色' }],
        textColor: [{ required: true, message: '请填写文字颜色(16进制)' }],
        lineColor: [{ required: true, message: '请填写线条颜色(16进制)' }],
        type: [{ required: true, message: '请选择标签类型', trigger: 'change' }]
      }
    }
  },
  computed: {
    actionChange() {
      return this.form.actionType
    },
    keyWordsListen() {
      return this.queryList.s_LIKE_appName
    }
  },
  created() {
    if (this.$route.query) {
      let query = this.$route.query
      if (typeof query.type === 'string') {
        query.type = Number(query.type)
      }
      this.form = Object.assign({}, this.form, query)

      let text = ''
      let state = query.style
      state == 'add' && (text = '添加')
      state == 'edit' && (text = '编辑')
      this.title = Object.assign({}, { state, text })
    }
  },

  methods: {
    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传图片的格式不符合要求')
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
        this.form.icon = res.data.savePath // 后台需要字段
        this.form.previewIcon = res.data.previewPath // 前端展示字段
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    },

    submitForm(formName) {
      if (!this.form.icon) {
        this.$message.error('小老弟，上传一下图标logo哈！')
        return false
      }

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
      if (this.title.state === 'edit') {
        editUserLabel(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/circle/userLabel/userLabel-list'
          })
        })
      } else if (this.title.state == 'add') {
        addUserLabel(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/circle/userLabel/userLabel-list'
          })
        })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 重置
  }
}
</script>
<style lang="scss" scoped>
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
  width: 400px;
}
</style>