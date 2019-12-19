<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:10
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="edit(3,null)">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list1"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="类名" >
        <template slot-scope="scope">
          <span v-for="i in (scope.row.list-1)" :key="i"> &nbsp; &nbsp;-</span>
          {{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center" width="300">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt style="width:100px;height:100px;" >
        </template>
      </el-table-column>

      <el-table-column label="类级" align="center">
        <template slot-scope="scope">{{ scope.row.list | daxie }}</template>
      </el-table-column>

      <el-table-column label="描述" align="center" >
        <template slot-scope="scope">{{ scope.row.desc }}</template>
      </el-table-column>

      <el-table-column label="关键词" align="center" >
        <template slot-scope="scope">{{ scope.row.keywords ||'无' }}</template>
      </el-table-column>

      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(0,scope.row)">编辑</el-button>
          <el-button type="danger" @click="edit(1,scope.row)">删除</el-button>
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
  </div>
</template>

<script>
import { categoryList, categoryDelete } from '@/api/grapefruit/grapefruitlist'
import { getCotery, rp } from '@/utils/validate'
export default {
  filters: {
    daxie(status) {
      return rp(status) + '级'
    }
  },
  data() {
    return {
      list1: [],
      qureyList: {
        pageNum: 1,
        pageSize: 10
      },
      title: '', // 弹出框标题；新增 --修改Nodes两种
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      formLabelWidth: '120px',
      rules: {
        nodeName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        nodeUrl: [
          { required: true, message: '请输入分类英文名', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ]
      }// rr
    }
  },
  watch: {
    qureyList: {
      handler(val, oldVal) {
        this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // // 操作
    async edit(style, item) {
      style == 1 && this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.deleteShop(item)
        console.log('result: ', result)
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fetchData()
        } else {
          this.$message({
            type: 'info',
            message: '删除失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (style == 0 || style == 3) {
        this.addShop(style, item)
      }
    },
    async deleteShop(item) {
      return await categoryDelete({ id: item.id })
    },
    // 去新增或者编辑商品页面
    async addShop(style, item) {
      const query = {
        style
      }
      if (item) {
        query.id = item.id
      }
      this.$router.push({
        path: '/applications/grapefruit/grapefruit-grapefruitCategory-add-edit',
        query
      })
    },
    // 获取列表
    fetchData(params = this.qureyList) {
      this.listLoading = true
      categoryList(params).then(response => {
        this.list1 = getCotery(response.data)
        console.log('this.list: ', this.list1)
        this.listLoading = false

        this.dialogFormVisible = false
      })
    }, // fetchData
    pushCategory() {

    },
    // 关键词搜索
    keyWordSearch(keyword) {
      console.log(keyword)
      this.fetchData({ s_LIKE_categoryName: keyword })
    },
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) { // 分页加载
      this.qureyList.pageNum = type
    }
  }
}
</script>

