<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-form-inline">
      <el-form-item label="推文类型" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio :disabled="editType" label="1">图片推文</el-radio>
          <el-radio :disabled="editType" label="2">app滚动图片推文</el-radio>
          <el-radio :disabled="editType" label="3">app列表推文</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="支持语言">
        <el-checkbox-group v-model="languageArr">
          <el-checkbox label="10000001" disabled border>中文</el-checkbox>
          <el-checkbox label="10000002" border>英文</el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item v-if="form.type == 1" label="封面图片">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="{type:1}"
          class="avatar-uploader"
          v-loading="imgLoading"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="bannerPreviewPath" :src="bannerPreviewPath" class="avatar" >
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-form-item>

      <el-form-item label="推文标题" prop="title">
        <el-input v-model="form.title" />
      </el-form-item>

      <el-form-item v-if="Language_EN" label="推文标题(英文)" class="Language_EN">
        <el-input v-model="tweetLanguageList[0].title" />
      </el-form-item>

      <el-form-item label="推文子标题" prop="subtitle">
        <el-input v-model="form.subtitle" />
      </el-form-item>

      <el-form-item v-if="Language_EN" label="推文子标题(英文)" class="Language_EN">
        <el-input v-model="tweetLanguageList[0].subtitle" />
      </el-form-item>

      <el-form-item label="推文描述" prop="description">
        <el-input v-model="form.description" />
      </el-form-item>

      <el-form-item v-if="Language_EN" label="推文描述(英文)" class="Language_EN">
        <el-input v-model="tweetLanguageList[0].description" />
      </el-form-item>

      <el-form-item label="推文富文本">
        <vue-ueditor-wrap v-model="form.content" :config="myConfig" />
      </el-form-item>

      <el-form-item v-if="Language_EN" label="推文富文本(英文)" class="Language_EN">
        <vue-ueditor-wrap v-model="tweetLanguageList[0].content" :config="myConfig" />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" placeholder="填入排序，数字越大越靠前（选填）" />
      </el-form-item>

      <el-form-item label="是否置顶" prop="top">
        <el-switch v-model="form.top" inactive-text="开启" />
      </el-form-item>

      <el-form-item label="所属链" prop="chainTypes">
        <el-checkbox-group v-model="form.chainTypes">
          <el-checkbox label="EOS" name="EOS" border />
          <el-checkbox label="BOS" name="BOS" border />
          <el-checkbox label="MEETONE" name="MEETONE" border />
        </el-checkbox-group>
      </el-form-item>

      <el-form-item
        v-loading=" appList.length ? false : true "
        v-if="!editType"
        label="关联dapp"
        prop="tweetAppList"
      >
        <el-transfer
          :filter-method="filterMethod"
          v-model="transferValue"
          :titles="['dapp列表', '已选dapp']"
          :data="appList"
          filterable
          filter-placeholder="请输入dapp名称"
          @change="transferChange"
        >
          <el-button
            slot="left-footer"
            style="margin-left:10px;"
            size="small"
            @click="getAppList()"
          >加载更多</el-button>
        </el-transfer>
      </el-form-item>

      <div v-if="editType" class="dappBox Language_EN">
        <el-row>
          <el-col :span="12">
            <div class="title" style="margin-bottom:20px;">关联dapp</div>
          </el-col>
          <el-col :span="12">
            <div style="margin-bottom:20px;text-align:right;">
              <el-button type="primary" plain @click="eidtDapp">编辑dapp</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table :data="form.tweetAppList" style="width: 100%">
          <el-table-column prop="appId" label="id" width="100px" />

          <el-table-column prop="appName" label="名称" />

          <el-table-column label="图标" width="180px">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt srcset class="appLogo" >
            </template>
          </el-table-column>

          <el-table-column prop="sort" label="排序" width="60px" />

          <el-table-column align="center" prop="created_at" label="操作" width="230">
            <template slot-scope="scope">
              <el-button type="primary" size="small">移除</el-button>
              <el-button type="primary" plain size="small">详情</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- dappBox -->

      <el-form-item v-if="dappRes.length && form.type == 2" label="滚动图片生成" prop="tweetAppList">
        <img
          v-for="(item,index) in dappRes"
          :src="item.logo"
          :key="index"
          class="logoItem"
          alt
          srcset
        >
      </el-form-item>

      <div v-if="editType" />

      <el-form-item v-if="editType && !dappRes.length" label="封面图片">
        <img :src="form.bannerUrl" class="bannerUrl" alt >
      </el-form-item>

      <br >
      <el-form-item>
        <el-button v-loading="submitStatue" type="primary" @click="submitForm('form')">
          <span v-if="editType">完成编辑</span>
          <span v-else>创建推文</span>
        </el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import VueUeditorWrap from 'vue-ueditor-wrap'
