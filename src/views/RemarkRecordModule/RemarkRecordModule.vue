<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label>
          <el-input v-model="qureyList.s_EQ_remarkType" placeholder="根据数据备注类型查询" clearable/>
        </el-form-item>-->

        <el-form-item label>
          <el-input v-model="qureyList.s_EQ_recordId" placeholder="根据备注数据ID查询" clearable/>
        </el-form-item>
        <!-- <el-form-item label prop="s_EQ_locked">
          <el-select v-model="qureyList.s_EQ_locked" placeholder="选择状态">
            <el-option label="全部状态" value/>
            <el-option
              v-for="(item,index) in cateArrStatus"
              :label="item.name"
              :value="item.status"
              :key="index"
            />
          </el-select>
        </el-form-item>-->
      </el-form>
      <el-button class="filter-item" type="primary" @click="editSysUser(0)">新增</el-button>
      <el-button class="filter-item" type="primary" @click="refresh">刷新</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="userData.list"
      :height="fullHeight"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="用户真实姓名" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.realName }}</template>
      </el-table-column>

      <el-table-column label="用户ID" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.userId }}</template>
      </el-table-column>

      <el-table-column label="备注内容" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.remarkContent ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="备注数据ID" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.recordId ||"暂无数据" }}</template>
      </el-table-column>
      <el-table-column label="创建时间" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
    </el-table>

    <div v-if="userData.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="userData.total"
          :page-size="userData.pageSize"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!userData.total" class="list list1">暂无数据</div>
    </div>

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="新建备注数据">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="备注类型" prop="remarkTypexcq">
          <el-input v-model="form.remarkType"/>
        </el-form-item>

        <el-form-item label="备注数据ID" prop="remarkTypexcq">
          <el-input v-model="form.recordId"/>
        </el-form-item>

        <el-form-item label="备注内容" prop="remarkTypexcq">
          <el-input v-model="form.remarkContent"/>
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
import { getremarkRecord, addRemarkRecord } from '@/api/RemarkRecordModule'

export default {
  filters: {

  },
  data() {
    return {
      dialogFormVisible: false,
      rules: {
        remarkTypexcq: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        recordId: [
          { required: true, message: '请输入分类英文名', trigger: 'blur' }
        ],
        remarkContent: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ]
      }, // rr
      form: {},
      userData: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: false,
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        categoryId: '',
        cateIndex: '',
        s_EQ_remarkType: '',
        s_EQ_recordId: '',
        orderBy: '', // 排序方式
        isAsc: ''// 排序方式1升序，0降序
      }
    }
  },
  computed: {
    listData() { // 隐藏禁用栏目
      return this.userData
    }// listData
  },
  watch: {
    qureyList: {
      handler(val, oldVal) {
        this.getList()
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.categoryId) {
      this.qureyList.categoryId = this.$route.query.categoryId
    }
    this.getList()
  },
  methods: {
    // 获取列表
    getList(params = this.qureyList) {
      getremarkRecord(params).then(response => {
        this.userData = response.data
      })
    },
    // 刷新当前页
    async refresh() {
      this.listLoading = true
      await this.getList()
      this.listLoading = false
      this.$message({
        message: `刷新成功！`,
        type: 'success'
      })
    },
    changeTableSort(item) { // 改变排序
      console.log(item)
      let a = ''
      switch (item.order) {
        case 'ascending':
          a = 'createTime DESC'
          break
        case 'descending':
          a = 'createTime ASC'
          break
        default:
          a = ''
      }
      this.qureyList.orderBy = a
    }, // changeTableSort
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) { // 分页加载
      console.log(type)
      this.qureyList.pageNum = type
      this.fetchData()
    },
    // 编辑弹出框
    editSysUser(style, row) {
      this.dialogFormVisible = true
    },
    cancel() {
      this.dialogFormVisible = false
    },
    async submitForm(formName) {
      addRemarkRecord(this.form).then(v => {
        v.code === 1000 && this.$message({
          message: `操作${v.message}`,
          type: 'success'
        })
      })
      this.getList()
      this.dialogFormVisible = false
    }
  } // watch
}
</script>
<style scope>
.el-tooltip__popper {
  max-width: 50%;
  line-height: 30px;
}
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
}
</style>
