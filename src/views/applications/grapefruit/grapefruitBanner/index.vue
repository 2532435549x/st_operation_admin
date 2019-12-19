<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:05
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input
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
      />-->
      <!-- <el-select v-model="qureyList.s_LIKE_action" placeholder="订单状态">
        <el-option label="全部" value />
        <el-option label="成功" value="0" />
        <el-option label="失败" value="1" />
      </el-select>-->

      <!-- <el-date-picker
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
      />-->

      <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="edit(3,null)">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column label="设备" align="center">
        <template slot-scope="scope">{{ scope.row.positionType==1?'移动':'PC' }}</template>
      </el-table-column>

      <el-table-column label="商品id" align="center">
        <template slot-scope="scope">{{ scope.row.goodsId ||"无" }}</template>
      </el-table-column>

      <el-table-column label="排序" align="center">
        <template slot-scope="scope">{{ scope.row.sort ||"无" }}</template>
      </el-table-column>

      <el-table-column label="是否有效" align="center">
        <template slot-scope="scope">{{ scope.row.enabled ?"有":"无" }}</template>
      </el-table-column>

      <el-table-column label="图片" align="center" width="300">
        <template slot-scope="scope">
          <img :src="scope.row.resourceUrl" alt style="width:200px;" >
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="操作类型" align="center">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(0,scope.row)">编辑</el-button>
          <el-button type="danger" @click="edit(1,scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { resourceDetail, resourceDelete, resourceSave, resourceList } from '@/api/grapefruit/grapefruitlist'
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
      list: [],
      qureyList: {

      },
      title: '', // 弹出框标题；新增 --修改Nodes两种
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
  created() {
    this.fetchData()
  },
  methods: {
    // 操作
    async edit(style, item) {
      try {
        style == 1 && this.$confirm('此操作将永久删除该banner, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          const result = await this.deleteShop(item)
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
      return await resourceDelete({ id: item.id })
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
        path: '/applications/grapefruit/grapefruit-branner-add-edit',
        query
      })
    },
    // 获取列表
    fetchData() {
      this.listLoading = true
      resourceList().then(response => {
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    },
    // fetchData
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

