<!--
 * @Description: find -> collection -> detail
 * @Author: wangyun
 * @Date: 2019-08-21 11:02:06
 * @LastEditTime: 2019-08-21 15:57:46
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form label-width="200px">
        <el-form-item label="所属链：">{{ data.chainType }}</el-form-item>

        <el-form-item label="合集中文标题：">{{ data.name }}</el-form-item>
        <el-form-item label="合集英文标题：">{{ data.nameEn }}</el-form-item>

        <el-form-item label="合集中文简介：">{{ data.description }}</el-form-item>
        <el-form-item label="合集英文简介：">{{ data.descriptionEn }}</el-form-item>

        <el-form-item label="排序：">{{ data.sort }}</el-form-item>

        <el-form-item label="创建时间：">{{ data.createTime }}</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getCollectionDetail } from '@/api/findModule/collection'
export default {
  data() {
    return {
      value: 4.5,
      data: {}
    }
  },
  created() {
    if (this.$route.query.id) {
      getCollectionDetail({ id: this.$route.query.id }).then(v => {
        this.data = v.data
        console.log('this.data: ', this.data)
      })
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
i {
  font-size: 16px;
}
a:hover {
  color: #ff9900;
}

.dappList {
  height: 300px;
  overflow: auto;
}
.line {
  text-align: center;
}
.avatar-uploader {
  margin-bottom: 30px;
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
.avatar-uploader img {
  width: 200px;
  height: 200px;
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

