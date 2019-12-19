<!--
 * @Description: resourceGroup -> resRent -> list
 * @Author: wangyun
 * @Date: 2019-09-09 11:07:48
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-12 17:51:01
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单处理 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊查询">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_account" placeholder="输入购买用户查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_subject" placeholder="输入商品名称查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_paymentType" clearable placeholder="选择支付类型">
            <el-option :label="'全部'" :value="null"></el-option>
            <el-option :label="'支付宝'" :value="2"></el-option>
            <el-option :label="'微信'" :value="1"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_orderStatus" clearable placeholder="选择订单状态">
            <el-option :label="'全部'" :value="null"></el-option>
            <el-option
              v-for="(item, index) in orderStatusOption"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单处理 -->
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="ID">{{ scope.row.id }}</el-form-item>
            <el-form-item label="订单备注">{{ scope.row.remark }}</el-form-item>
            <el-form-item label="订单编号">{{ scope.row.orderCode }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="购买用户" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.account }}</template>
      </el-table-column>

      <el-table-column label="商品名称" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.subject }}</template>
      </el-table-column>

      <el-table-column label="订单备注" align="center" min-width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.remark }}</template>
      </el-table-column>

      <el-table-column label="商品金额" sortable="price" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>

      <el-table-column label="下单时间" align="center" sortable="create_time" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.createTime ? scope.row.createTime : '暂无数据'}}</template>
      </el-table-column>

      <el-table-column label="支付类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.paymentType | typeFilter" effect="plain">
            <template v-if="row.paymentType == 2">支付宝</template>
            <template v-else-if="row.paymentType == 1">微信</template>
            <template v-else>未知</template>
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="支付时间" align="center" sortable="payment_time" width="180" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.paymentTime ? scope.row.paymentTime : '暂无数据'}}</template>
      </el-table-column>

      <el-table-column label="订单状态" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag
            :type="row.orderStatus | orderStatusTypeFilter"
          >{{ row.orderStatus | orderStatusFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="success" size="mini" @click="formVisible('tips',scope.row)">备注</el-button>
          <el-button type="primary" size="mini" @click="formVisible('detail',scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="添加备注" prop="remark">
          <el-input
            v-model="form.remark"
            :autosize="{minRows: 2, maxRows: 5}"
            type="textarea"
            placeholder="请添加备注"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        v-if="listData.total !=0"
        :total="listData.total"
        :page-size="listData.pageSize"
        :hide-on-single-page="true"
        :current-page.sync="queryList.pageNum"
        @current-change="handleCurrentChange"
        background
        layout="prev, pager, next"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>
<script>
import { resRentOrderList, orderRemark } from '@/api/resourceRent/order'

export default {
  filters: {
    orderStatusFilter(val) {
      const orderStatusMaps = {
        1: '预支付订单',
        2: '支付成功',
        3: '业务处理成功',
        4: '支付失败',
        5: '业务处理失败'
      }
      return orderStatusMaps[val]
    },

    orderStatusTypeFilter(type) {
      let colorType = ''
      switch (type) {
        case 1:
          colorType = 'warning'
          break
        case 2:
          colorType = 'success'
          break
        case 3:
          colorType = 'success'
          break
        case 4:
          colorType = 'danger'
          break
        case 5:
          colorType = 'danger'
          break
        default:
          colorType = 'primary'
      }
      return colorType
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        orderBy: 'create_time DESC'
      },
      listData: {},
      orderStatusOption: [
        { label: '预支付订单', value: 1 },
        { label: '支付成功', value: 2 },
        { label: '业务处理成功', value: 3 },
        { label: '支付失败', value: 4 },
        { label: '业务处理失败', value: 5 }
      ],
      dialogFormVisible: false,
      title: '添加备注',
      form: {},
      rules: {
        remark: [{ required: true, message: '请填写备注' }]
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum')
    this.queryList.pageNum == 1 && this.fetchData() // 这里只判断页面为1的情况 其他情况会触发监听方法
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      res.result &&
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
    },

    async fetchData() {
      this.dialogFormVisible = false

      try {
        let res = await resRentOrderList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    formVisible(style, item) {
      console.log('item: ', item)
      switch (style) {
        case 'detail':
          this.$router.push({
            path: '/resourceRent/resRent/resRent-detail',
            query: { style, id: item.id }
          })
          break
        case 'tips':
          this.dialogFormVisible = true
          this.form = Object.assign({}, this.form, {
            id: item.id,
            remark: item.remark
          })
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          orderRemark({
            id: this.form.id,
            remark: this.form.remark
          }).then(v => {
            this.$notify.success('添加成功')
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // 翻页处理
  }
}
</script>