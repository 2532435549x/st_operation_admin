<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.go(-1)" :content="moduleName"></el-page-header>
    </div>
    <div class="filter-container" style="padding: 0 60px;">
      <el-form>
        <el-form-item label="账号名">{{ detailData.account }}</el-form-item>

        <el-form-item label="所属链">
          <el-tag :type="detailData.chainType | chainTypeFilter">{{ detailData.chainType }}</el-tag>
        </el-form-item>

        <el-form-item label="状态">
          <el-tag
            :type="detailData.status | statusColFilter"
            effect="dark"
            size="small"
          >{{ detailData.status | statusFilter }}</el-tag>
        </el-form-item>

        <el-form-item label="代理名称">{{ detailData.name }}</el-form-item>

        <el-form-item label="代理简介">{{ detailData.intro }}</el-form-item>

        <el-form-item label="代理简介(EN)">{{ detailData.introEn }}</el-form-item>

        <el-form-item label="备注">{{ detailData.remark }}</el-form-item>

        <el-form-item label="标语">{{ detailData.slogan }}</el-form-item>
        <el-form-item label="标语(EN)">{{ detailData.sloganEn }}</el-form-item>

        <el-form-item label="telegram">{{ detailData.telegram }}</el-form-item>
        <el-form-item label="twitter">{{ detailData.twitter }}</el-form-item>
        <el-form-item label="微信">{{ detailData.wechat }}</el-form-item>

        <el-form-item label="logo">
          <img :src="detailData.logo" style="width: 80px;" />
        </el-form-item>

        <el-form-item label="官网地址">
          <a class="activeLink" :href="detailData.website" target="_blank">{{detailData.website}}</a>
        </el-form-item>

        <el-form-item label="创建时间">{{ detailData.createTime ? detailData.createTime : '暂无数据' }}</el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getProxyVoteDeteail } from '@/api/walletTolModule/vote'
export default {
  filters: {
    statusColFilter(val) {
      const colMaps = {
        1: 'primary',
        2: 'danger',
        3: 'success',
        4: 'info'
      }
      return colMaps[val]
    },
    statusFilter(val) {
      const txtMaps = {
        1: '待审核',
        2: '审核失败',
        3: '审核成功',
        4: '无效'
      }
      return txtMaps[val]
    }
  },
  data() {
    return {
      id: '',
      moduleName: '上一级',
      detailData: {}
    }
  },
  created() {
    this.initFetch()
  },
  methods: {
    initFetch() {
      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.fetchDetail()
      }
      if (this.$route.query.moduleName) {
        this.moduleName = this.$route.query.moduleName
      }
    },

    fetchDetail() {
      getProxyVoteDeteail({ id: this.id }).then(v => {
        this.detailData = v.data
      })
    }
  }
}
</script>