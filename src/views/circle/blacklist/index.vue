<!--
 * @Description: blacklist
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-20 17:22:04
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.keyword" placeholder="输入用户名搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>

    <!-- 表格处理 -->
    <el-table :data="listData.list" :max-height="fullHeight" border fit highlight-current-row>
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="手机号">{{ scope.row.customerMobile }}</el-form-item>
            <el-form-item label="邮箱">{{scope.row.customerEmail}}</el-form-item>
            <el-form-item label="限制内容">{{scope.row.score}}</el-form-item>
            <el-form-item label="拉黑原因">{{scope.row.reason}}</el-form-item>

            <el-form-item label="创建时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="头像" align="center" width="100">
        <template slot-scope="{row}">
          <el-avatar :size="50" :src="row.customerAvatar" @error="errorHandler">
            <img src="/static/publicImgs/default-avatar.png" style="width: 50px; height: 50px" />
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="用户名" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.customerNick }}</template>
      </el-table-column>

      <el-table-column label="手机号" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="邮箱" align="center" width="120" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="限制内容" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.score}}</template>
      </el-table-column>

      <el-table-column label="限制时间" align="center" width="320">
        <template slot-scope="scope">{{scope.row.startTime}} ~ {{scope.row.endTime}}</template>
      </el-table-column>

      <el-table-column label="拉黑原因" align="center" min-width="160" show-overflow-tooltip>
        <template slot-scope="scope">{{scope.row.reason}}</template>
      </el-table-column>

      <el-table-column label="禁止打赏" align="center" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.banGiveScore ? '已开启' : '已关闭'" placement="top">
            <el-switch
              v-model="scope.row.banGiveScore"
              active-color="#13ce66"
              @change="behaviorHandler(scope.row, 'banGiveScore')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="禁止登录" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.banLogin ? '已开启' : '已关闭'" placement="top">
            <el-switch
              v-model="scope.row.banLogin"
              active-color="#13ce66"
              @change="behaviorHandler(scope.row, 'banLogin')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="禁止评论" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.banPublishComment ? '已开启' : '已关闭'" placement="top">
            <el-switch
              v-model="scope.row.banPublishComment"
              active-color="#13ce66"
              @change="behaviorHandler(scope.row, 'banPublishComment')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="禁止发帖" align="center" width="100">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.banPublishPost ? '已开启' : '已关闭'" placement="top">
            <el-switch
              v-model="scope.row.banPublishPost"
              active-color="#13ce66"
              @change="behaviorHandler(scope.row, 'banPublishPost')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('relieve', scope.row)">解除限制</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        v-if="listData.total !=0"
        :total="listData.total"
        :page-size="listData.pageSize"
        :current-page.sync="queryList.pageNum"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { setContextData, getContextData } from '@/utils/validate'

import {
  getblackList,
  shutInBlackroom,
  shutOutBlackroom
} from '@/api/circleModule/blacklist'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  computed: {},
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  mounted() {},
  methods: {
    async refresh() {
      let res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },

    async fetchData() {
      try {
        let res = await getblackList(this.queryList)

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    behaviorHandler(item, type) {
      let params = JSON.parse(JSON.stringify(item))
      params[type] = item[type] == true ? 1 : 0
      console.log('params: ', params)
      shutInBlackroom(params).then(v => {
        v.code === 1000 && this.$notify.success('操作成功')
        this.fetchData()
      })
    },

    formVisible(style, item) {
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/circle/users/users-detail',
            query: { style }
          })
          break
        case 'relieve':
          this.$confirm(
            `你正在把 用户【${
              item.customerNick ? item.customerNick : ''
            }】移除小黑屋, 是否继续?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              shutOutBlackroom({ id: item.id }).then(v => {
                v.code === 1000 && this.$notify.success('解除成功')
                this.fetchData()
              })
            })
            .catch(() => {
              this.$notify.info('已取消操作')
            })

          break
      }
    }, // 操作

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>

<style lang="scss" scope>
.conJump:hover {
  text-decoration: underline;
  color: #409eff;
}
.icon img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  vertical-align: middle;
  cursor: pointer;
}
.icon.type2 img {
  opacity: 0.2;
}
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>

