<!--
 * @Description: walletTol -> cloud -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-21 18:26:17
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="支持模糊搜索,点击反馈图片，查看大图"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_contactInfo" placeholder="输入联系方式查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      element-loading-text="Loading"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="反馈类型ID">{{ scope.row.typeId }}</el-form-item>
            <el-form-item label="反馈内容">{{ scope.row.content }}</el-form-item>
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

      <el-table-column label="联系方式" align="center" min-width="140">
        <template slot-scope="scope">{{ scope.row.contactInfo }}</template>
      </el-table-column>

      <el-table-column label="反馈内容" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column label="反馈图片" align="center" min-width="140">
        <template slot-scope="{row}">
          <el-button
            v-if="row.images && row.images.length!== 0"
            slot="reference"
            type="text"
            icon="el-icon-circle-plus-outline"
            @click="checkImg(row)"
          >点击查看反馈图片</el-button>
          <!-- <div v-if="row.images && row.images.length!== 0">
            <el-image
              v-for="(item,index) in row.images.slice(0,2) "
              :key="index"
              style="width: 88px; height: 88px; margin: 0 10px;"
              :src="item"
              :preview-src-list="row.images"
              alt="点击查看大图"
            ></el-image>
          </div>-->
          <template v-else>暂无图片数据</template>
        </template>
      </el-table-column>

      <el-table-column label="反馈时间" sortable="create_time" width="180" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="反馈类型" align="center" width="160">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="180">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            :disabled="scope.row.status == 2"
            @click="signHandler(scope.row)"
          >{{scope.row.status == 2 ? '已读': '标记已读'}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- <抽屉组件 -->
    <el-drawer :visible.sync="drawer" :show-close="false" :direction="direction">
      <div slot="title">
        <b style="margin-right: 20px;">反馈图片</b>
        <el-tag size="small" effect="light">点击图片预览大图</el-tag>
      </div>
      <div class="scroll-container" v-if="imgList.length !== 0">
        <el-image
          v-for="(url, index) in imgList"
          :key="index"
          :src="url"
          :preview-src-list="imgList.slice(index)"
        ></el-image>
      </div>
    </el-drawer>
    <!-- <抽屉组件 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        v-if="listData.total !=0"
        :total="listData.total"
        :page-size="listData.pageSize"
        :hide-on-single-page="true"
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
import { getFeedBackList, readFeedBack } from '@/api/walletTolModule/feedBack'

export default {
  filters: {},
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'create_time DESC'
      },
      listData: {},
      imgList: [],
      drawer: false,
      direction: 'rtl'
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.queryList.pageNum == 1 && this.fetchData()
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      res.result &&
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
    },

    async fetchData() {
      this.dialogFormVisible = false
      try {
        let res = await getFeedBackList(this.queryList)
        this.listData = res.data

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: 'fail' }
      }
    },

    checkImg(item) {
      this.imgList = item.images
      this.drawer = true
    },

    signHandler(item) {
      readFeedBack({ id: item.id })
        .then(v => {
          this.$notify.success('操作成功')
          this.fetchData()
        })
        .catch(e => {
          console.log('e: ', e)
        })
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>

<style lang="scss" scoped>
.scroll-container {
  height: 90vh;
  padding: 20px;
  overflow-y: auto;
}
</style>



