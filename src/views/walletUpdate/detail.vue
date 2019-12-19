<!--
 * @Description: walletUpdate -> detail
 * @Author: wangyun
 * @Date: 2019-09-09 11:07:51
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-13 16:49:11
 -->
<template>
  <div class="Dapp-de">
    <div class="Dapp-detail">
      <h1 v-if="detail.device===1">IOS{{detail.buildVersion}}版本详情</h1>
      <h1 v-if="detail.device===2">Android{{detail.buildVersion}}版本详情</h1>
      <el-form :model="detail" label-position="left" label-width="180" class="demo-table-expand">
        <el-form-item label="id" width="300">
          <!-- <el-input v-model="detil.id" readonly /> -->
          <div>:{{detail.id}}</div>
        </el-form-item>

        <el-form-item  label="所属设备">
          <div v-if="detail.device===1">:IOS</div>
          <div v-if="detail.device===2">:Android</div>
        </el-form-item>

        <el-form-item label="内部版本号">
          <div>:{{detail.buildVersion}}</div>
        </el-form-item>
        <el-form-item label="外部版本号">
          <div>:{{detail.majorVersion}}</div>
        </el-form-item>

        <el-form-item label="版本类型">
          <div v-if="detail.type===1">:测试版本</div>
          <div v-if="detail.type===2">:正式版本</div>
        </el-form-item>

        <el-form-item label="版本升级描述">
          <div>:{{detail.content}}</div>
        </el-form-item>

        <el-form-item label="内部版本详细说明">
          <div>:{{detail.buildContent}}</div>
        </el-form-item>

        <el-form-item label="OSS路径">
          <div>:{{detail.fileUrl}}</div>
        </el-form-item>

        <el-form-item label="是否强制升级">
          <div v-if="detail.forced===false">:否</div>
          <div v-if="detail.forced===true">:是</div>
        </el-form-item>

        <el-form-item label="是否通过审核">
          <div v-if="detail.auditResult===false">:否</div>
          <div v-if="detail.auditResult===true">:是</div>
        </el-form-item>

        <el-form-item label="是否有效">
          <div v-if="detail.status===false">:否</div>
          <div v-if="detail.status===true">:是</div>
        </el-form-item>

        <el-form-item label="时间">
          <div>:{{detail.createTime}}</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import * as AppUpdate from '@/api/AppVersionModule'
export default {
  data() {
    return {
      detail: {},
    }
  },
  computed: {
  },
  watch: {
  },
  mounted() {
    this.getDetil()
  },
  methods: {
    async getDetil() {
      const params = {
        id: this.$route.query.id
      }
      let res = await AppUpdate.getAppVersionDetail(params)
      this.detail = res.data
      console.log('钱包版本详情', this.detail)
    }
  }
}
</script>

<style  lang="scss" scoped>
.dapp-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.Dapp-de {
  width: 100%;
  .el-tag {
    margin: 0 4px;
    color: white;
  }
}
.Dapp-detail {
  width: 90%;
  margin: 20px auto;
}

.dapp-header {
  .el-tag {
    margin: 0 4px;
    color: #67c23a;
  }
}
.el-form-item__content {
  color: black;
  font-size: 16px;
  font-weight: 600;
}
</style>
