<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item label>
          <el-input v-model="qureyList.s_EQ_realName" placeholder="用户名" clearable/>
        </el-form-item>-->

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
      @expand-change="expandSelect"
      @sort-change="changeTableSort"
    >
      <el-table-column width="50" type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="用户名称">
              {{ deteil.userName || "55" }}
              <el-tag
                v-for="(item,index) in scope.row.chainType"
                :key="index"
                type="success"
                style="margin-right:10px;"
              >{{ item }}网络</el-tag>
            </el-form-item>

            <br>

            <el-form-item label="用户真实姓名">{{ deteil.realName }}</el-form-item>

            <el-form-item label="用户邮箱">{{ deteil.userEmail }}</el-form-item>

            <br>
            <el-form-item label="用户手机号">{{ deteil.userMobile }}</el-form-item>

            <br>
            <el-form-item label="用户头像">
              <img
                :src="deteil.userAvatar"
                onerror="javascript:this.src='http://g.hiphotos.baidu.com/zhidao/pic/item/d833c895d143ad4bd74bac3f85025aafa50f06e3.jpg'"
                alt
                style="width:40px;"
              >
            </el-form-item>

            <br>
            <el-form-item label="是否启用双重认证">{{ deteil.twoFactorAuth }}</el-form-item>

            <br>
            <el-form-item label="是否锁定">{{ deteil.locked }}</el-form-item>

            <br>
            <el-form-item label="所属角色名称">{{ deteil.roleName }}</el-form-item>

            <br>
            <el-form-item label="所属角色ID">{{ deteil.roleId }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (qureyList.pageNum - 1) * qureyList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="角色" align="center" width="220">
        <template slot-scope="scope">{{ scope.row.roleName }}</template>
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

      <el-table-column label="锁定状态" width="80" align="center">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.locked?'已解锁':'已锁定'" placement="top">
            <el-switch
              v-model="scope.row.locked"
              on-color="#00A854"
              on-text="解锁"
              on-value="1"
              off-color="#F04134"
              off-text="锁定"
              off-value="0"
              @change="changeStatus(scope.row)"
            />
          </el-tooltip>
        </template>
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
    <el-dialog :visible.sync="dialogFormVisible" title="编辑用户信息">
      <el-form :model="deteil1" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="deteil1.userName"/>
        </el-form-item>

        <el-form-item v-if="deteil1.add" label="用户密码" prop="userPass">
          <el-input v-model="deteil1.userPass"/>
        </el-form-item>

        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="deteil1.realName"/>
        </el-form-item>

        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input v-model="deteil1.userEmail"/>
        </el-form-item>

        <el-form-item label="用户手机号" prop="userMobile">
          <el-input v-model="deteil1.userMobile"/>
        </el-form-item>

        <el-form-item label="角色ID" prop="roleId">
          <el-select v-model="deteil1.roleId" placeholder="请选择角色">
            <el-option
              v-for="item in roleList"
              :key="item.roleId"
              :value="item.roleId"
              :label="item.roleName"
            />
          </el-select>
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
import { lockSysUser, getSystemUser, getSysUserDetail, editSysUserDetail, addSysUser, deleteSysUser, getRoleList } from '@/api/user'
export default {
  filters: {

  },
  data() {
    return {
      dialogFormVisible: false,
      rules: {
        userName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userPass: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userEmail: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        userMobile: [
          { required: true, message: '不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择角色ID', trigger: 'blur' }
        ]
      },
      disableHide: false, // 隐藏禁用列表
      userData: {
        isFirstPage: true, // 第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: false,
      deteil: {},
      cateArrStatus: [{ id: 0, name: '已解锁', status: true }, { id: 1, name: '已锁定', status: false }], // 分类列表
      qureyList: {
        pageNum: 1,
        pageSize: 10,
        categoryId: '',
        cateIndex: '',
        s_EQ_realName: '',
        s_EQ_auditStatus: '',
        s_EQ_locked: '',
        orderBy: '', // 排序方式
        isAsc: ''// 排序方式1升序，0降序
      },
      roleList: []// 角色id
    }
  },
  computed: {
    deteil1() {
      return this.deteil
    },
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
    this.getRoleId()
  },
  methods: {
    // 获取角色id
    getRoleId() {
      getRoleList().then(v => {
        console.log(v)
        this.roleList = v.code === 1000 ? v.data.list : []
      })
    },
    // 删除系统用户
    deteilSysUser(params) {
      deleteSysUser({ id: params.userId }).then(v => {
        v.code === 1000 && this.$message({
          message: `操作${v.message}`,
          type: 'success'
        })
        this.getList()
      })
    },
    // 切换系统锁状态
    changeStatus(e) {
      lockSysUser(e).then(v => {
        v.code === 1000 && this.$message({
          message: `操作${v.message}`,
          type: 'success'
        })
        this.getList()
        v.code !== 1000 && this.$message({
          message: `操作${v.message}`,
          type: 'fail'
        })
      })
    },
    // 或者开发人员列表
    getList(params = this.qureyList) {
      getSystemUser(params).then(response => {
        this.userData = response.data
      })
    },
    // 刷新当前页
    async refresh() {
      this.listLoading = true
      await this.getList()
      await this.getRoleId()
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
    pageLoad(style) {
      style === 0 && this.qureyList.pageNum--
      style === 1 && this.qureyList.pageNum++
      this.getList()
    },
    // 展开行事件
    expandSelect(row, expandedRows) {
      console.log(row.userId)
      expandedRows.length > 1 && expandedRows.shift()
      this.getDetail(row.userId)
    },
    // 获取用户详情
    getDetail(id) {
      this.listLoading = true
      getSysUserDetail({ id }).then(v => {
        this.deteil = v.data
        this.listLoading = false
      })
    },
    // 编辑弹出框
    editSysUser(style, row) {
      // 0是新增 1是编辑
      style === 1 && this.getDetail(row.userId)
      if (style === 0) {
        this.deteil = {
          add: true
        }
      }
      this.dialogFormVisible = true
    },
    cancel() {
      this.dialogFormVisible = false
    },
    async submitForm() {
      if (this.deteil1.add) {
        console.log(this.deteil1)
        addSysUser(this.deteil1).then(v => {
          v.code === 1000 && this.$message({
            message: `操作${v.message}`,
            type: 'success'
          })
        })
      } else {
        this.deteil.id = this.deteil.userId
        await editSysUserDetail(this.deteil1).then(v => {
          v.code === 1000 && this.$message({
            message: `操作${v.message}`,
            type: 'success'
          })
        })
      }
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
