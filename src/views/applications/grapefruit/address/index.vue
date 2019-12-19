<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:45
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="qureyList.s_LIKE_name"
        placeholder="根据姓名查找"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_LIKE_userMobile"
        placeholder="根据手机号查找"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_LIKE_userEmail"
        placeholder="根据邮箱查找"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="qureyList.s_LIKE_addressDetail"
        placeholder="根据地址查找"
        style="width: 200px;"
        class="filter-item"
        clearable
      />

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

      <el-table-column label="姓名" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="邮箱">
        <template slot-scope="scope">{{ scope.row.userEmail ||"无" }}</template>
      </el-table-column>

      <el-table-column label="电话">
        <template slot-scope="scope">{{ scope.row.userMobile ||"无" }}</template>
      </el-table-column>

      <el-table-column label="地址">
        <template slot-scope="scope">{{ scope.row.fullAddress }}</template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
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
import { addressList } from '@/api/grapefruit/grapefruitlist'
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
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      formLabelWidth: '120px'
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
    // 获取列表
    fetchData(params = this.qureyList) {
      this.listLoading = true
      addressList(params).then(response => {
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

