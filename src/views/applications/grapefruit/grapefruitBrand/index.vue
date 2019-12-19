<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:36
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="qureyList.s_EQ_name"
        placeholder="请输入商品名称"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_EQ_brandId"
        placeholder="请输入品牌ID"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_EQ_name"
        placeholder="请输入商品名称"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <!-- <el-select v-model="qureyList.s_LIKE_action" placeholder="订单状态">
        <el-option label="全部" value />
        <el-option label="成功" value="0" />
        <el-option label="失败" value="1" />
      </el-select>-->

      <el-date-picker
        v-model="qureyList.s_BT_createTime_START"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开开始日期"
      />

      <el-date-picker
        v-model="qureyList.s_BT_createTime_END"
        type="date"
        placeholder="选择结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />

      <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="edit(3,null)">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="商品ID" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="名字" align="center">
        <template slot-scope="scope">{{ scope.row.name ||"无" }}</template>
      </el-table-column>

      <el-table-column label="简介" align="center">
        <template slot-scope="scope">{{ scope.row.description.substring(0,20) }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center" width="300">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt style="width:100px;height:100px;" >
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(0,scope.row)">编辑</el-button>
          <!-- <el-button type="danger" @click="edit(1,scope.row)">删除</el-button> -->
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
import { brandList, brandDelete } from '@/api/grapefruit/grapefruitlist'
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
    // 操作
    async edit(style, item) {
      try {
        style == 1 && this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const result = await this.deleteShop(item)
          console.log('result: ', result)
          if (result.code == 1000) {
            this.$message({
              type: 'info',
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
      } catch (error) {
        console.log('error: ', error)
      }
      if (style == 0 || style == 3) {
        this.addShop(style, item)
      }
    },
    async deleteShop(item) {
      console.log(item)
      return await brandDelete({ id: item.id })
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
        path: '/applications/grapefruit/grapefruit-brand-add-edit',
        query
      })
    },
    // 获取列表
    fetchData(params = this.qureyList) {
      this.listLoading = true
      brandList(params).then(response => {
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
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

