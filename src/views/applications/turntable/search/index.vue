<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-30 17:25:38
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="qureyList.message"
            placeholder="请输入奖品名称"
            style="width: 200px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="qureyList.name"
            placeholder="请输入用户姓名"
            style="width: 200px;"
            class="filter-item"
            clearable
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="qureyList.phone"
            placeholder="请输入用户电话"
            style="width: 200px;"
            class="filter-item"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="账户名字" width="100">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="奖品名称" align="center">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </el-table-column>

      <el-table-column label="状态" align="center">
        <template slot-scope="scope">{{ scope.row.status == 0 ? '未发放奖励' : '已发放奖励' }}</template>
      </el-table-column>

      <el-table-column label="用户姓名" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
      <el-table-column label="用户电话" align="center">
        <template slot-scope="scope">{{ scope.row.phone }}</template>
      </el-table-column>
      <el-table-column label="用户地址" align="center">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>

      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column prop="created_at" label="操作" width="100">
        <template slot-scope="scope">
          <el-button v-if="scope.row.status == 0" type="success" @click="send(scope.row)">发货</el-button>
          <!-- <p>{{scope.row.isChoose}}</p> -->
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
import {
  searchHistory, sendPrize
} from '@/api/turntableModule/index'
import moment from 'moment'
export default {
  // filters: {
  // },
  data() {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        message: '',
        name: '',
        phone: ''
      },
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      form: {},
      rules: {
      } // rr
    }
  },

  watch: {
    'qureyList.pageNum': {
      async handler(val, oldVal) {
        await this.fetchData()
      },
      deep: true
    },
  },
  async created() {
    await this.fetchData()
  },

  methods: {
    send(val){
      this.$confirm('确定物品寄出后发货, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        sendPrize({
          id: val.id,
          status: 1,
        }).then(response => {
          this.$message({
            type: 'success',
            message: '发货成功'
          })
          this.fetchData()
        })
      })
    },

    // 获取列表
    async fetchData() {
      const params = Object.assign({}, this.qureyList)
      if (params.data) {
        params.s_BT_createTime_START = params.data[0]
        params.s_BT_createTime_END = params.data[1]
        delete params.data
      }
      this.listLoading = true
      let response = await searchHistory(params)
      this.list = response.data
      this.list.list.map((item)=>{
        item.createTime = moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')
        return item
      })
      this.listLoading = false
      // })
    }, 

    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) {
      // 分页加载
      // console.log(type)
      this.qureyList.pageNum = type
      // this.fetchData()
    }
  }
}
</script>

