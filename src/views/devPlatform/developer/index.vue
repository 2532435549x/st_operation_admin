<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="qureyList.s_EQ_userName" placeholder="用户名" clearable />
        </el-form-item>

        <el-form-item label prop="s_EQ_locked">
          <el-select v-model="qureyList.s_EQ_locked" placeholder="选择状态">
            <el-option label="全部状态" value />
            <el-option
              v-for="(item,index) in cateArrStatus"
              :label="item.name"
              :value="item.status"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>

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

      <el-table-column label="用户名" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.userName }}</template>
      </el-table-column>

      <el-table-column label="邮箱" align="center" width="250">
        <template slot-scope="scope">{{ scope.row.userEmail ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="创建时间" align="center" sortable="count">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="操作" width="80" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.locked?'已锁定':'已解锁'" placement="top">
            <el-switch v-model="scope.row.locked" @change="changeStatus(scope.row)" />
          </el-tooltip>
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
          <i class="el-icon-arrow-right el-icon--right" />
        </el-button>
      </el-button-group>
    </div>
  </div>
</template>

<script>
import { getUserList, lockUser, getRoleList } from '@/api/user'
export default {
  filters: {},
  data() {
    return {
      rules: {
        message: [{ required: false, message: '', trigger: 'blur' }]
      },
      disableHide: false, // 隐藏禁用列表
      userData: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: false,
      deteil: {},
      cateArrStatus: [
        { id: 0, name: '已解锁', status: true },
        { id: 1, name: '已锁定', status: false }
      ], // 分类列表
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        categoryId: '',
        cateIndex: '',
        s_EQ_userName: '',
        s_EQ_auditStatus: '',
        s_EQ_locked: '',
        orderBy: '', // 排序方式
        isAsc: '' // 排序方式1升序，0降序
      }
    }
  },
  computed: {
    listData() {
      // 隐藏禁用栏目
      return this.userData
    } // listData
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
    getRoleList().then(v => {
      console.log(v)
    })
  },
  methods: {
    changeStatus(e) {
      lockUser({ lock: e.locked, id: e.id }).then(v => {
        v.code === 1000 &&
          this.$message({
            message: `操作${v.message}`,
            type: 'success'
          })
        v.code !== 1000 &&
          this.$message({
            message: `操作${v.message}`,
            type: 'fail'
          })
        this.getList()
      })
    },
    // 或者开发人员列表
    getList(params = this.qureyList) {
      getUserList(params).then(response => {
        console.log('xcq', response)
        this.userData = response.data
      })
    },
    // 刷新当前页
    async refresh() {
      getRoleList().then(v => {
        console.log(v)
      })
      this.listLoading = true
      await this.getList()
      this.listLoading = false
      this.$message({
        message: `刷新成功！`,
        type: 'success'
      })
    },
    changeTableSort(item) {
      // 改变排序
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
