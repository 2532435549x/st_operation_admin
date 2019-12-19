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
          <el-button class="filter-item" type="primary" @click="addone()">新增</el-button>
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
      <el-table-column align="center" label="id" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="链类型" align="center">
        <template slot-scope="scope">{{ scope.row.chainType }}</template>
      </el-table-column>

      <el-table-column label="代币名称" align="center">
        <template slot-scope="scope">{{ scope.row.symbol }}</template>
      </el-table-column>
      <el-table-column label="合约账户" align="center">
        <template slot-scope="scope">{{ scope.row.contract }}</template>
      </el-table-column>

      <el-table-column prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="success" @click="toDeatil(scope.row)">编辑</el-button>
          <el-button type="success" @click="deleteP(scope.row)">删除</el-button>
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
  getContractList, deleteContract
} from '@/api/turntableModule/index'
// import moment from 'moment'
export default {
  // filters: {
  // },
  data() {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 10
      },
      // gameQuestionList:[],
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
    qureyList: {
      async handler(val, oldVal) {
        await this.fetchData()
        // this.configQuestion()
      },
      deep: true
    }
  },
  async created() {
    await this.fetchData()
  },

  methods: {

    // 删除一场游戏
    deleteP(val) {
      this.$confirm('删除后无法恢复, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteContract({ id: val.id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fetchData()
        })
      })
    },
    addone() {
      this.$router.push({
        path: '/applications/turntable/contract-edit',
        query: {
          id: ''
        }
      })
    },

    toDeatil(item) {
      console.log(item)
      this.$router.push({
        path: '/applications/turntable/contract-edit',
        query: {
          id: item.id
        }
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
      const response = await getContractList(params)
      console.log(response)
      this.list.list = response.data
      // this.list.list.map((item)=>{
      //   // item.createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss')
      //   item.isChoose = false
      //   return item
      // })
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

