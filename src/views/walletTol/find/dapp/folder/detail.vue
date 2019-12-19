<!--
 * @Description: find -> dapp -> detail
 * @Author: wangyun
 * @Date: 2019-08-13 17:20:14
 * @LastEditTime: 2019-11-19 11:52:35
 -->
<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.go(-1)" :content="moduleName"></el-page-header>
    </div>
    <div class="filter-container">
      <el-form label-width="120px">
        <el-form-item label="Logo：">
          <img :src="data.logo" width="90" alt />
        </el-form-item>

        <el-form-item label="DAppId：">{{ data.id }}</el-form-item>

        <el-form-item label="DApp名称：">
          {{ data.appName }}
          <el-tag v-if="data.isOfficial" size="mini" type="danger">ST</el-tag>
        </el-form-item>

        <el-form-item label="IOS：">
          <i
            :class="data.supportIos ? 'el-icon-success' : 'el-icon-error'"
            :title="data.supportIos ? '支持' :'不支持'"
          ></i>
        </el-form-item>

        <el-form-item label="Android：">
          <i
            :class="data.supportAndroid ? 'el-icon-success' : 'el-icon-error'"
            :title="data.supportAndroid ? '支持' :'不支持'"
          ></i>
        </el-form-item>

        <el-form-item label="应用状态：">
          <el-tag type="primary" v-if="data.status==1">审核阶段</el-tag>
          <el-tag type="success" v-if="data.status==2">正常</el-tag>
          <el-tag type="info" v-if="data.status==3">下线</el-tag>
        </el-form-item>

        <el-form-item label="图片详情：">
          <img
            v-for="item in data.appResourceList"
            :src="item.resourceUrl"
            :key="item.id"
            style="width:200px; margin:15px"
            alt
          />
        </el-form-item>

        <el-form-item label="描述：">{{ data.description }}</el-form-item>

        <el-form-item label="语言：">{{ data.languages }}</el-form-item>

        <el-form-item label="所属链：">{{ data.chainTypes }}</el-form-item>

        <el-form-item label="关键词：">{{ data.cateIndex }}</el-form-item>

        <el-form-item label="评分：">
          <div class="rate">
            <el-rate v-model="data.score" disabled show-score text-color="#ff9900"></el-rate>
          </div>
        </el-form-item>
        <el-form-item label="评分数：">{{data.commentSize}}</el-form-item>

        <el-form-item label="开发者：">
          <span style="font-weight: bold;">{{data.userName}}</span>
        </el-form-item>

        <el-form-item label="开发者ID：">{{data.userId}}</el-form-item>

        <el-form-item label="DApp链接：">
          <a :href="data.path" target="_blank" style="text-decoration:underline;">{{ data.path }}</a>
        </el-form-item>

        <el-form-item label="创建时间：">{{ data.createTime }}</el-form-item>
        <el-form-item label="更新时间：">{{ data.updateTime }}</el-form-item>
      </el-form>
      <br />
      <!-- <el-button type="primary" icon="el-icon-edit" @click="$router.go(-1)">返回</el-button> -->
    </div>
  </div>
</template>

<script>
import { getDappDetail } from '@/api/findModule/dapp'
export default {
  data() {
    return {
      data: {
        moduleName: '上一级'
      }
    }
  },
  created() {
    if (this.$route.query.id) {
      getDappDetail({ id: this.$route.query.id }).then(v => {
        this.data = v.data
      })
    }
    if (this.$route.query.moduleName) {
      this.moduleName = this.$route.query.moduleName
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.rate {
  height: 40px;
  display: flex;
  align-items: center;
}
i {
  font-size: 20px;
}

.line {
  text-align: center;
}
</style>

