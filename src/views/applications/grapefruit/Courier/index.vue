<!--
 * @Description: grapefruitSetting
 * @Author: wangyun
 * @Date: 2019-08-29 14:04:57
 * @LastEditors: wangyun
 * @LastEditTime: 2019-08-29 14:18:29
 -->
<template>
  <div class="contarin">
    <div style="padding:10px 10px">
      <el-input
        v-model="params.s_LIKE_description"
        placeholder="配置描述"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-button class="filter-item" type="primary" @click="limitCart()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="toAddShipChanel()">新增</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="80">
        <template slot-scope="scope">{{ scope.$index + 1 + (params.pageNum - 1) * params.pageSize }}</template>
      </el-table-column>

      <!-- <el-table-column label="配置组" width="200" align="center">
        <template slot-scope="scope">{{ scope.row.cfgGroup }}</template>
      </el-table-column>

      <el-table-column label="配置名称" align="center" width="140">
        <template slot-scope="scope">{{ scope.row.cfgName }}</template>
      </el-table-column>-->

      <el-table-column label="公司名称" align="center">
        <template slot-scope="scope">{{ scope.row.cfgName ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="公司英文名称" width="125" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.cfgValue }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="135" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime }}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" width="135" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.updateTime }}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible(scope.row)">编辑</el-button>
          <el-button type="warn" @click="deleteShip(scope.row.id)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="公司名称">
          <el-input v-model="form.cfgName" :min="1" :max="1000" />
        </el-form-item>

        <el-form-item label="公司英文名称">
          <el-input v-model="form.cfgValue" :min="1" :max="1000" />
        </el-form-item>

        <el-form-item label="公司描述">
          <el-input v-model="form.description" :min="1" :max="1000" />
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
import { listShipChannel, addShipChannel, editShipChannel, deleteShipChannel } from '@/api/grapefruit/grapefruitlist'
export default {
  data() {
    return {
      form: {},
      title: '修改',
      dialogFormVisible: false,
      listLoading: false,
      params: {
        pageSize: 20,
        pageNum: 1
      },
      list: {}
    }
  },
  watch: {
    params: {
      handler(newVal, old) {
        this.getDlist()
      },
      deep: true
    }
  },
  mounted() {
    this.getDlist()
  },
  methods: {
    // 删除
    async deleteShip(id) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const result = await deleteShipChannel({ id })
        if (result.code == 1000) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDlist()
          return
        } else {
          this.$message({
            type: 'info',
            message: result.message
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    toAddShipChanel() {
      this.title = '新增'
      this.form = {}
      this.dialogFormVisible = true
    },
    getDlist(params = this.params) {
      listShipChannel(params).then(res => {
        console.log(res.data)
        this.list = res.data
      })
    },
    formVisible(item) {
      console.log(item)
      this.title = '修改'
      this.form = item
      this.dialogFormVisible = true
    },
    limitCart() {
      this.getDlist()
    },
    async submitForm() {
      if (!this.form.cfgName || !this.form.cfgValue || !this.form.description) {
        this.$message({
          message: `请完成填写`,
          type: 'info'
        })
        return
      }
      if (this.title == '修改') {
        editShipChannel(this.form).then(res => {
          this.$message({
            message: `${res.message}`,
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getDlist()
        })
      }
      if (this.title == '新增') {
        addShipChannel(this.form).then(res => {
          this.$message({
            message: `${res.message}`,
            type: 'success'
          })
          this.dialogFormVisible = false
          this.getDlist()
        })
      }
    },
    cancel() {
      this.dialogFormVisible = false
    }
  }
}
</script>

<style>
.contarin {
  padding: 10px 30px;
}
</style>
