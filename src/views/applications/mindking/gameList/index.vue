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
          <el-select v-model="qureyList.coinId" clearable placeholder="请选择币种">
            <el-option label="全部" value />
            <el-option label="AC" value="10000002" />
            <el-option label="EOS" value="10000001" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="qureyList.status" clearable placeholder="请选择游戏状态">
            <el-option label="全部" value />
            <el-option label="待开始" value="1" />
            <el-option label="进行中" value="2" />
            <el-option label="结算中" value="3" />
            <el-option label="已完成" value="4" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
        </el-form-item>
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
      <el-table-column align="center" label="游戏id" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="游戏币种" align="center">
        <template slot-scope="scope">{{ scope.row.coinId }}</template>
      </el-table-column>

      <el-table-column label="游戏名" align="center">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="题目数量" align="center">
        <template slot-scope="scope">{{ scope.row.questionNum }}</template>
      </el-table-column>

      <el-table-column label="游戏描述">
        <template slot-scope="scope">{{ scope.row.description }}</template>
      </el-table-column>

      <el-table-column label="游戏状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status==1">待开始</span>
          <span v-if="scope.row.status==2">进行中</span>
          <span v-if="scope.row.status==3">结算中</span>
          <span v-if="scope.row.status==4">已完成</span>
        </template>
      </el-table-column>
      <el-table-column label="奖池数量" align="center">
        <template slot-scope="scope">{{ scope.row.rewardPool }}</template>
      </el-table-column>
      <el-table-column label="奖励勋章数" align="center">
        <template slot-scope="scope">{{ scope.row.rewardTicket }}</template>
      </el-table-column>
      <el-table-column label="报名费用" align="center">
        <template slot-scope="scope">{{ scope.row.signupCost }}</template>
      </el-table-column>
      <el-table-column label="报名类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.signupType==0">无需报名</span>
          <span v-if="scope.row.signupType==1">扣除勋章报名</span>
          <span v-if="scope.row.signupType==2">扣除AC报名</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="开始时间" width="160">
        <template slot-scope="scope">{{ scope.row.startTime }}</template>
      </el-table-column>

      <el-table-column prop="created_at" label="操作" width="320">
        <template slot-scope="scope">
          <el-button type="success" @click="toDeatil(scope.row)">编辑</el-button>
          <el-button type="success" @click="config(scope.row)">配置</el-button>
          <el-button type="success" @click="deleteone(scope.row)">删除</el-button>
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
    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogQuestionVisible" title="选择题目">
      <question-bank :isConfig='true' :gameId='gameId'></question-bank>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
  </div>
</template>

<script>
import {
  getGameList, deleteGame, getByIdQuestion
} from '@/api/mindkingMoudle/index'
import moment from 'moment'
import questionBank from '../questionBank/index'
export default {
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     published: 'success',
    //     draft: 'gray',
    //     deleted: 'danger'
    //   }
    //   return statusMap[status]
    // }
  },
  data() {
    return {
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        status: '',
        coinId: ''
      },
      dialogQuestionVisible: false,
      gameId: '',
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      // form: {},
      rules: {
        shipSn: [{ required: true, message: '请填入订单号', trigger: 'blur' }],
        shipChannel: [
          { required: true, message: '请输入快递公司', trigger: 'blur' }
        ]
      } // rr
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
  components: {
    questionBank
  },
  created() {
    this.fetchData()
  },

  methods: {
    //删除一场游戏
    deleteone(val){
      this.$confirm('删除游戏后无法恢复, 是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteGame({gameId: val.id}).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.fetchData()
        })
      })
    },

    config(item) {
      this.gameId = item.id
      this.dialogQuestionVisible = true
    },

    addone(){
      this.$router.push({
        path: '/applications/mindking/game-list-add-edit',
        query: {
          id: ''
        }
      })
    },

    toDeatil(item) {
      console.log(item)
      this.$router.push({
        path: '/applications/mindking/game-list-add-edit',
        query: {
          id: item.id
        }
      })
    },

    // 获取列表
    fetchData() {
      const params = Object.assign({}, this.qureyList)
      if (params.data) {
        params.s_BT_createTime_START = params.data[0]
        params.s_BT_createTime_END = params.data[1]
        delete params.data
      }
      this.listLoading = true
      getGameList(params).then(response => {
        // console.log(response.data)
        this.list = response.data
        this.list.list.map((item)=>{
          item.createTime = moment(item.createTime).format('YYYY-MM-DD hh:mm:ss')
          item.startTime = moment(item.startTime).format('YYYY-MM-DD hh:mm:ss')
          return item
        })
        this.listLoading = false
      })
    }, // fetchData
    // cancel(formName) {
    //   this.$refs['form'].resetFields()
    // },
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) {
      // 分页加载
      console.log(type)
      this.qureyList.pageNum = type
      this.fetchData()
    }
  }
}
</script>

