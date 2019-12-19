<!--
 * @Description: find -> banner -> add_edit
 * @Author: wangyun
 * @Date: 2019-08-15 16:31:16
 * @LastEditTime: 2019-10-23 11:34:58
 -->

<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="demo-form-inline">
      <el-form-item label="启动页广告上传">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :before-upload="beforeAvatarUpload"
          :on-success="handleAvatarSuccess"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.resourcePreviewPath" :src="form.resourcePreviewPath" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag>banner建议尺寸 w:750px h:667px; 图片中的文字内容请尽量居中展示</el-tag>
      </el-form-item>

      <el-form-item label="启动页广告(英文版)上传">
        <el-upload
          v-loading="imgLoadingEn"
          :show-file-list="false"
          :before-upload="beforeAvatarEnUpload"
          :on-success="handleAvatarEnSuccess"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.resourceEnPreviewPath" :src="form.resourceEnPreviewPath" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag>banner建议尺寸 w:750px h:667px; 图片中的文字内容请尽量居中展示</el-tag>
      </el-form-item>

      <el-form-item label="跳转类型" prop="pathType">
        <el-select v-model="form.pathType" placeholder="请选择跳转类型">
          <el-option :label="'H5'" :value="'1'" />
          <el-option :label="'原生(Android/IOS)'" :value="'2'" />
        </el-select>
      </el-form-item>

      <el-form-item label="广告类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择广告类型">
          <el-option :label="'图片'" :value="'1'" />
          <el-option :label="'视频'" :value="'2'" />
        </el-select>
      </el-form-item>

      <el-form-item label="过期时间" prop="expireTime">
        <el-date-picker
          v-model="form.expireTime"
          type="datetime"
          placeholder="请选择过期时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          align="right"
        />
      </el-form-item>

      <el-form-item label="跳转地址" prop="path">
        <el-input v-model="form.path" placeholder="请选择跳转地址" />
      </el-form-item>

      <el-form-item label="显示时长" prop="duration">
        <el-input v-model="form.duration" placeholder="请选择显示时长" type="number" min="1" step="1" />
      </el-form-item>

      <el-form-item label="当日几次后不再显示" prop="silent">
        <el-input v-model="form.silent" placeholder="请选择当日几次后不再显示" type="number" min="1" step="1" />
      </el-form-item>

      <el-form-item label="是否允许跳过" prop="allowSkip">
        <el-switch v-model="form.allowSkip" active-color="#13ce66" inactive-color="#ff4949" />
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
import { getDappList } from '@/api/findModule/dapp'
import { addAdvert, editAdvert } from '@/api/walletTolModule/launch'
export default {
  data() {
    var checkGreaterThanZero = (rule, value, callback) => {
      const Rex = /^([0-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
      if (!value && value != 0) {
        return callback(new Error('请填入数据'))
      } else {
        if (!Rex.test(value)) {
          return callback(new Error('数据必须是数字值且不能小于0'))
        } else {
          callback()
        }
      }
    }
    return {
      ruleForm: { type: 3 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      imgLoadingEn: false,
      form: {
        imagePath: '', // 后台需要字段
        resourcePreviewPath: '', // 前端展示字段
        pathType: '1', // 跳转方式(默认1)
        expireTime: '',
        silent: 1 // 排序(默认0)
      }, // 表单内容

      dappList: [],
      queryList: {
        pageNum: 1,
        pageSize: 5,
        s_LIKE_appName: '' // DApp名字模糊搜索
      },

      rules: {
        pathType: [
          { required: true, message: '请选择跳转类型', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择广告类型', trigger: 'change' }
        ],
        expireTime: [
          { required: true, message: '请选择过期时间', trigger: 'change' }
        ],
        path: [{ required: true, message: '请填入跳转地址', trigger: 'blur' }],
        silent: [
          { required: true, validator: checkGreaterThanZero, trigger: 'blur' }
        ],
        duration: [
          { required: true, validator: checkGreaterThanZero, trigger: 'blur' }
        ]
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
  watch: {
    actionChange(val, oldVal) {
      val == '2' && this.fetchData()
    },
    keyWordsListen(val, oldVal) {
      val == '' && this.fetchData()
    }
  },
  created() {
    if (this.$route.query) {
      let query = this.$route.query
      let pathType = query.pathType
      let type = query.type
      if (typeof pathType !== 'string') {
        pathType = JSON.stringify(pathType)
      }
      if (typeof type !== 'string') {
        type = JSON.stringify(type)
      }

      this.form = Object.assign({}, query, { pathType, type })
      console.log('this.form: ', this.form)

      let text = ''
      let state = query.style
      state == 'add' && (text = '添加')
      state == 'edit' && (text = '编辑')
      this.title = Object.assign({}, { state, text })
    }
  },

  methods: {
    async fetchData() {
      try {
        let res = await getDappList(this.queryList)

        if (res.code === 1000) {
          this.dappList = res.data.list
          console.log('this.dappList: ', this.dappList)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    }, // fetchData

    search() {
      this.fetchData()
    },

    choose(item) {
      console.log('item: ', item)
      this.form.actionData = item.id
      this.form.title = item.appName
      this.form.description = item.description
    },

    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      //   this.imgLoading = false
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading = false
      }
      return isJPG && isLt2M
    },

    handleAvatarSuccess(res, file) {
      if (res.code == 1000) {
        this.form.resourcePath = res.data.savePath // 后台需要字段
        this.form.resourcePreviewPath = res.data.previewPath // 前端展示字段
        console.log('this.form: ', this.form)
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    },

    beforeAvatarEnUpload(file) {
      this.imgLoadingEn = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!')
      //   this.imgLoadingEn = false
      // }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoadingEn = false
      }
      return isJPG && isLt2M
    },

    handleAvatarEnSuccess(res, file) {
      if (res.code == 1000) {
        this.form.resourceEnPath = res.data.savePath // 后台需要字段
        this.form.resourceEnPreviewPath = res.data.previewPath // 前端展示字段
        this.imgLoadingEn = false
        this.$message.success('上传成功')
      } else {
        this.imgLoadingEn = false
        this.$message.error('上传失败')
      }
    },

    submitForm(formName) {
      if (!this.form.resourcePath) {
        this.$message.error('小老弟，上传一下启动页广告哈！')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`是否进行【${this.title.text}】?`, '提示', {
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
      let allowSkip = this.form.allowSkip ? 1 : 0
      let params = Object.assign({}, this.form, { allowSkip })
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editAdvert(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/launch/advert/advert-list'
          })
        })
      } else if (this.title.state == 'add') {
        addAdvert(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/launch/advert/advert-list'
          })
        })
      }
    }, // 发送前的处理

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // resetForm
  }
}
</script>
<style scoped>
.dappList {
  max-height: 300px;
  overflow: auto;
}


.avatar-uploader-icon {
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.avatar-uploader .el-upload {
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 250px;
  display: block;
}

.el-input {
  width: 500px;
}

.dappList .el-input {
  width: 170px;
}

.loadmore {
  text-align: center;
  padding: 20px;
  font-size: 12px;
  color: rgb(185, 185, 185);
  cursor: pointer;
}
</style>