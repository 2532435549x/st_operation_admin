<!--
 * @Description:12558512
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-18 15:30:00
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline>
        <el-form-item>
          <el-input
            v-model="params.s_LIKE_orderSn"
            placeholder="请输入订单号"
            style="width: 200px;"
            class="filter-item"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="params.s_LIKE_consignee"
            placeholder="请输入收货人"
            style="width: 200px;"
            class="filter-item"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-select v-model="params.s_IN_orderServiceStatus" clearable placeholder="请选择订单状态">
            <el-option label="全部" value />
            <el-option label="待发货" value="201" />
            <el-option label="待收货" value="301" />
            <el-option label="已完成" value="401,402 " />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="params.s_EQ_deleted" clearable placeholder="请选择删除状态">
            <el-option label="全部" value />
            <el-option label="未删除" value="0" />
            <el-option label="已删除" value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-date-picker
            v-model="params.data"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />-->
          <el-date-picker
            v-model="params.data"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getExcelAll">导出表格</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getExcelShip">导出发货表格</el-button>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="getExcelFinancial">导出对账表格</el-button>
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
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="订单号" align="center">
        <template slot-scope="scope">{{ scope.row.orderSn }}</template>
      </el-table-column>

      <el-table-column label="备注" align="center">
        <template slot-scope="scope">{{ scope.row.message ||"无" }}</template>
      </el-table-column>

      <el-table-column label="收货人姓名" align="center">
        <template slot-scope="scope">{{ scope.row.consignee }}</template>
      </el-table-column>

      <el-table-column label="收货人联系方式" align="center">
        <template slot-scope="scope">{{ scope.row.mobile }}</template>
      </el-table-column>

      <el-table-column label="收货人地址">
        <template slot-scope="scope">{{ scope.row.address }}</template>
      </el-table-column>

      <el-table-column label="订单状态">
        <template slot-scope="scope">
          <span v-if="scope.row.orderServiceStatus==101">未支付</span>
          <span v-if="scope.row.orderServiceStatus==102">用户取消订单</span>
          <span v-if="scope.row.orderServiceStatus==103">支付超时，订单已取消</span>
          <span v-if="scope.row.orderServiceStatus==201">待发货</span>
          <span v-if="scope.row.orderServiceStatus==202">待退款</span>
          <span v-if="scope.row.orderServiceStatus==203">退款成功</span>
          <span v-if="scope.row.orderServiceStatus==301">待收货</span>
          <span v-if="scope.row.orderServiceStatus==401">已收货</span>
          <span v-if="scope.row.orderServiceStatus==402">订单结束</span>
        </template>
      </el-table-column>

      <el-table-column label="订单是否删除" align="center">
        <template slot-scope="scope">{{ scope.row.deleted ?'是':"否" }}</template>
      </el-table-column>

      <el-table-column label="创建时间" width="160">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column prop="created_at" label="操作" width="240">
        <template slot-scope="scope">
          <el-button type="success" @click="toDeatil(scope.row)">订单详情</el-button>
          <el-button
            v-if="scope.row.orderServiceStatus ==201"
            type="primary"
            @click="toShip(scope.row)"
          >发货</el-button>
        </template>
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
    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="发货信息">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="订单号">
          <el-input v-model="form.orderId" readonly />
        </el-form-item>

        <el-form-item label="运单号" prop="shipSn">
          <el-input v-model="form.shipSn" placeholder="请填入运单号" />
        </el-form-item>

        <el-form-item label="快递公司" prop="shipChannel">
          <el-select v-model="form.shipChannel" placeholder="请选择" @change="changeshipChannel">
            <el-option
              v-for="item in ShipChanelList"
              :key="item.id"
              :label="item.cfgName"
              :value="item.cfgName"
            />
          </el-select>
          <!-- <el-input v-model="form.shipChannel" placeholder="请填入快递公司" /> -->
        </el-form-item>

        <el-form-item label="快递公司英文" prop="shipChannel">
          <el-input v-model="form.shipChannelEn" readonly placeholder="请填入英文快递公司" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
  </div>
</template>

