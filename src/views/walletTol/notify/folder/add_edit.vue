<!--
 * @Description: notify -> add_edit
 * @Author: wangyun
 * @Date: 2019-08-15 16:31:16
 * @LastEditTime: 2019-10-12 13:52:12
 -->

<template>
  <div class="app-container">
    <!-- 表单处理 -->
    <el-form ref="form" :model="form" :rules="rules" label-width="180px" class="demo-form-inline">
      <el-form-item label="通知设备" prop="device">
        <el-select v-model="form.device" placeholder="请选择设备">
          <el-option
            v-for="(item, index) in deviceOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="extType" label="跳转方式">
        <el-select v-model="form.extType">
          <el-option :label="'DAppId'" :value="'1'" />
          <el-option :label="'不跳转'" :value="'0'" />
        </el-select>
        <el-popover
          placement="top-start"
          width="300"
          trigger="hover"
          title="跳转方式解释"
          content="跳转方式为DAppId时 在DApp列表里搜索DApp,选中后将自动填入DAppId"
        >
          <i slot="reference" class="el-icon-info" />
        </el-popover>
      </el-form-item>

      <el-form-item label="DAppId" v-if="form.extType == 1" prop="extData">
        <el-input v-model="form.extData" type="number" placeholder="填写dapp Id(数字)" />

        <el-popover v-if="form.extType == 1" placement="right-start" width="300" height="200">
          <div class="dappList">
            <el-form-item align="center" fixed="top">
              <el-input
                v-model="queryList.appName"
                @keyup.enter.native="search"
                placeholder="请输入DApp名称"
              ></el-input>
              <el-button type="primary" @click="search">搜索</el-button>
            </el-form-item>

            <el-table :data="dappList" style="cursor: pointer;">
              <el-table-column width="80" label="Logo">
                <template slot-scope="scope">
                  <img :src="scope.row.logo" alt width="50" @click="choose(scope.row)" />
                </template>
              </el-table-column>

              <el-table-column width="150" label="DApp名称">
                <template slot-scope="scope">
                  <div @click="choose(scope.row)">{{scope.row.appName}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button slot="reference" type="primary" plain>点击查看贴心的DApp列表</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="通知标题" prop="title">
        <el-input
          v-model="form.title"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          maxlength="40"
          show-word-limit
          placeholder="请填写通知标题"
        />
      </el-form-item>
      <el-form-item label="通知描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          maxlength="50"
          show-word-limit
          placeholder="请填写通知描述"
        />
      </el-form-item>

      <!-- <el-form-item label="通知内容" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          placeholder="请填写通知内容"
        />
      </el-form-item>-->

      <el-form-item label="通知内容富文本" prop="content">
        <vue-ueditor-wrap v-model="form.content" :config="myConfig" />
      </el-form-item>

      <el-form-item label="通知标题(EN)" prop="titleEn">
        <el-input
          v-model="form.titleEn"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          maxlength="80"
          show-word-limit
          placeholder="请填写通知英文标题"
        />
      </el-form-item>

      <el-form-item label="通知描述(EN)" prop="descriptionEn">
        <el-input
          v-model="form.descriptionEn"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          maxlength="100"
          show-word-limit
          placeholder="请填写通知英文描述"
        />
      </el-form-item>

      <!-- <el-form-item label="通知内容(EN)" prop="contentEn">
        <el-input
          v-model="form.contentEn"
          type="textarea"
          :autosize="{minRows:2,maxRows:4}"
          placeholder="请填写Banner描述"
        />
      </el-form-item>-->

      <el-form-item label="通知内容(EN)富文本" prop="contentEn">
        <vue-ueditor-wrap v-model="form.contentEn" :config="myConfig" />
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
import VueUeditorWrap from 'vue-ueditor-wrap'
import {
  addDappNotify,
  editDappNotify,
  getDappNotifyDetail,
  getDappNotifyApps
} from '@/api/AppNotifyModule'

export default {
  components: {
    VueUeditorWrap
  },
  data() {
    return {
      myConfig: {
        autoHeightEnabled: false, // 编辑器不自动被内容撑高
        initialFrameHeight: 600, // 初始容器高度
        initialFrameWidth: 800, // 初始容器宽度
        serverUrl: '/apiUrl/api/common/ue/uploadImage', // 上传文件接口
        UEDITOR_HOME_URL: '/static/UEditor/' // UEditor 资源文件的存放路径，如果你使用的是 vue-cli 生成的项目，通常不需要设置该选项
      },
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      queryList: {
        pageNum: 1,
        pageSize: 5,
        device: '0',
        appName: '' // DApp名字模糊搜索
      },
      form: {
        device: '0',
        extData: '', // 跳转dappid
        status: true
      },
      dappList: [],
      deviceOptions: [
        { label: '全部', value: '0' },
        { label: 'IOS', value: '1' },
        { label: 'Android', value: '2' }
      ],
      rules: {
        extType: [
          { required: true, message: '请选择跳转方式', trigger: 'change' }
        ],
        device: [{ required: true, message: '请选择设备', trigger: 'change' }],
        title: [
          { required: true, message: '请填写通知中文标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请填写通知中文描述', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请填写通知中文内容', trigger: 'blur' }
        ],
        titleEn: [
          { required: true, message: '请填写通知英文标题', trigger: 'blur' }
        ],
        descriptionEn: [
          { required: true, message: '请填写通知英文描述', trigger: 'blur' }
        ],
        contentEn: [
          { required: true, message: '请填写通知英文内容', trigger: 'blur' }
        ],
        expireTime: [
          { required: true, message: '请选择过期时间', trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    keyWordsListen() {
      return this.queryList.appName
    },
    actionChange() {
      return this.form.extType
    },
    deviceChange() {
      return this.form.device
    }
  },
  watch: {
    deviceChange(val, oldVal) {
      this.queryList.device = val
      this.fetchData()
    },
    actionChange(val, oldVal) {
      val == 1 && this.fetchData()
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
    search() {
      this.fetchData()
    },
    choose(item) {
      console.log('item: ', item)
      this.form.extData = item.id
    },
    async fetchData() {
      try {
        console.log('this.queryList: ', this.queryList)
        let res = await getDappNotifyApps(this.queryList)
        console.log('res: ', res)

        if (res.code === 1000) {
          this.dappList = res.data
          console.log('this.dappList: ', this.dappList)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将【${this.title.text}】该通知, 是否继续?`,
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
      let params = Object.assign({}, { ...this.form })
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editDappNotify(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/notify/notify-list'
          })
        })
      } else if (this.title.state == 'add') {
        addDappNotify(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.$router.push({
            path: '/walletTol/notify/notify-list'
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