<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-20 10:41:29
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="150px" class="demo-ruleForm">
      <!-- <el-form-item v-if="form.id" label="分类ID">
        <el-input v-model="form.id" readonly />
      </el-form-item>-->

      <el-form-item label="类目名称" required>
        <el-input v-model="form.name" @blur="onblur('name')" />
      </el-form-item>

      <el-form-item label="分类等级" required>
        <el-select v-model="form.level" placeholder="请选择分类等级">
          <el-option label="L1" value="L1" />
          <el-option label="L2" value="L2" />
        </el-select>
      </el-form-item>

      <el-form-item v-if="form.level=='L2' " label="父类" required>
        <el-select v-model="form.pid" placeholder="请选择父类目ID">
          <el-option v-for="item in list1" :key="item.value" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>

      <el-form-item label="类目关键字">
        <el-input v-model="form.keywords" />
      </el-form-item>

      <el-form-item label="类目广告语介绍">
        <el-input v-model="form.description" @blur="onblur('description')" />
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="form.sortOrder" @blur="onblur('sortOrder')" />
      </el-form-item>

      <el-form-item label="类目图标">
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
import { categoryAdd, categoryList1, categoryDetail, uploadImage } from '@/api/grapefruit/grapefruitlist'
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
      list1: [],
      guige: {}
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  watch: {
  },
  async created() {
    this.list1 = (await categoryList1()).data
    this.$route.meta.title = this.$route.query.style == 0 ? '添加商品' : '新增商品'
    if (this.$route.query.style == 0) {
      this.fetchData()
    }
  },
  methods: {
    async submitForm() {
      if ((!this.form.name || !this.form.level) || (this.form.level == 'L2' && !this.form.pid)) {
        this.$message({
          type: 'success',
          message: '请将带有 * 开头得填写完整！'
        })
        return
      }
      // return
      if (this.$route.query.style == 0) {
        delete this.form.updateTime
        delete this.form.createTime

        const result = await categoryAdd(this.form)
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '编辑成功!'
          })
          this.$router.replace('/applications/grapefruit/grapefruit-grapefruitCategory')
        } else {
          this.$message({
            type: 'info',
            message: result.message
          })
          this.fetchData()
        }
      } else {
        const result = await categoryAdd(this.form)
        console.log('result: ', result)
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '添加成功成功!'
          })
          this.$router.replace('/applications/grapefruit/grapefruit-grapefruitCategory')
        } else {
          this.$message({
            type: 'info',
            message: result.message
          })
        }
      }
    },
    upLoad(file) {
      console.log('xcq')
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('type', 4)
      uploadImage(formData).then(res => res.data)
        .then(data => {
          // this.form.picUrl = data.previewPath
          this.$set(this.form, 'picUrl', data.previewPath)
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
        this.$message.error('上传图片大小不能超过 2MB!')
      }
      return isLt2M
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      categoryDetail({ id: params }).then(response => {
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

