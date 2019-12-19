<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="searchParams.s_LIKE_title"
        placeholder="搜索推文名称"
        style="width: 200px;"
        class="filter-item"
        @input="(e)=>{!e && fetchData()}"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="keyWordSearch()"
      >搜索</el-button>
      <router-link class="inlineBlock" to="/find/addArticle">
        <el-button class="filter-item" type="primary" icon="el-icon-edit">新增</el-button>
      </router-link>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="应用描述:">{{ scope.row.description }}</el-form-item>

            <hr>

            <el-form-item label="支持链:">{{ scope.row.chainTypes }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- expand -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="ID" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="封面图片" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.bannerUrl" alt srcset class="bannerImg">
        </template>
      </el-table-column>

      <el-table-column label="推文标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="子标题">
        <template slot-scope="scope">{{ scope.row.subtitle }}</template>
      </el-table-column>

      <el-table-column label="类型" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.type==1">图片封面</el-tag>
          <el-tag v-if="scope.row.type==2" type="success">滚动封面</el-tag>
          <el-tag v-if="scope.row.type==3" type="warning">列表封面</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否置顶" width="110" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.top" type="danger">已置顶</el-tag>
          <el-tag v-else type="info">未置顶</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="230">
        <template slot-scope="scope">
          <router-link
            :to="{path:'/find/articleDetail',query:{id:scope.row.id}}"
            class="inlineBlock"
          >
            <el-button type="primary" size="small">查看详情</el-button>
          </router-link>

          <router-link :to="{path:'/find/addArticle',query:{id:scope.row.id}}" class="inlineBlock">
            <el-button type="danger" size="small" @click="deleteKeywords('edit',scope.row)">编辑</el-button>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="list.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="list.total"
          :page-size="list.pageSize"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!list.total" class="list list1">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { getTweetList, searchTweetList } from '@/api/find'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 10
      },
      title: '', // 弹出框标题；新增 --修改搜索关键字两种
      list: {},
      listLoading: true,
      searchParams: {
        s_EQ_id: '',
        s_LIKE_title: '',
        s_EQ_bannerType: '',
        s_BT_createTime_START: '',
        s_BT_createTime_END: ''
      },
      rules: {
        words: [
          { required: true, message: '请填入关键字名称', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请输入关键字排序', trigger: 'blur' }
        ]
      }// rr
    }
  },
  watch: {
    searchParams: {
      handler(val, oldVal) {
        if (!val.s_LIKE_title) {
          this.qureyList.pageNum = 1
          this.fetchData()
        } else {
          this.keyWordSearch()
        }
      },
      deep: true
    }// qureyList
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData(params = {}) {
      this.listLoading = true
      params.pageSize = this.qureyList.pageSize
      params.pageNum = this.qureyList.pageNum
      getTweetList(params).then(response => {
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
    keyWordSearch() { // 关键词搜索
      searchTweetList(this.searchParams).then(response => {
        this.list = response.data
      })
    }, // keyWordSearch
    getPage(type) { // 分页加载
      console.log(type)
      this.qureyList.pageNum = type
      this.fetchData()
    }// pageLoad
  } // watch
}
</script>
<style scoped>
.bannerImg {
  width: 200px;
  height: 200px;
  background: rgba(0, 0, 0, 0.04);
  display: block;
  margin: auto;
}
</style>
