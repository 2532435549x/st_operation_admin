<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-11 15:27:57
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="params.s_LIKE_content"
        placeholder="内容"
        style="width: 200px;"
        class="filter-item"
        clearable
      />

      <el-select v-model="params.s_EQ_type" placeholder="消息类型">
        <el-option label="全部" value />
        <el-option label="订单相关" value="3" />
        <el-option label="柚子街系统相关" value="4" />
      </el-select>

      <el-select v-model="params.s_EQ_isRead" placeholder="是否处理">
        <el-option label="全部" value />
        <el-option label="未处理" value="0" />
        <el-option label="已处理" value="1" />
      </el-select>

      <el-date-picker
        v-model="params.s_BT_createTime_START"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开开始日期"
      />

      <el-date-picker
        v-model="params.s_BT_createTime_END"
        type="date"
        placeholder="选择结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />

      <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>

      <el-button class="filter-item" type="primary" @click="getNewList">标记已处理</el-button>
    </div>
    <el-table
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <!-- <el-table-column label="订单号">
        <template slot-scope="scope">{{ scope.row.content.orderInfo.orderSn }}</template>
      </el-table-column>-->

      <el-table-column label="标题">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="处理状态" width="100">
        <template slot-scope="scope">{{ scope.row.isRead ? "已处理":"未处理" }}</template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
        <!-- <template slot-scope="scope">
          <el-button type="primary" @click="toRead(1,scope.row.content)">详情</el-button>
        </template>-->
      </el-table-column>
    </el-table>
    <div v-if="list.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="list.total"
          :page-size="list.pageSize"
          :current-page="list.pageNum"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!list.total" class="list list1">暂无数据</div>
    </div>

    <el-dialog :visible.sync="dialogFormVisible" title="消息">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" label="订单ID">
          <el-input v-model="form.id" readonly />
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="订单号">
          <el-input v-model="form.orderSn" readonly />
        </el-form-item>

        <el-form-item :label-width="formLabelWidth" label="姓名">
          <el-input v-model="form.consignee" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="地址">
          <el-input v-model="form.address" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="电话">
          <el-input v-model="form.mobile" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="订单状态">
          <el-input v-model="form.orderStatusText" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="价格">
          <el-input v-model="form.paymentPrice" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="支付方式">
          <el-input v-model="form.paymentTypeName" readonly />
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="邮编">
          <el-input v-model="form.postalCode" readonly />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { message, setMessageRead } from '@/api/grapefruit/grapefruitlist'
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
      params: {},
      messageIds: [],
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
      },
      keywordSearch: '',
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
    },
    params: {
      handler(val, oldVal) {
        this.qureyList = {
          pageNum: 1,
          pageSize: 10
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    getNewList() {
      const messageIds = (this.messageIds.map(i => i.id)).join(',')
      this.$confirm('确认已处理?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await setMessageRead({ messageIds: messageIds })
        this.qureyList = {
          pageNum: 1,
          pageSize: 10
        }
        console.log('result: ', result)
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    handleSelectionChange(val) {
      this.messageIds = val
    },
    toRead(style, item) {
      console.log('item: ', item)
      if (!item.orderInfo) {
        this.$alert(item, '消息', {
          confirmButtonText: '确定',
          callback: action => {
            this.$message({
              type: 'info',
              message: `action: ${action}`
            })
          }
        })
        return
      }
      this.dialogFormVisible = true
      this.form = item.orderInfo
      console.log(this.form)
    },
    // 获取列表
    fetchData() {
      const params = Object.assign({}, this.qureyList, this.params)
      message(params).then(response => {
        // response.data.list.map(i => {
        //   if (i.type == 3) {
        //     i.content = JSON.parse(i.content)
        //   }
        // })
        this.list = response.data
        console.log('this.list: ', response.data)
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

