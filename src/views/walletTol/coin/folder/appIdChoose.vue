<!--
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-08-13 17:23:18
 * @LastEditTime: 2019-08-13 17:23:52
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="qureyList.s_LIKE_appName" placeholder="DApp名称" clearable />
        </el-form-item>

        <el-form-item label prop="s_EQ_status">
          <el-select v-model="qureyList.s_EQ_status" placeholder="选择状态">
            <el-option label="全部" value />
            <el-option
              v-for="(item,index) in cateArrStatus"
              :label="item.name"
              :value="item.id"
              :key="index"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="qureyList.s_EQ_status==1" label prop="s_EQ_auditStatus">
          <el-select v-model="qureyList.s_EQ_auditStatus" placeholder="选择审核">
            <el-option label="全部" value />
            <el-option
              v-for="(item,index) in cateArr"
              :label="item.name"
              :value="item.id"
              :key="index"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <el-button class="filter-item" type="primary" @click="refresh">刷新</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      ref="multipleTable"
      :data="tableData"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @selection-change="handleSelectionChange"
    >
      >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.logo" alt width="50" height="50" >
        </template>
      </el-table-column>

      <el-table-column label="App名称" align="center">
        <template slot-scope="scope">{{ scope.row.appName ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="开发者" align="center">
        <template slot-scope="scope">{{ scope.row.userName ||"未知" }}</template>
      </el-table-column>

      <el-table-column
        :show-overflow-tooltip="true"
        text-overflow="ellipsis"
        label="描述"
        align="center"
      >
        <template slot-scope="scope">
          <div class="description">{{ scope.row.description ||"暂无数据" }}</div>
        </template>
      </el-table-column>

      <el-table-column label="所属分类" width="120" align="center">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>

      <el-table-column label="APP类型" width="130" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type=='H5'">H5</span>
          <span v-else>原生</span>
        </template>
      </el-table-column>

      <el-table-column label="语言" align="center">
        <template slot-scope="scope">{{ scope.row.languages }}</template>
      </el-table-column>

      <el-table-column align="center" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.status===1">审核阶段</span>
          <span v-if="scope.row.status===2">正常</span>
          <span v-if="scope.row.status===3">下线</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="详情">
        <template slot-scope="scope">
          <el-button type="success" size="small" @click="toDetil(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pageQury">
      <div>
        <el-button type="primary" @click="sumitAppId">确定</el-button>
        <el-tag type="success">已选{{ multipleSelectionAll.length }}</el-tag>
      </div>
      <div v-if="list.pages>1" class="page">
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
  </div>
</template>

<script>
import { getdapps, cancelDapp } from '@/api/dappMagen'
export default {
  filters: {
  },
  data() {
    return {
      dialogFormVisible: false,
      form: {
        title: '',
        id: '',
        appName: '',
        message: ''// 默认启用
      },
      rules: {
        message: [
          { required: false, message: '', trigger: 'blur' }
        ]
      },
      cateArr: [{ id: 1, name: '审核中' }, { id: 2, name: '审核成功' }, { id: 3, name: '审核失败' }], // 分类列表
      cateArrStatus: [{ id: 1, name: '审核阶段' }, { id: 2, name: '正常' }, { id: 3, name: '下线' }], // 分类列表
      disableHide: false, // 隐藏禁用列表
      list: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: false,
      qureyList: {
        pageNum: 1,
        pageSize: 5,
        categoryId: '',
        cateIndex: '',
        s_LIKE_appName: '',
        s_EQ_auditStatus: '',
        s_EQ_status: '',
        orderBy: '', // 排序方式
        isAsc: ''// 排序方式1升序，0降序
      },
      tableData: [],
      multipleSelectionAll: [], // 所有选中的数据包含跨页数据
      multipleSelection: [], // 当前页选中的数据
      idKey: 'id' // 标识列表数据中每一行的唯一键的名称
    }
  },
  computed: {
    listData() { // 隐藏禁用栏目
      return this.list
    }// listData
  },
  watch: {
    qureyList: {
      handler(val, oldVal) {
        if (val.s_EQ_status != 1) {
          val.s_EQ_auditStatus = ''
        }
        this.fetchData()
      },
      deep: true
    }
  },
  created() {
    if (this.$route.query.categoryId) {
      this.qureyList.categoryId = this.$route.query.categoryId
    }
    this.fetchData()
  },
  methods: {
    sumitAppId() {
      console.log('this.multipleSelectionAll', this.multipleSelectionAll)
      const a = this.multipleSelectionAll.map(i => i.id)
      this.$emit('getAppIdList', a)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val

      // 实时记录选中的数据
      setTimeout(() => {
        this.changePageCoreRecordData()
      }, 50)
    },
    setSelectRow() {
      if (!this.multipleSelectionAll || this.multipleSelectionAll.length <= 0) {
        return
      }
      // 标识当前行的唯一键的名称
      const idKey = this.idKey
      const selectAllIds = []
      const that = this
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      this.$refs.multipleTable.clearSelection()
      for (var i = 0; i < this.tableData.length; i++) {
        if (selectAllIds.indexOf(this.tableData[i][idKey]) >= 0) {
          // 设置选中，记住table组件需要使用ref="table"
          this.$refs.multipleTable.toggleRowSelection(this.tableData[i], true)
        }
      }
    },
    // 记忆选择核心方法
    changePageCoreRecordData() {
      // 标识当前行的唯一键的名称
      const idKey = this.idKey
      const that = this
      // 如果总记忆中还没有选择的数据，那么就直接取当前页选中的数据，不需要后面一系列计算
      if (this.multipleSelectionAll.length <= 0) {
        this.multipleSelectionAll = this.multipleSelection
        return
      }
      // 总选择里面的key集合
      const selectAllIds = []
      this.multipleSelectionAll.forEach(row => {
        selectAllIds.push(row[idKey])
      })
      const selectIds = []
      // 获取当前页选中的id
      this.multipleSelection.forEach(row => {
        selectIds.push(row[idKey])
        // 如果总选择里面不包含当前页选中的数据，那么就加入到总选择集合里
        if (selectAllIds.indexOf(row[idKey]) < 0) {
          that.multipleSelectionAll.push(row)
        }
      })
      const noSelectIds = []
      // 得到当前页没有选中的id
      this.tableData.forEach(row => {
        if (selectIds.indexOf(row[idKey]) < 0) {
          noSelectIds.push(row[idKey])
        }
      })
      noSelectIds.forEach(id => {
        if (selectAllIds.indexOf(id) >= 0) {
          for (let i = 0; i < that.multipleSelectionAll.length; i++) {
            if (that.multipleSelectionAll[i][idKey] == id) {
              // 如果总选择中有未被选中的，那么就删除这条
              that.multipleSelectionAll.splice(i, 1)
              break
            }
          }
        }
      })
    },
    fetchData() { // 获取列表
      const params = Object.assign({}, this.qureyList)
      if (params.s_LIKE_appName) {
        params.s_LIKE_appName = '%' + params.s_LIKE_appName + '%'
      }
      // this.listLoading = true
      getdapps(params).then(response => {
        console.log(response)
        // response.data.list.forEach((v, k) => {
        //   v.chainType = v.chainType.split(',')
        // })
        this.list = response.data
        this.tableData = response.data.list
        setTimeout(() => {
          this.setSelectRow()
        }, 50)
      })
    }, // fetchData
    // 刷新当前页
    async refresh() {
      this.listLoading = true
      await this.fetchData()
      this.listLoading = false
      this.$message({
        message: `刷新成功！`,
        type: 'success'
      })
    },
    // 确定删除
    submitForm() {
      console.log(this.form)
      if (this.form.message === '') {
        this.$message({
          message: `理由不能为空`
        })
        return
      }
      this.form.appId = this.form.id
      this.form.title === '下架' && cancelDapp(this.form).then(v => {
        console.log(v)
        v.code === 1000 && this.$message({
          message: `下架${v.message}`,
          type: 'success'
        })
        this.fetchData()
      })
      this.cancel()
    },
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) { // 分页加载
      console.log(type)
      this.qureyList.pageNum = type
      this.fetchData()
    },
    // 跳转详情
    toDetil(item) {
      console.log(item)
      this.$router.push({
        path: '/dapp/dappDetail',
        query: {
          id: item.id,
          auditStatus: item.auditStatus
        }
      })
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
.pageQury {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
