<!--
 * @Description: devPlatform -> message
 * @Author: wangyun
 * @Date: 2019-09-10 10:56:14
 * @LastEditors: wangyun
 * @LastEditTime: 2019-09-10 16:12:23
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover
            placement="bottom-start"
            width="200"
            trigger="hover"
            content="消息ID查询 用户ID查询 不支持模糊搜索"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryList.s_EQ_id "
            placeholder="请输入消息ID"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryList.s_EQ_userId"
            placeholder="请输入用户ID"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryList.s_LIKE_title"
            placeholder="请输入消息标题"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item>
          <el-input
            v-model="queryList.s_LIKE_content"
            placeholder="请输入消息内容"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            class="filter-item"
            type="primary"
            icon="el-icon-edit"
            @click="formVisible('add')"
          >发送消息</el-button>
        </el-form-item>

        <el-form-item>
          <el-button class="filter-item" type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>
    <el-table :data="listData.list" :max-height="fullHeight" border fit highlight-current-row>
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="消息id" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="用户id" width="160" align="center">
        <template slot-scope="scope">{{ scope.row.userId }}</template>
      </el-table-column>

      <el-table-column label="标题" width="230" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="内容" align="center">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column>

      <el-table-column label="是否已读" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.isRead | statusFilter">{{ scope.row.isRead?"已读":"未读" }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="160" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
    </el-table>

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" title="发送消息">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="用户id" prop="userIdList">
          <el-input v-model="form.userIdList1" placeholder="请填入用户id,多个请用‘,’连接" />
        </el-form-item>

        <el-form-item label="消息标题" prop="title">
          <el-input v-model="form.title" placeholder="请填入消息标题" />
        </el-form-item>

        <el-form-item label="消息内容" prop="content">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{minRows:2, maxRows: 4}"
            placeholder="请填入消息内容"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框结束 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        :total="listData.total"
        :page-size="listData.pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="queryList.pageNum"
        v-if="listData.total !=0"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { setContextData, getContextData } from '@/utils/validate'
import { getMeeageList, sendMessage } from '@/api/devPlatform/message'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        true: 'success',
        false: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      userIdList: '',
      listData: {},
      dialogFormVisible: false,
      form: {
        type: 1,
        messageLanguageList: [
          { type: 1, language: 'English', languageId: 10000002, userId: [] }
        ]
      },
      rules: {
        userIdList: [
          {
            required: true,
            message: "请填入用户id，多个请用英文'，'连接",
            trigger: 'blur'
          }
        ],
        title: [{ required: true, message: '必填', trigger: 'blur' }],
        content: [{ required: true, message: '必填', trigger: 'blur' }]
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    },
    form: {
      handler(val, oldVal) {
        if (val.userIdList1) {
          val.userIdList = val.userIdList1.split(',')
        }
        console.log(val)
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
        let res = await getMeeageList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: e }
      }
    },

    submitForm(formName) {
      console.log(this.form)
      this.$refs[formName].validate(valid => {
        console.log(this.form)
        sendMessage(this.form).then(v => {
          v.code === 1000 &&
            this.$message({
              message: `发送${v.message}`,
              type: 'success'
            })
          this.fetchData()
        })
      })
    },

    cancel(formName) {
      this.dialogFormVisible = false
    },

    formVisible(state) {
      this.dialogFormVisible = true
    }, // FormVisible

    handleCurrentChange(currentPage) {
      console.log('currentPage: ', currentPage)
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
