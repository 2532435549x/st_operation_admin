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
        <el-form-item v-if="!isConfig">
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
      <el-table-column align="center" label="奖品id" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="奖品名称" align="center">
        <template slot-scope="scope">{{ scope.row.message }}</template>
      </el-table-column>

      <el-table-column label="类型" align="center">
        <template slot-scope="scope">{{ scope.row.status }}</template>
      </el-table-column>
      <el-table-column label="币种" align="center">
        <template slot-scope="scope">{{ scope.row.type }}</template>
      </el-table-column>

      <el-table-column prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button v-if="!isConfig" type="success" @click="toDeatil(scope.row)">编辑</el-button>
          <!-- <el-button v-if="!isConfig" type="success" @click="deleteP(scope.row)">删除</el-button> -->
          <el-button v-if="isConfig" :type="scope.row.isChoose ? 'disable' : 'success'" @click="choose(scope.row)">{{ scope.row.isChoose ? '已选择' : '选择' }}</el-button>
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
  getPrizeList, deletePrize
} from '@/api/turntableModule/index'
// import moment from 'moment'
export default {

  props: {
    isConfig: {
      type: Boolean,
      default: false
    },
    gameId: {
      type: Number,
      default: 0
    }
  },
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
        // if(this.isConfig)this.configQuestion()
      },
      deep: true
    },
    async gameId() {
      // await this.getByIdQuestionList()
      // this.configQuestion()
      // console.log(this.gameId)
    }
  },
  async created() {
    await this.fetchData()
    if (this.isConfig) {
      // await this.getByIdQuestionList()
      // this.configQuestion()
    }
  },

  methods: {

    // 删除一场游戏
    deleteP(val) {
      this.$confirm('删除题目后无法恢复, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePrize({ id: val.id }).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fetchData()
        })
      })
    },
    async choose(options) {
      // console.log(options)
      this.$emit('choose', options)
    },

    addone() {
      this.$router.push({
        path: '/applications/turntable/prize-add-edit',
        query: {
          id: ''
        }
      })
    },

    toDeatil(item) {
      console.log(item)
      this.$router.push({
        path: '/applications/turntable/prize-add-edit',
        query: {
          id: item.id
        }
      })
    },

    // async getByIdQuestionList() {
    //   // this.listLoading = true
    //   // let response = await getByIdQuestion({gameId: this.gameId})
    //   // getByIdQuestion({gameId: this.gameId}).then(response => {
    //   this.gameQuestionList = response.data
    //   // console.log(this.gameQuestionList)
    //   // })
    // },

    // configQuestion() {
    //   this.list.list = this.list.list.map((item) => {
    //     this.gameQuestionList.map((queItem) => {
    //       if(item.questionId == String(queItem.id)){
    //         item.isChoose = true
    //       }
    //     })
    //     return item
    //   })
    //   // console.log(this.gameQuestionList)
    //   // console.log(this.list.list)
    // },

    // 获取列表
    async fetchData() {
      const params = Object.assign({}, this.qureyList)
      if (params.data) {
        params.s_BT_createTime_START = params.data[0]
        params.s_BT_createTime_END = params.data[1]
        delete params.data
      }
      this.listLoading = true
      const response = await getPrizeList(params)
      this.list = response.data
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