import { addTweet, getAppList, getTweetDetail, editTweet } from '@/api/find'
import { htmlContent } from '../../utils/common'
export default {
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      myConfig: {
        autoHeightEnabled: false,
        initialFrameHeight: 240,
        initialFrameWidth: '100%',
        serverUrl: '/apiUrl/api/common/ue/uploadImage', // 'http://35.201.165.105:8000/controller.php',
        UEDITOR_HOME_URL: '/static/UEditor/'
      },
      imageUrl: '',
      bannerPreviewPath: '', // banner预览图
      appList: [], // dapp列表
      imgLoading: false, // 图片上传加载
      page: '', // 返回列表页码
      chainTypeArr: [], // 网络类型
      form: {
        type: '1', // 推文类型(1: 图片推文, 2: APP滚动图片推文, 3:APP列表推文)
        bannerUrl: '', // banner地址，类型为1,2时有效
        title: '', // 标题
        subtitle: '', // 子标题
        description: '', // 描述
        content: '', // 内容
        sort: '', // 排序
        top: false, // 是否置顶
        tweetAppList: [], // 推文APP列表
        bannerAppIds: [], // Banner APP图片生成的APPID列表，当type类型为2时有效，最少需要传入12个
        chainTypes: ['EOS']// 推文支持的链类型列表
      },
      languageArr: ['10000001'],
      Language_EN: false, // 英文开启状态
      tweetLanguageList: [{// 英文扩展信息
        languageId: 10000002,
        title: '',
        subtitle: '',
        description: '',
        content: ''
      }], // 推文语言数据列表
      editType: false, // 编辑状态
      rules: {
        type: [{ required: true, message: '请选择类型', trigger: 'blur' }],
        bannerUrl: [{ required: true, message: '上传banner地址', trigger: 'blur' }],
        title: [{ required: true, message: '填写标题', trigger: 'blur' }],
        subtitle: [{ required: true, message: '填写副标题', trigger: 'blur' }],
        description: [{ required: true, message: '填写描述', trigger: 'blur' }],
        content: [{ required: true, message: '填写富文本内容', trigger: 'blur' }],
        tweetAppList: [{ required: true, message: '选择推文关联的dapp', trigger: 'blur' }],
        bannerAppIds: [{ required: true, message: '选择dapp的图标', trigger: 'blur' }],
        chainTypes: [{ required: true, message: '选择链类型', trigger: 'blur' }],
        tweetLanguageList: [{ required: true, message: '请选择类型', trigger: 'blur' }]
      },
      transferValue: [], // 穿梭机结果值
      dappRes: [], // dapp选择结果
      filterMethod(query, item) { // 本地查询dapp
        return item.appName.indexOf(query) > -1
      },
      qureyList: {
        pageNum: 0,
        pageSize: 100
      },
      submitStatue: false// 提交状态
    }
  },
  watch: {
    languageArr(v) {
      console.log(v)
      if (v.length == 2) { this.Language_EN = true } else { this.Language_EN = false }
    }
  },
  created() {
    this.getAppList()
    console.log(this.$route.query)
    if (this.$route.query.id) { // 编辑状态
      this.editType = true
      const params = {
        id: this.$route.query.id
      }
      getTweetDetail(params).then(v => {
        const { data } = v

        data.type = data.type.toString()
        data.chainTypes = data.chainTypes.split(',')
        if (data.tweetLanguageList.length) { // 存在多语言
          this.languageArr = ['10000001', '10000002']
          this.tweetLanguageList = data.tweetLanguageList
        }
        this.form = data
      })// getTweetDetail
    }
  },
  methods: {
    submitForm(formName) {
      /* if(!this.form.logo){
        this.$message.error('老弟，把logo先上传了！');
        return false;
      }*/

      this.$refs[formName].validate((valid) => {
        this.form.content = htmlContent(this.form.content)// 转html

        if (this.Language_EN) { // 存在英文模式
          this.form.tweetLanguageList = this.tweetLanguageList
          this.form.tweetLanguageList.content = htmlContent(this.form.tweetLanguageList.content)
        }

        if (valid) {
          this.submitStatue = true
          if (this.editType) { // 编辑状态
            this.form.id = this.$route.query.id
            editTweet(this.form).then(v => {
              console.log(v)
              this.$message.success(v.message)
              // this.$router.go(-1);
              this.submitStatue = false
            }).catch(e => {
              console.error(e)
              this.submitStatue = false
            })
          } else { // 新增模式
            addTweet(this.form).then(v => {
              console.log(v)
              this.$message.success(v.message)
              // this.$router.go(-1);
              this.submitStatue = false
            }).catch(e => {
              console.error(e)
              this.submitStatue = false
            })
          }// end if

          console.log(this.form)
        } else {
          this.$message.error('小老弟，请填写完整表单')
          console.log('error submit!!')
          return false
        }// end if
      })
    },
    eidtDapp() { // 编辑状态编辑dapp
      this.$message.error('正在做...')
    }, // eidtDapp
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    getAppList() { // 获取dapp列表
      ++this.qureyList.pageNum
      getAppList(this.qureyList).then(v => {
        console.log(v)
        const { list } = v.data
        list.forEach((v, k) => {
          v.label = v.appName
          v.key = k
          v.id = v.id
          v.score = v.score
          v.logo = v.logo
          this.appList.push(v)
        })
      })
    }, // cateList
    transferChange() { // 穿梭机变化
      console.log(this.transferValue)
      this.dappRes = []
      this.form.tweetAppList = []
      this.form.bannerAppIds = []
      this.transferValue.forEach((v, k) => {
        console.log(this.appList[v])
        this.dappRes.push(this.appList[v])
        this.form.tweetAppList.push({ 'appId': this.appList[v].id, 'sort': this.transferValue.length - k })
        this.form.bannerAppIds.push(this.appList[v].id)
      })
      console.log(this.form)
    }, // transferChange
    handleAvatarSuccess(res, file) {
      console.log(res)
      this.form.bannerUrl = res.data.path
      this.bannerPreviewPath = res.data.previewPath
      this.imgLoading = false
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
    }// beforeAvatarUpload
  }
}
</script>

<style scoped>
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
  border: 1px dashed red;
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
.logoItem {
  width: 100px;
  height: 100px;
  margin-right: 20px;
  background: rgba(0, 0, 0, 0.05);
  display: inline-block;
}
.Language_EN {
  border: 1px solid rgba(0, 0, 0, 0.05);
  background: rgba(0, 0, 0, 0.02);
  padding: 10px 0;
}
.bannerUrl {
  width: 200px;
  height: 200px;
  display: block;
  background: rgba(0, 0, 0, 0.05);
}
.dappBox {
  padding: 20px;
  margin: 20px 0;
}
.dappBox .title {
  font-size: 23px;
  font-weight: bold;
}
.dappBox .appLogo {
  width: 60px;
  height: 60px;
}
</style>

<style>
.el-transfer {
  height: 500px;
}
.el-transfer-panel {
  max-height: 490px;
}
.el-transfer-panel__body {
  min-height: 500px !important;
}
.el-transfer-panel__list.is-filterable {
  min-height: 400px !important;
}
</style>

