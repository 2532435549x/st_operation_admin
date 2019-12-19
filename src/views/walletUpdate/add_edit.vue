<!--
 * @Description: walletUpdate -> add_edit
 * @Author: wangyun
 * @Date: 2019-09-11 16:20:27
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-26 10:35:50
 -->

<template>
  <div class="app-container">
    <!-- <el-popover
      placement="top-start"
      width="200"
      trigger="hover"
      content="xxx"
    >
      <i slot="reference" class="el-icon-info" />
    </el-popover>-->
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form-inline">
      <el-form-item label="创建时间" prop="createTime" v-if="form.createTime">
        <el-date-picker
          disabled
          v-model="form.createTime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          align="right"
        />
      </el-form-item>

      <el-form-item label="所属设备" prop="device">
        <el-select v-model="form.device" placeholder="请选择所属设备">
          <el-option :label="'IOS'" :value="1"></el-option>
          <el-option :label="'Android'" :value="2"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="版本类型" prop="type">
        <el-select v-model="form.type" placeholder="请选择版本类型">
          <el-option
            v-for="(item,index) in typeOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="打包版本" prop="buildType">
        <el-select v-model="form.buildType" placeholder="请选择打包版本">
          <el-option
            v-for="(item,index) in buildTypeOption"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="外部版本号" prop="majorVersion">
        <el-input v-model="form.majorVersion" type="text" placeholder="请填写外部版本号" />
      </el-form-item>

      <el-form-item label="内部版本号" prop="buildVersion">
        <el-input v-model="form.buildVersion" type="text" placeholder="请填写内部版本号" />
      </el-form-item>

      <el-form-item label="版本详细说明" prop="buildContent">
        <el-input
          v-model="form.buildContent"
          type="textarea"
          :autosize="{minRows: 2}"
          placeholder="请输入版本详细说明内容"
        />
      </el-form-item>

      <el-form-item label="版本升级描述" prop="content">
        <el-input
          v-model="form.content"
          type="textarea"
          :autosize="{minRows: 2}"
          placeholder="请输入版本升级描述 (提示用户升级看到的内容)"
        />
      </el-form-item>

      <el-form-item label="升级文件地址" prop="fileUrl">
        <el-input v-model="form.fileUrl" placeholder="请填写升级文件地址" />
      </el-form-item>

      <el-form-item label="是否强制升级" prop="forced">
        <el-switch v-model="form.forced" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <el-form-item label="是否通过审核" prop="auditResult" v-if="form.device == 1">
        <el-switch v-model="form.auditResult" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <el-form-item label="是否有效" prop="status">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getAppList,
  getAppVersionDetail,
  deleteAppVersion,
  saveAppVersion
} from '@/api/AppVersionModule'
export default {
  filters: {},
  data() {
    return {
      typeOption: [
        { label: '测试版本', value: 1 },
        { label: '正式版/企业版', value: 2 },
        { label: '商店版', value: 3 },
        { label: 'TestFly版', value: 4 }
      ],
      buildTypeOption: [
        { label: 'D版本', value: 1 },
        { label: 'B版本', value: 2 },
        { label: 'R版本', value: 3 }
      ],
      form: {
        forced: false,
        auditResult: false,
        status: false
      },
      rules: {
        device: [{ required: true, message: '请选择所属设备' }],

        type: [{ required: true, message: '请选择版本类型' }],

        buildType: [{ required: true, message: '请选择打包版本' }],

        majorVersion: [
          { required: true, message: '请填写外部版本号', trigger: 'blur' }
        ],

        buildVersion: [
          { required: true, message: '请填写内部版本号', trigger: 'blur' }
        ],

        buildContent: [
          { required: true, message: '请输入版本详细说明内容', trigger: 'blur' }
        ],

        fileUrl: [
          { required: true, message: '请填写升级文件地址', trigger: 'blur' }
        ],

        content: [
          {
            required: true,
            message: '请输入提示用户升级看到的内容',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    if (this.$route.query) {
      this.form = Object.assign({}, this.form, this.$route.query)
      if (this.$route.query.id) {
        getAppVersionDetail({ id: this.$route.query.id }).then(v => {
          this.form = Object.assign({}, this.form, v.data)
        })
      }
    }
  },

  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `是否进行【${
              this.$route.query.style == 'add' ? '添加' : '编辑'
            }】操作?`,
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
              this.$notify({
                type: 'info',
                title: '提示',
                message: `已取消${
                  this.$route.query.style == 'add' ? '添加' : '编辑'
                }`
              })
            })
        } else {
          this.$message.error('大哥，请填写完整表单！')
          return false
        }
      })
    }, // 表单验证

    submitHandler() {
      // let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form })
      console.log('params: ', params)
      saveAppVersion(params)
        .then(v => {
          this.$notify({
            title: '成功',
            message: `${this.form.style == 'add' ? '添加' : '编辑'}成功`,
            type: 'success'
          })
          this.$router.push({
            path: '/walletUpdate/walletUpdate-list'
          })
        })
        .catch(e => {
          this.$notify({
            title: '提示',
            message: `取消${this.form.style == 'add' ? '添加' : '编辑'}`,
            type: 'info'
          })
        })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 表单重置
  }
}
</script>
<style lang="scss">
.el-textarea {
  width: 600px;
}
</style>