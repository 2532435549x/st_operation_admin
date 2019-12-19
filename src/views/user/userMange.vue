<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="qureyList.s_EQ_roleName" placeholder="角色名" clearable/>
        </el-form-item>

        <el-form-item label prop="s_EQ_locked">
          <el-select v-model="qureyList.s_EQ_locked" placeholder="选择状态">
            <el-option label="全部状态" value/>
            <el-option
              v-for="(item,index) in cateArrStatus"
              :label="item.name"
              :value="item.status"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>-->
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

      <el-table-column label="角色名称" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
      </el-table-column>

      <el-table-column label="角色ID" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.roleId }}</template>
      </el-table-column>

      <el-table-column label="角色描述" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.roleDesc }}</template>
      </el-table-column>

      <el-table-column label="双重认证" align="center" width="220">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="如果开启则该角色下所有用户强制使用双重认证" placement="top">
            <span>{{ scope.row.enableTwoFactorAuth?"是":"否" }}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="角色类型" align="center">
        <template slot-scope="scope">{{ scope.row.roleType ===1?'系统角色':"用户角色" }}</template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="180">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="editSysUser(1,scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deteilSysUser(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pageQury">
      <el-button-group>
        <el-button
          v-if="!userData.isFirstPage"
          type="primary"
          icon="el-icon-arrow-left"
          @click="pageLoad(0)"
        >上一页</el-button>
        <el-button v-if="!userData.isLastPage" type="primary" @click="pageLoad(1)">
          下一页
          <i class="el-icon-arrow-right el-icon--right"/>
        </el-button>
      </el-button-group>
    </div>
    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="edit.title+ '用户信息'">
      <el-form :model="edit" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="角色名称">
          <el-input v-model="edit.roleName" prop="deteil"/>
        </el-form-item>

        <el-form-item label="角色描述">
          <el-input v-model="edit.roleDesc" prop="deteil"/>
        </el-form-item>

        <el-form-item label="双重认证">
          <el-radio-group v-model="edit.enableTwoFactorAuth">
            <el-radio label="true">开启</el-radio>
            <el-radio label="false">关闭</el-radio>
          </el-radio-group>
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
import { changeRole, getRoleList, deleteRole, addRole } from '@/api/user'
export default {
  filters: {

  },
  data() {
    return {
      isRefresh: true,
      dialogFormVisible: false,
      rules: {
        deteil: [
          { required: false, message: '不能为空', trigger: 'blur' }
        ]
      },
      disableHide: false, // 隐藏禁用列表
      userData: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: false,
      edit: {},
      cateArrStatus: [{ id: 0, name: '已解锁', status: true }, { id: 1, name: '已锁定', status: false }], // 分类列表
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        categoryId: '',
        cateIndex: '',
        s_EQ_roleName: '',
        s_EQ_auditStatus: '',
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
    // 删除角色
    deteilSysUser(params) {
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole({ id: params.roleId }).then(a => {
          a.code === 1000 && this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 或者开发人员列表
    getList(params = this.qureyList) {
      getRoleList(params).then(response => {
        console.log('xcq', response)
        this.userData = response.data
      })
    },
    // 刷新当前页
    async refresh() {
      if (this.isRefresh) {
        this.isRefresh = false
        this.listLoading = true
        await this.getList()
        this.listLoading = false
        this.$message({
          message: `刷新成功！`,
          type: 'success'
        })
        this.isRefresh = true
      }
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
    pageLoad(style) {
      style === 0 && this.qureyList.pageNum--
      style === 1 && this.qureyList.pageNum++
      this.getList()
    },
    // 展开行事件
    expandSelect(row, expandedRows) {
      console.log(row.userId)
      expandedRows.length > 1 && expandedRows.shift()
      console.log(row.userId)
      this.getDetail(row.userId)
    },
    // 编辑弹出框
    editSysUser(style, row) {
      // 0代表新增 1代表编辑
      if (style === 1) {
        this.edit = row
        this.edit.enableTwoFactorAuth = row.enableTwoFactorAuth ? 'true' : 'false'
        this.edit.title = '编辑'
      }
      if (style === 0) {
        this.edit = {}
        this.edit.title = '新增'
      }
      this.dialogFormVisible = true
    },
    cancel() {
      this.dialogFormVisible = false
    },
    async submitForm() {
      if (this.edit.enableTwoFactorAuth === 'true') {
        this.edit.enableTwoFactorAuth = true
      } else {
        this.edit.enableTwoFactorAuth = false
      }
      console.log(this.edit)
      if (this.edit.title === '编辑') {
        this.edit.id = this.edit.roleId
        await changeRole(this.edit).then(v => {
          v.code === 1000 && this.$message({
            message: `操作${v.message}`,
            type: 'success'
          })
        })
      }
      this.edit.title === '新增' && await addRole(this.edit).then(v => {
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
