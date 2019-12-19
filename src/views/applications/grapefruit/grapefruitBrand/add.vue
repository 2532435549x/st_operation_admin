<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-10-23 10:08:21
 * @LastEditors: wangyun
 -->

<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="150px" class="demo-ruleForm">
      <el-form-item v-if="form.id" label="商品ID">
        <el-input v-model="form.id" readonly />
      </el-form-item>

      <el-form-item label="品牌商名称">
        <el-input v-model="form.name" />
      </el-form-item>

      <el-form-item label="品牌商简介">
        <el-input v-model="form.description" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="form.sortOrder" />
      </el-form-item>

      <el-form-item label="品牌商的商品低价">
        <el-input v-model="form.floorPrice" />
      </el-form-item>

      <el-form-item label="品牌商页的品牌商图片">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :http-request="upLoad"
          class="avatar-uploader"
          action="/file/uploadImages"
        >
          <img v-if="form.picUrl" :src="form.picUrl" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="cancel('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { goodsDelete, brandDetail, uploadImage, brandEdit, brandAdd } from '@/api/grapefruit/grapefruitlist'
import VueUeditorWrap from 'vue-ueditor-wrap'
export default {
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      imageUrl: '',
      listLoading: true,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      form: {
      },
      guige: {},
      rules: {
        nodeName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        nodeUrl: [
          { required: true, message: '请输入分类英文名', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ]
      }// rr
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  watch: {
  },
  created() {
    console.log(this.$route)
    this.$route.meta.title = this.$route.query.style == 0 ? '添加商品' : '新增商品'
    if (this.$route.query.style == 0) {
      this.fetchData()
    }
  },
  methods: {
    async submitForm() {
      console.log(this.form)
      // return
      if (this.$route.query.style == 0) {
        delete this.form.createTime
        const result = await brandEdit(this.form)
        console.log('result: ', result)
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
        }
        this.fetchData()
      } else {
        const result = await brandAdd(this.form)
        console.log('result: ', result)
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '添加成功!'
          })
          this.$router.replace('/applications/grapefruit/grapefruit-brand')
        }
      }
    },
    upLoad(file) {
      console.log('xcq')
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('type', 4)
      uploadImage(formData).then(data => {
        // this.form.picUrl = data.previewPath
        this.$set(this.form, 'picUrl', data.data.previewPath)
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      })
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      brandDetail({ id: params }).then(response => {
        this.form = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    } // fetchData
  }
}
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>

