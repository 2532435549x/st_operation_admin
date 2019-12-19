<!--
 * @Description: coin -> add_edit
 * @Author: wangyun
 * @Date: 2019-08-13 17:20:14
 * @LastEditTime: 2019-11-13 14:51:14
 -->
<template>
  <div class="app-container">
    <el-popover
      placement="top-start"
      width="200"
      trigger="hover"
      content="如果出现图片丢失，是因为数据库在进行迁移,重新上传代币图标即可"
    >
      <i slot="reference" class="el-icon-info" />
    </el-popover>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-form-inline">
      <el-form-item label="代币图标">
        <el-upload
          v-loading="imgLoading"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :data="ruleForm"
          class="avatar-uploader"
          action="/apiUrl/api/common/uploadImage"
        >
          <img v-if="form.symbolIconPreview" :src="form.symbolIconPreview" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
        <!-- <el-tag size="small">代币Icon 建议尺寸 w:50px h:50px</el-tag> -->
      </el-form-item>

      <el-form-item label="所属链类型" prop="chainType">
        <el-select v-model="form.chainType" placeholder="选择所属链">
          <el-option
            v-for="(item, index) in chainTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="代币名称" prop="symbol">
        <el-input v-model="form.symbol" placeholder="填写代币名称" />
      </el-form-item>

      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName" placeholder="填写项目名称" />
      </el-form-item>

      <el-form-item label="代币精度" prop="precision">
        <el-input v-model="form.precision" type="Number" :min="0" placeholder="请填写代币精度(小数点后几位)" />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input v-model="form.sort" type="Number" :min="0" placeholder="请填写排序，数字越大越靠前(默认写0就行)" />
      </el-form-item>

      <el-form-item label="代币简介" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 5}"
          placeholder="请填写代币简介"
        />
      </el-form-item>

      <el-form-item label="合约账号名称" prop="contract">
        <el-input v-model="form.contract" placeholder="填写合约地址" />
      </el-form-item>

      <el-form-item label="发行总量" prop="publishTotal">
        <el-input v-model="form.publishTotal" type="Number" placeholder="填写发行总量" />
      </el-form-item>

      <el-form-item label="发行时间" prop="publishTime">
        <el-date-picker
          v-model="form.publishTime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          align="right"
        />
      </el-form-item>

      <el-form-item label="官网地址" prop="website">
        <el-input v-model="form.website" placeholder="填写官网地址" />
      </el-form-item>

      <el-form-item label="代币人民币价格" v-if="form.priceCny" prop="priceCny">
        <el-input v-model="form.priceCny" disabled type="Number" placeholder="请填写代币人民币价格" />
      </el-form-item>

      <el-form-item label="代币美元价格" v-if="form.priceUsd" prop="priceUsd">
        <el-input v-model="form.priceUsd" disabled type="Number" placeholder="请填写代币美元价格" />
      </el-form-item>

      <el-form-item label="创建时间" v-if="form.createTime" prop="createTime">
        <el-date-picker
          disabled
          v-model="form.createTime"
          type="date"
          placeholder="选择日期时间"
          value-format="yyyy-MM-dd"
          align="right"
        />
      </el-form-item>

      <br />
      <el-form-item label="状态管理" prop="status" v-if="$route.query.style == 'edit'">
        <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
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
import { getCoinDetail, addCoin, editCoin } from '@/api/walletTolModule/coin'
export default {
  data() {
    return {
      ruleForm: { type: 2 }, // 上传时附带的额外参数 @params{type} 1推文图片 2代币图片 3启动广告 4发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      form: {
        chainType: 'EOS',
        precision: '4'
      },
      rules: {
        sort: [{ required: true, message: '请填写排序', trigger: 'blur' }],
        chainType: [
          { required: true, message: '请选择所属链类型', trigger: 'change' }
        ],
        contract: [
          { required: true, message: '请填写合约地址', trigger: 'blur' }
        ],
        precision: [
          { required: true, message: '请填写代币精度', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '至少说点啥嘛~', trigger: 'blur' }
        ],
        projectName: [
          { required: true, message: '请填写项目名称', trigger: 'blur' }
        ],
        publishTotal: [
          { required: true, message: '请填写发行总量', trigger: 'blur' }
        ],
        symbol: [
          { required: true, message: '请填写代币名称', trigger: 'blur' }
        ],
        website: [
          { required: true, message: '请填写官网地址', trigger: 'blur' }
        ],
        publishTime: [
          { required: true, message: '请选择发行时间', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    chainType() {
      return this.form.chainType
    }
  },
  watch: {
    chainType(val, oldVal) {
      if (val == 'EOS') {
        this.form.precision = 4
      } else {
        this.form.precision = ''
      }
    }
  },
  created() {
    if (this.$route.query) {
      this.form = Object.assign({}, this.form, this.$route.query)
      if (this.$route.query.id) {
        getCoinDetail({ id: this.$route.query.id }).then(v => {
          v.data.publishTime = this.formatTime(new Date(v.data.publishTime))
          v.data.createTime = this.formatTime(new Date(v.data.createTime))
          this.form = Object.assign({}, this.form, v.data)
        })
      }
    }
  },

  methods: {
    handleAvatarSuccess(res, file) {
      if (res.code == 1000) {
        this.form.symbolIcon = res.data.savePath // 后台需要字段
        this.form.symbolIconPreview = res.data.previewPath // 前端展示字段
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    }, // 文件上传成功时的钩子方法

    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading = false
      }
      return isJPG && isLt2M
    }, // 上传文件之前的钩子方法，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。

    submitForm(formName) {
      if (!this.form.symbolIcon) {
        this.$message.error('小老弟，你图标都不上传，我很难办啊！')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将【${
              this.$route.query.style == 'add' ? '添加' : '编辑'
            }】该代币, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定了',
              cancelButtonText: '再想想',
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
          this.$message.error('小老弟，请填写完整表单')
          return false
        }
      })
    }, // 表单验证

    submitHandler() {
      let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form }, { status })
      console.log('params: ', params)
      if (this.$route.query.style == 'add') {
        addCoin(params).then(v => {
          if (v.code == 1000) {
            this.$notify({
              title: '提示',
              message: '添加成功',
              type: 'success'
            })
            this.$router.push({
              path: '/walletTol/coin/coin-list'
            })
          }
        })
      } else if (this.$route.query.style == 'edit') {
        editCoin(params).then(v => {
          if (v.code == 1000) {
            this.$notify({
              title: '提示',
              message: '编辑成功',
              type: 'success'
            })
            this.$router.push({
              path: '/walletTol/coin/coin-list'
            })
          }
        })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 表单重置
  }
}
</script>

<style scoped>
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
  transition: all 0.4s ease;
}

.avatar-uploader img {
  width: 80px;
}

.el-input {
  width: 500px;
}
.dappList .el-input {
  width: 170px;
}
</style>