<script>
import {
  orderList,
  orderShip,
  exportExcelAll,
  exportExcelShip,
  exportExcelFinancial,
  listShipChannel
} from '@/api/grapefruit/grapefruitlist'

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
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      ShipChanelList: [],
      listLoading: true,
      dialogFormVisible: false,
      form: {},
      keywordSearch: '',
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
    },
    params: {
      handler(val, oldVal) {
        console.log('val: ', val)
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
    this.getDlist()
  },
  methods: {
    changeshipChannel(e) {
      console.log('e: ', e)
      this.ShipChanelList.map(i => {
        if (i.cfgName == this.form.shipChannel) {
          this.form.shipChannelEn = i.cfgValue
        }
      })
    },
    // 获取快递公司列表
    getDlist() {
      const params = {
        pageNum: 1,
        pageSize: 100
      }
      listShipChannel(params).then(res => {
        console.log(res.data)
        this.ShipChanelList = res.data.list
      })
    },
    async getExcelAll() {
      this.$confirm('没有选择日期会下载当月的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('请设置下载的文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: new Date().getTime()
          })
            .then(async({ value }) => {
              const params = Object.assign({}, this.qureyList, this.params)
              if (this.params.data) {
                params.s_BT_createTime_START = params.data[0]
                params.s_BT_createTime_END = params.data[1]
                delete params.data
              }
              const content = await exportExcelAll(params)
              const blob = new Blob([content])
              const fileName = value + '.xlsx'
              if ('download' in document.createElement('a')) {
                // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
              this.$message({
                type: 'success',
                message: '导出成功！'
              })
            })
            .catch(error1 => {
              console.log(error1)
              this.$message({
                type: 'info',
                message: '导出已取消'
              })
            })
        })
        .catch(error => {
          console.log(error)
          this.$message({
            type: 'info',
            message: '导出已取消'
          })
        })

      return
    },

    async getExcelShip() {
      this.$confirm('没有选择日期会下载当月的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('请设置下载的文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: new Date().getTime()
          })
            .then(async({ value }) => {
              const params = Object.assign({}, this.qureyList, this.params)
              if (this.params.data) {
                params.s_BT_createTime_START = params.data[0]
                params.s_BT_createTime_END = params.data[1]
                delete params.data
              }

              const result = await exportExcelShip(params)
              const content = result
              const blob = new Blob([content])
              const fileName = value + '.xlsx'
              if ('download' in document.createElement('a')) {
                // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
              this.$message({
                type: 'success',
                message: '导出成功！'
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '导出已取消'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '导出已取消'
          })
        })

      return
    },

    async getExcelFinancial() {
      this.$confirm('没有选择日期会下载当月的数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$prompt('请设置下载的文件名', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputValue: new Date().getTime()
          })
            .then(async({ value }) => {
              const params = Object.assign({}, this.qureyList, this.params)
              if (this.params.data) {
                params.s_BT_createTime_START = params.data[0]
                params.s_BT_createTime_END = params.data[1]
                delete params.data
              }

              const result = await exportExcelFinancial(params)
              const content = result
              const blob = new Blob([content])
              const fileName = value + '.xlsx'
              if ('download' in document.createElement('a')) {
                // 非IE下载
                const elink = document.createElement('a')
                elink.download = fileName
                elink.style.display = 'none'
                elink.href = URL.createObjectURL(blob)
                document.body.appendChild(elink)
                elink.click()
                URL.revokeObjectURL(elink.href) // 释放URL 对象
                document.body.removeChild(elink)
              } else {
                // IE10+下载
                navigator.msSaveBlob(blob, fileName)
              }
              this.$message({
                type: 'success',
                message: '导出成功！'
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '导出已取消'
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '导出已取消'
          })
        })

      return
    },

    async submitForm() {
      const result = await orderShip(this.form)
      if (result.code == 1000) {
        this.$message({
          message: `发货成功`,
          type: 'success'
        })
        this.fetchData()
        this.dialogFormVisible = false
      } else {
        this.$message({
          message: result.message,
          type: 'success'
        })
      }
    },
    toDeatil(item) {
      this.$router.push({
        path: '/applications/grapefruit/grapefruit-detail',
        query: {
          orderId: item.id
        }
      })
    },
    // 获取列表
    fetchData() {
      const params = Object.assign({}, this.qureyList, this.params)
      if (params.data) {
        console.log('params.data: ', params.data)
        params.s_BT_createTime_START = params.data[0]
        params.s_BT_createTime_END = params.data[1]
        delete params.data
      }
      this.listLoading = true
      orderList(params).then(response => {
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
    cancel(formName) {
      this.$refs['form'].resetFields()
      this.dialogFormVisible = false
    },
    // 显示编辑弹出
    toShip(...rest) {
      // 显示弹框
      this.form = {}
      this.dialogFormVisible = true
      this.form.orderId = rest[0].id
    }, // FormVisible
    // 关键词搜索
    keyWordSearch(keyword) {
      console.log(keyword)
      this.fetchData({ s_LIKE_categoryName: keyword })
    },
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

