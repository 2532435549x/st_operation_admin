<!--
 * @Date: 2019-07-29 14:23:28
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-16 11:18:38
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label>
          <el-input v-model="queryList.toName" placeholder="请输入接收收益的账户名" clearable />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="queryList.fromName" placeholder="请输入发放收益的账户名" clearable />
        </el-form-item>-->

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
          <el-button type="primary" @click="toDetail(0)">新增</el-button>
          <!-- <el-button type="primary" @click="handleclearSelection">取消选择</el-button> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- @expand-change="expandFun" -->
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      max-height="800"
    >
      <!--   @sort-change="changeSort" -->
      <!-- 拓展 -->
      <!-- <el-table-column type="expand" width="50">
        <template slot-scope="scope">
          <el-form class="demo-table-expand" style="float: right">
            <p style="color:#0277BD; font-size:16px; font-weight: bold;">游戏币相关数据</p>
            <el-form-item label="游戏币发放账户：">{{ scope.row.coinsForm || '暂无数据' }}</el-form-item>
            <el-form-item label="权限：">{{ scope.row.coinsPermission || '暂无数据' }}</el-form-item>
            <el-form-item label="合约账户：">{{ scope.row.coinsContract || '暂无数据' }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>-->

      <!-- <el-table-column type="selection" width="55" /> -->

      <el-table-column label="序号" align="center" width="50" prop="scope">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="产品id" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.id || "暂无数据" }}</template>
      </el-table-column>

      <!-- <el-table-column label="矿机id" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.miningMachineId || "暂无数据" }}</template>
      </el-table-column>-->

      <el-table-column label="挖矿账号" align="center" width="150">
        <template slot-scope="scope">{{ scope.row.machineAccount || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="产品名称" align="center" width="230">
        <template slot-scope="scope">{{ scope.row.subject || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="产品期数" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.periodOrdinal || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="总共EOS数量" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.totalEosNum || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="单份额EOS数量" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.unitEosNum || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="是否开启认购" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.enable">开启</span>
          <span v-if="!scope.row.enable">关闭</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" sortable prop="createTime">
        <template slot-scope="scope">{{ scope.row.createTime || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="toDetail(1,scope.row.id)">编辑</el-button>
          <el-button type="primary" size="mini" @click="toDetail(2,scope.row.id)">详情</el-button>
          <el-button
            type="success"
            size="mini"
            @click="$router.push({name:'subscription-list',query:{subscribeRecordId:scope.row.id}})"
          >查看认购</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页栏 -->
    <div v-if="listData.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="listData.total"
          :page-size="listData.pageSize"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!listData.total" class="list list1">暂无数据</div>
    </div>
  </div>
</template>

<script>
import * as product from '@/api/eidos/product'
export default {
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      listData: {}, // 列表数据
      title: '',
      listLoading: false
    }
  },
  computed: {
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        if (val) {
          this.fetchData()
        }
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // todetitl
    toDetail(type, id) {
      console.log('type: ', type)
      console.log('id: ', id)
      const params = {
        type,
        id
      }
      this.$router.push({
        name: 'productDetail',
        query: params
      })
    },
    // 切换排序
    changeSort(type) {
      console.log('type: ', type)
    },
    /**
     * @description: 为避免饿了么组件交替显示时发生抖动，延迟触发某些操作
     * @methods: closeLoading cancelOperation
     * @param: none
     * @return: none
     */
    openLoading() {
      this.listLoading = true
    },

    closeLoading() {
      setTimeout(() => {
        this.listLoading = false
      }, 200)
    },

    async refresh() {
      const res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '刷新失败！',
          type: 'error'
        })
      }
    }, // 刷新操作

    async fetchData() {
      this.openLoading()
      const params = Object.assign({}, this.queryList)
      try {
        const res = await product.productList(params)
        if (res.code === 1000) {
          this.listData = res.data
          this.dialogFormVisible = false
          this.closeLoading()
          return { result: true, text: 'success' }
        } else {
          this.closeLoading()
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.closeLoading()
        return { result: false, text: e }
      }
    },
    // 获取列表数据

    formatDate(now) {
      if (now) {
        const newDate = new Date(now)
        const year = newDate.getFullYear()
        const month = newDate.getMonth() + 1
        const date = newDate.getDate()
        let hour = newDate.getHours()
        let minute = newDate.getMinutes()
        let second = newDate.getSeconds()
        hour = hour < 10 ? '0' + hour : hour
        minute = minute < 10 ? '0' + minute : minute
        second = second < 10 ? '0' + second : second
        return (
          year +
          '-' +
          month +
          '-' +
          date +
          ' ' +
          hour +
          ':' +
          minute +
          ':' +
          second
        )
      } else {
        return false
      }
    }, // 日期处理

    getPage(type) {
      this.queryList.pageNum = type
    } // 分页查询 style = 0 为上一页 1 为下页
  }
}
</script>
<style>
.demo-table-expand {
  font-size: 0;
  width: 50%;
}
.demo-table-expand label {
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  /* width: 50%; */
}
</style>

