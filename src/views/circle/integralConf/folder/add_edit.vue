<!--
 * @Description: find -> integral -> add_edit
 * @Author: wangyun
 * @Date: 2019-08-15 16:31:16
 * @LastEditTime: 2019-11-15 22:45:26
 -->

<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="demo-form-inline">
      <el-form-item label="积分icon上传">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.iconPreview" :src="form.iconPreview" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag size="small">图标 建议尺寸 w:88px h:88px</el-tag>
      </el-form-item>

      <el-form-item label="积分名" prop="name">
        <el-input v-model="form.name" placeholder="请填写积分名称" />
      </el-form-item>

      <el-form-item label="循环类型" prop="loopType">
        <el-select v-model="form.loopType" placeholder="请选择循环类型">
          <el-option
            v-for="(item, index) in loopTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="奖励次数" prop="rewardNum">
        <el-input
          v-model="form.rewardNum"
          type="number"
          @blur="checkNumberHandler(form.rewardNum, 'rewardNum')"
          placeholder="填写奖励次数"
        />
      </el-form-item>

      <el-form-item label="奖励积分" prop="rewardScore">
        <el-input
          v-model="form.rewardScore"
          type="number"
          @blur="checkNumberHandler(form.rewardScore, 'rewardScore')"
          placeholder="请填写奖励积分"
        />
      </el-form-item>

      <el-form-item label="识别功能代码" prop="code">
        <el-input v-model="form.code" placeholder="填写识别功能代码" />
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
import { addIntegralConf, editIntegralConf } from '@/api/circleModule/integral'
export default {
  data() {
    return {
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      form: {
        icon: '', // 后台需要字段
        iconPreview: '', // 前端展示字段
        name: '',
        rewardNum: 0,
        rewardScore: 0,
        code: '',
        loopType: 1 //(默认不循环)
      }, // 表单内容

      loopTypeOptions: [
        { label: '不循环', value: 1 },
        { label: '每天', value: 2 },
        { label: '每周', value: 3 },
        { label: '每月', value: 4 }
      ],
      rules: {
        name: [{ required: true, message: '请填写积分名称', trigger: 'blur' }],
        code: [
          { required: true, message: '填写识别功能代码', trigger: 'blur' }
        ],
        loopType: [
          { required: true, message: '请选择循环类型', trigger: 'change' }
        ],
        rewardNum: [
          { required: true, message: '填写奖励次数', trigger: 'blur' }
        ],
        rewardScore: [
          { required: true, message: '请填写奖励积分', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    if (this.$route.query) {
      let query = this.$route.query
      if (typeof query.loopType === 'string') {
        query.loopType = Number(query.loopType)
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
        this.form.icon = res.data.savePath // 后台需要字段
        this.form.iconPreview = res.data.previewPath // 前端展示字段
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    },

    submitForm(formName) {
      return this.$message.warning('此功能关系重大，暂时关闭')

      if (!this.form.icon) {
        this.$message.error('小老弟，上传一下积分logo哈！')
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
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editIntegralConf(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/circle/integral/integral-list'
          })
        })
      } else if (this.title.state == 'add') {
        addIntegralConf(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/circle/integral/integral-list'
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