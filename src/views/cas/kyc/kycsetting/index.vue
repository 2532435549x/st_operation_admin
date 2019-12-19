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
      <!-- <el-input
        v-model="params.s_LIKE_description"
        placeholder="配置描述"
        style="width: 200px;"
        class="filter-item"
        clearable
      /> -->
      <el-button class="filter-item" type="primary" @click="limitCart()">刷新</el-button>
      <el-button class="filter-item" type="primary" @click="formVisible(0)">新增</el-button>
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
      <el-table-column label="原因" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.cfgName }}</template>
      </el-table-column>

      <el-table-column label="多语言配置" width="500" align="center">
        <template slot-scope="scope">
          <p class="cfgValue">
            中文：
            <span>{{ scope.row.cfgValue.cn}}</span>
          </p>
          <p class="cfgValue">
            英文：
            <span>{{ scope.row.cfgValue.en}}</span>
          </p>
          <p class="cfgValue">
            韩文：
            <span>{{ scope.row.cfgValue.ko}}</span>
          </p>
          <p class="cfgValue">
            西班牙文：
            <span>{{ scope.row.cfgValue.es}}</span>
          </p>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="300" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.createTime }}</div>
        </template>
      </el-table-column>

      <el-table-column label="修改时间" width="300" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.updateTime }}</div>
        </template>
      </el-table-column>

      <el-table-column align="center" fixed="right" prop="created_at" label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" @click="formVisible(1,scope.row)">编辑</el-button>
          <el-button type="danger" @click="deleteinfor(scope.row)">删除</el-button>
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
    <el-dialog :visible.sync="dialogFormVisible" :title="a==1?title1:title">
      <el-form ref="form" :model="form" label-width="100px" class="demo-ruleForm">
        <el-form-item label="原因" required>
          <el-input v-model="form.cfgName" :min="1" :max="1000" />
        </el-form-item>
        <span class="morelanguage">多语言配置</span>
        <el-form-item label="中文" required>
          <el-input v-model="form.cfgValue.cn" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="英文" required>
          <el-input v-model="form.cfgValue.en" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="韩文" required>
          <el-input v-model="form.cfgValue.ko" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item label="西班牙文" required>
          <el-input v-model="form.cfgValue.es" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-if="a" @click="submitForm('form')">确定</el-button>
          <el-button type="primary" v-if="b" @click="submitForm1('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
    <!-- </el-table> -->
  </div>
</template>

<script>
import {
  listAuditMessage,
  addAuditMessage,
  editAuditMessage,
  deleteAuditMessage
} from '@/api/casModule'
export default {
  data() {
    return {
      form: {
        cfgValue: {}
      },
      title: '修改',
      title1: '新增',
      dialogFormVisible: false,
      listLoading: false,
      params: {
        pageSize: 20,
        pageNum: 1
      },
      list: {},
      a: 0,
      b: 0
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
    onSubmit() {
      console.log('submit!')
    },
    deleteinfor(id) {
      const params = {
        id: id.id
      }
      this.$confirm('是否继续删除改配置?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteAuditMessage(params).then(res => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
          })
          this.getDlist()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getDlist() {
      listAuditMessage(this.params).then(res => {
        console.log(res.data)
        this.list = res.data
        this.list.list.map(i => {
          i.cfgValue = JSON.parse(i.cfgValue)
        })
        console.log('xiaoli', this.list)
      })
    },
    formVisible(type, item) {
      if (type == 0) {
        this.form = {
          cfgValue: {}
        }
        this.a = 1
        this.b = 0
        this.dialogFormVisible = true
      } else {
        this.form = Object.assign({}, item)
        this.b = 1
        this.a = 0
        this.dialogFormVisible = true
      }
    },
    limitCart() {
      this.getDlist()
    },
    submitForm(data) {
      let obj = Object.assign({}, this.form)
      obj.cfgValue = JSON.stringify(obj.cfgValue)
      addAuditMessage(obj).then(res => {
        this.$message({
          message: `${res.message}`,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getDlist()
      })
    },
    submitForm1(data) {
      let obj = Object.assign({}, this.form)
      obj.cfgValue = JSON.stringify(obj.cfgValue)
      editAuditMessage(obj).then(res => {
        this.$message({
          message: `${res.message}`,
          type: 'success'
        })
        this.dialogFormVisible = false
        this.getDlist()
      })
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
.morelanguage {
  display: inline-block;
  text-align: right;
  vertical-align: middle;
  font-size: 14px;
  color: #606266;
  font-weight: 700;
  padding: 0 12px 18px 18px;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
}
.cfgValue {
  color: #409eff;
  width: 100%;
}
.cfgValue > span {
  color: #606266;
}
</style>
