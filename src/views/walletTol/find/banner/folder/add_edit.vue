<!--
 * @Description: find -> banner -> add_edit
 * @Author: wangyun
 * @Date: 2019-08-15 16:31:16
 * @LastEditTime: 2019-11-28 16:53:11
 -->

<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="demo-form-inline">
      <el-form-item label="banner图片上传">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.previewPath" :src="form.previewPath" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag size="small">banner 建议尺寸 w:750px h:490px</el-tag>
      </el-form-item>

      <el-form-item label="banner图片(EN)上传">
        <el-upload
          v-loading="imgLoadingEn"
          :show-file-list="false"
          :on-success="handleAvatarSuccessEn"
          :before-upload="beforeAvatarUploadEn"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.previewPathEn" :src="form.previewPathEn" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <el-tag size="small">banner 建议尺寸 w:750px h:490px</el-tag>
      </el-form-item>

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

      <el-form-item label="跳转方式" prop="actionType">
        <el-select v-model="form.actionType">
          <el-option :label="'1: 网页链接'" :value="'1'" />
          <el-option :label="'2: DAppId'" :value="'2'" />
        </el-select>
        <el-popover
          placement="top-start"
          width="300"
          trigger="hover"
          title="跳转方式解释"
          content="跳转方式为1:网页链接时 自己输入网页地址,跳转方式为2:DAppId时 在DApp列表里搜索DApp,选中后将自动填入DAppId"
        >
          <i slot="reference" class="el-icon-info" />
        </el-popover>
      </el-form-item>

      <el-form-item :label="form.actionType == '1' ? '网页链接地址' : 'DAppId'" prop="actionData">
        <el-input
          v-model="form.actionData"
          :type="form.actionType == '2' ? 'number': 'text'"
          placeholder="操作类型为1填写网页地址，操作类型为2填写dapp Id(数字)"
        />
        <el-popover v-if="form.actionType == '2'" placement="right-start" width="300" height="200">
          <div class="dappList">
            <el-form-item align="center">
              <el-input
                v-model="queryList.s_LIKE_appName"
                @keyup.enter.native="search"
                placeholder="请输入DApp名称"
              ></el-input>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>

            <el-table :data="dappList" max-height="300">
              <el-table-column width="80" label="Logo" fixed align="center">
                <template slot-scope="scope">
                  <img
                    :src="scope.row.logoPreview"
                    width="50"
                    @click="choose(scope.row)"
                    class="pointDiv"
                  />
                </template>
              </el-table-column>

              <el-table-column width="150" label="DApp名称" fixed align="center">
                <template slot-scope="scope">
                  <div @click="choose(scope.row)" class="pointDiv">{{scope.row.appName}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button slot="reference" type="primary" plain>点击查看贴心的DApp列表</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="banner标题" prop="title">
        <el-input v-model="form.title" placeholder="请填写banner中文名称" />
      </el-form-item>
      <el-form-item label="banner描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize placeholder="填写Banner描述" />
      </el-form-item>

      <el-form-item label="banner标题(EN)" prop="titleEn">
        <el-input v-model="form.titleEn" placeholder="请填写banner英文名称" />
      </el-form-item>

      <el-form-item label="banner描述(EN)" prop="descriptionEn">
        <el-input v-model="form.descriptionEn" type="textarea" autosize placeholder="填写Banner英文描述" />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input
          v-model="form.sort"
          type="number"
          min="0"
          step="1"
          placeholder="请填入排序,数字越大越靠前(默认为0)"
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
import { getDappList } from '@/api/findModule/dapp'
import {
  getBannerList,
  addBanner,
  editBanner,
  deleteBanner
} from '@/api/findModule/banner'
export default {
  data() {
    return {
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      imgLoadingEn: false,
      form: {
        imagePath: '', // 后台需要字段
        imagePathEn: '',
        previewPath: '', // 前端展示字段
        previewPathEn: '',
        chainType: 'EOS', // 所属链类型(默认EOS)
        actionType: '1', // 跳转方式(默认1)
        actionData: '', // 跳转数据(链接/appid)
        title: '', // 标题
        titleEn: '',
        description: '', // 描述
        descriptionEn: '',
        createTime: '', // 创建时间
        sort: 0 // 排序(默认0)
      }, // 表单内容

      dappList: [],
      queryList: {
        pageNum: 1,
        pageSize: 5,
        s_EQ_status: 2,
        s_EQ_auditStatus: 2,
        s_LIKE_appName: '' // DApp名字模糊搜索
      },

      rules: {
        chainType: [
          { required: true, message: '请选择所属链', trigger: 'change' }
        ],
        actionType: [
          { required: true, message: '请选择跳转方式', trigger: 'change' }
        ],
        sort: [{ required: true, message: '请填入排序', trigger: 'blur' }],
        actionData: [
          { required: true, message: '请填写操作类型数据', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '请填写banner中文标题', trigger: 'blur' }
        ],
        titleEn: [
          { required: true, message: '请填写banner英文标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写banner中文描述', trigger: 'blur' }
        ],
        descriptionEn: [
          { required: true, message: '请填写banner英文描述', trigger: 'blur' }
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
      this.form = Object.assign({}, this.form, query)

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

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        this.imgLoading = false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading = false
      }
      return isJPG && isLt2M
    },

    beforeAvatarUploadEn(file) {
      this.imgLoadingEn = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        this.imgLoadingEn = false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoadingEn = false
      }
      return isJPG && isLt2M
    },

    handleAvatarSuccess(res, file) {
      if (res.code == 1000) {
        this.form.imagePath = res.data.savePath // 后台需要字段
        this.form.previewPath = res.data.previewPath // 前端展示字段
        console.log('this.form: ', this.form)
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    },

    handleAvatarSuccessEn(res, file) {
      if (res.code == 1000) {
        this.form.imagePathEn = res.data.savePath // 后台需要字段
        this.form.previewPathEn = res.data.previewPath // 前端展示字段
        console.log('this.form: ', this.form)
        this.imgLoadingEn = false
        this.$message.success('上传成功')
      } else {
        this.imgLoadingEn = false
        this.$message.error('上传失败')
      }
    },

    submitForm(formName) {
      if (!this.form.imagePath) {
        this.$message.error('小老弟，上传一下中文banner图片哈！')
        return false
      }

      if (!this.form.imagePathEn) {
        this.$message.error('小老弟，上传一下英文banner图片哈！')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将【${this.title.text}】该banner, 是否继续?`,
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
      // let createTime = this.form.createTime.replace(/\s*/g, '')
      let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form }, { status })
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editBanner(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/find/banner/banner-list'
          })
        })
      } else if (this.title.state == 'add') {
        addBanner(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/find/banner/banner-list'
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
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 375px;
  display: block;
}

.el-input {
  width: 500px;
}

.dappList .el-input {
  width: 170px;
}
</style>