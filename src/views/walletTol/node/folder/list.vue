<!--
 * @Description: node -> list
 * @Author: wangyun
 * @Date: 2019-09-09 16:39:41
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-13 14:35:03
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_nodeName" placeholder="输入节点名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_nodeType" clearable placeholder="选择节点类型">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'高速节点'" :value="1"></el-option>
            <el-option :label="'全节点'" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="''" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">添加节点</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum - 1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="节点名称" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.nodeName }}</template>
      </el-table-column>

      <el-table-column label="节点地址" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.nodeUrl || "暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column label="排序" sortable="sort_index" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.sortIndex }}</template>
      </el-table-column>

      <el-table-column label="节点类型" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.nodeType | typeFilter"
            effect="plain"
          >{{ scope.row.nodeType | nodeTypeFilter }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='BOS'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已开启，点击可关闭"
            icon="el-icon-check"
            circle
            size="mini"
            @click="stateExchange(scope.row,'disable')"
          />
          <el-button
            v-else
            type="danger"
            title="已关闭，点击可开启"
            icon="el-icon-close"
            circle
            size="mini"
            @click="stateExchange(scope.row,'open')"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="deleteKeywords('delete',scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <el-form-item label="节点名称" prop="nodeName">
          <el-input v-model="form.nodeName" placeholder="请填入节点名称" />
        </el-form-item>

        <el-form-item label="节点地址" prop="nodeUrl">
          <el-input v-model="form.nodeUrl" placeholder="请填入节点地址" />
        </el-form-item>

        <el-form-item label="排序" prop="sortIndex">
          <el-input v-model.number="form.sortIndex" placeholder="请填入排序" />
        </el-form-item>

        <el-form-item label="节点类型" prop="nodeType">
          <el-select v-model="form.nodeType" placeholder="请选择节点类型">
            <el-option
              v-for="(item, index) in nodeTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="所属链类型" prop="chainType">
          <el-select v-model="form.chainType" placeholder="请选择所属链">
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态管理" v-if="title!=='新增'" prop="status">
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
import { setContextData, getContextData } from '@/utils/validate'

import {
  getNodesList,
  addNodesList,
  deleteNodesList,
  editNodesList
} from '@/api/walletTolModule/node'

export default {
  filters: {
    nodeTypeFilter(status) {
      const nodeTypeMap = {
        0: '暂无数据',
        1: '高速节点',
        2: '全节点'
      }
      return nodeTypeMap[status]
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
      dialogFormVisible: false,
      form: {},
      title: '',
      nodeTypeOptions: [
        { label: '高速节点', value: 1 },
        { label: '全节点', value: 2 }
      ],
      rules: {
        nodeName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        nodeUrl: [
          { required: true, message: '请填入节点地址', trigger: 'blur' }
        ],
        sortIndex: [
          { required: true, message: '请填入排序' },
          { type: 'number', message: '排序必须为数字值' }
        ],
        nodeType: [
          { required: true, message: '请选择节点类型', trigger: 'change' }
        ],
        chainType: [
          { required: true, message: '请选择所属链', trigger: 'change' }
        ]
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
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
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
        let res = await getNodesList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: e }
      }
    },

    stateExchange(item, state) {
      this.$confirm(
        `${state == 'disable' ? '关闭' : '开启'}启用后,前台【${
          item.nodeName
        }节点】将${state == 'disable' ? '隐藏' : '显示'}，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editNodesList(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    }, // 状态修改

    formVisible(state, item) {
      this.dialogFormVisible = true
      switch (state) {
        case 'add':
          this.title = '添加节点'
          this.form = Object.assign({}, { nodeType: 1, chainType: 'EOS' })
          break
        default:
          this.title = '编辑节点'
          let nodeType = item.nodeType == 0 ? '' : item.nodeType
          this.form = Object.assign({}, item, { nodeType })
          break
      }
    }, // 操作

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        let status = this.form.status ? 1 : 0
        let params = Object.assign({}, { ...this.form }, { status })
        console.log('params: ', params)
        if (valid) {
          if (this.title === '编辑节点') {
            editNodesList(params).then(v => {
              v.code === 1000 &&
                this.$message({
                  message: `编辑${v.message}`,
                  type: 'success'
                })
            })
          } else if (this.title === '添加节点') {
            addNodesList(params).then(v => {
              v.code === 1000 &&
                this.$message({
                  message: `添加${v.message}`,
                  type: 'success'
                })
            })
          }
          this.fetchData() // 成功与否都重新请求一次
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }, // 确定

    cancel(formName) {
      this.dialogFormVisible = false
      this.fetchData()
    }, // 取消

    deleteKeywords(state, item) {
      this.$confirm(
        `【${item.nodeName}节点】将被删除，老哥谨慎操作哦！`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(action => {
          if (action === 'confirm') {
            deleteNodesList(item).then(v => {
              console.log('v: ', v)
              this.$notify.success('删除成功')
              this.fetchData()
            })
          }
        })
        .catch(e => {
          this.$notify.info('取消删除')
        })
    }, // 删除操作

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // 翻页
  }
}
</script>

