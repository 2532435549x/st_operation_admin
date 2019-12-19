<!--
 * @Description: find -> collection -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-28 16:53:24
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_name" placeholder="请输入标题" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_nameEn" placeholder="请输入英文标题" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="''" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
            <el-option :label="'开启/关闭'" :value="''" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      v-loading="listLoading"
      :data="listData.list"
      :height="fullHeight"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="ID：">{{ scope.row.id }}</el-form-item>
            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="标题">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="标题(EN)">
        <template slot-scope="scope">{{ scope.row.nameEn }}</template>
      </el-table-column>

      <el-table-column label="简介" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="description">{{ scope.row.description }}</div>
        </template>
      </el-table-column>

      <el-table-column label="简介(EN)" show-overflow-tooltip>
        <template slot-scope="scope">
          <div class="description">{{ scope.row.descriptionEn }}</div>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="110" sortable="custom" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="所属链" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='BOS'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已开启，点击可关闭"
            icon="el-icon-check"
            circle
            size="mini"
            @click="statueExchange(scope.row,'disable')"
          />
          <el-button
            v-else
            type="danger"
            title="已关闭，点击可开启"
            icon="el-icon-close"
            circle
            size="mini"
            @click="statueExchange(scope.row,'open')"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit', scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="formVisible('set',scope.row)">配置DApp</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title.text">
      <el-form ref="form" :model="form" :rules="rules" label-width="110px" class="demo-ruleForm">
        <el-form-item label="标题" prop="name">
          <el-input v-model="form.name" placeholder="请填写标题" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" placeholder="请填写描述" />
        </el-form-item>

        <el-form-item label="标题(EN)" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="请填写英文标题" />
        </el-form-item>

        <el-form-item label="简介(EN)" prop="descriptionEn">
          <el-input v-model="form.descriptionEn" type="textarea" placeholder="请填写英文描述" />
        </el-form-item>

        <!-- <el-form-item label="创建时间" prop="createTime">
          <el-date-picker
            v-model="form.createTime"
            type="date"
            placeholder="选择日期时间"
            value-format="yyyy-MM-dd"
            align="right"
          />
        </el-form-item>-->

        <el-form-item label="所属链类型">
          <el-select v-model="form.chainType" placeholder="选择所属链">
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item label="分类排序" prop="sort">
          <el-input
            v-model="form.sort"
            type="number"
            min="0"
            step="1"
            placeholder="请填入排序,数字越大越靠前(默认为0)"
          />
        </el-form-item>

        <el-form-item label="状态管理" prop="status">
          <!-- v-if="title.state=='edit'" -->
          <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        :total="listData.total"
        :page-size="listData.pageSize"
        background
        :current-page.sync="queryList.pageNum"
        layout="prev, pager, next"
        v-if="listData.total !=0"
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { setContextData, getContextData } from '@/utils/validate'

import {
  getCollectionList,
  addCollection,
  editCollection,
  deleteCollection
} from '@/api/findModule/collection'

export default {
  filters: {},
  data() {
    return {
      disableHide: false, // 隐藏禁用列表
      listLoading: true,
      dialogFormVisible: false,
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 20,
        orderBy: ''
      },
      form: {},
      title: { state: '', text: '' }, // 弹出框标题；新增 --修改分类两种
      rules: {
        name: [{ required: true, message: '请填写标题', trigger: 'blur' }],
        nameEn: [
          { required: true, message: '请填写英文标题', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输写描述', trigger: 'blur' }
        ],
        descriptionEn: [
          { required: true, message: '请输写英文描述', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请选择所属链类型', trigger: 'blur' }
        ]
        //  createTime: [
        //   { required: true, message: '请选择创建时间', trigger: 'blur' }
        // ],
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        if (val) {
          this.fetchData()
        }
      },
      deep: true
    },

    disableHide(val, oldVal) {
      this.queryList.status = val ? 1 : 0
    }
  },
  created() {
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  methods: {
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
    },

    async fetchData() {
      this.listLoading = true
      this.dialogFormVisible = false
      try {
        const res = await getCollectionList(this.queryList)
        this.listLoading = false

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    },

    statueExchange(item, statue) {
      this.$confirm(
        `${statue == 'disable' ? '关闭' : '开启'}启用后,前台【${item.name}】将${
          statue == 'disable' ? '隐藏' : '显示'
        }，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          const status = statue == 'disable' ? 0 : 1
          const params = Object.assign({}, { ...item }, { status })
          editCollection(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    }, // 修改状态

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`是否进行【${this.title.text}】操作 ?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              this.submitHandler()
            })
            .catch(() => {
              this.$message.info({
                title: '提示',
                message: `已取消${this.title.text}`
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, // 表单确认

    submitHandler() {
      const status = this.form.status ? 1 : 0
      const params = Object.assign({}, { ...this.form }, { status })
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editCollection(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.fetchData()
        })
      } else if (this.title.state == 'add') {
        addCollection(params).then(v => {
          this.$notify.success({
            title: '成功',
            message: `${this.title.text}成功`
          })
          this.fetchData()
        })
      }
    }, // submitHandler

    formVisible(style, item) {
      this.dialogFormVisible = ['add', 'edit'].includes(style)

      switch (style) {
        case 'add':
          this.form = {}
          this.title = Object.assign({}, { state: style, text: '新增' })
          break
        case 'edit':
          this.title = Object.assign({}, { state: style, text: '编辑' })
          this.form = { ...item }
          break
        case 'set':
          this.$router.push({
            path: '/walletTol/find/collection/collection-allocation',
            query: { ...item }
          })
          break
      }
    }, // 操作

    cancel(formName) {
      this.dialogFormVisible = false
      this.$notify.info({
        title: '提示',
        message: `已取消${this.title.text}`
      })
    }, // 取消

    delItem(item) {
      this.$confirm(
        `你正在删除 【${item.name}】，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          deleteCollection({ ...item }).then(v => {
            if (v.code == 1000) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.fetchData()
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消删除'
          })
        })
    }, // delItem

    changeTableSort(payload) {
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = 'sort DESC'
          break
        case 'descending':
          rule = 'sort ASC'
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
    }, // 改变排序

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
.icon img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  vertical-align: middle;
  cursor: pointer;
}
.icon.type2 img {
  opacity: 0.2;
}
.description {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>
