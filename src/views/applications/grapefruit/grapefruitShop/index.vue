<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:40
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="qureyList.s_LIKE_goodsSn"
        placeholder="请输入商品编号"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_LIKE_name"
        placeholder="请输入商品名称"
        style="width: 200px;"
        class="filter-item"
        clearable
      />

      <el-select v-model="qureyList.s_LIKE_deleted" placeholder="商品状态">
        <el-option label="未删除" value="0" />
        <el-option label="已删除" value="1" />
      </el-select>

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

      <el-table-column label="价格" align="center">
        <template slot-scope="scope">{{ scope.row.retailPrice }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.picUrl" alt style="width:100px;height:50px;" >
        </template>
      </el-table-column>

      <el-table-column label="商品是否存在" align="center">
        <template slot-scope="scope">
          <el-tag v-if=" scope.row.deleted" type="danger">已删除</el-tag>
          <el-tag v-else>未删除</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="排序" align="center">
        <template slot-scope="scope">{{ scope.row.sortOrder }}</template>
      </el-table-column>

      <el-table-column label="启用" align="center">
        <template slot-scope="scope">
          <el-switch
            :value="scope.row.isOnSale"
            :active-value="true"
            :inactive-value="false"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeStatus(scope.row)"
          />
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="操作类型" align="center" width="150">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="edit(0,scope.row)">编辑</el-button>
          <el-button
            :disabled="scope.row.deleted"
            size="mini"
            type="danger"
            @click="edit(1,scope.row)"
          >删除</el-button>
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
import { goodsList, goodsDelete, changeStatusGoods } from '@/api/grapefruit/grapefruitlist'
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
      value5: false,
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        s_LIKE_deleted: '0'
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
      }// rr w
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
    // 改变商品的可用
    async changeStatus(item) {
      const result = await changeStatusGoods({ id: item.id, isOnSale: !item.isOnSale })
      if (result.code == 1000) {
        this.fetchData()
      } else {
        this.$message({
          type: 'info',
          message: result.message
        })
      }
    },
    // 操作
    async edit(style, item) {
      style == 1 && this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await this.deleteShop(style, item)
        console.log('result: ', result)
        this.fetchData()
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch((err) => {
        console.log('err: ', err)
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (style == 0 || style == 3) { this.addShop(style, item) }
    },
    async deleteShop(style, item) {
      return await goodsDelete({ id: item.id })
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
        path: '/applications/grapefruit/grapefruit-add-edit',
        query
      })
    },
    // 获取列表
    fetchData(params = this.qureyList) {
      this.listLoading = true
      goodsList(params).then(response => {
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

