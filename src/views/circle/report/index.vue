<!--
 * @Description: circle -> report
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-23 17:51:00
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-select v-model="handleKey" clearable placeholder="请选择搜索条件">
          <el-option
            v-for="(item, index) in handleOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>

        <el-form-item v-if="handleKey == 'customerNick'">
          <el-input v-model="queryList.customerNick" placeholder="输入用户昵称搜索" clearable />
        </el-form-item>

        <el-form-item v-if="handleKey == 'customerMobile'">
          <el-input v-model="queryList.customerMobile" placeholder="输入用户手机号搜索" clearable />
        </el-form-item>

        <el-form-item v-if="handleKey == 'customerEmail'">
          <el-input v-model="queryList.customerEmail" placeholder="输入用户邮箱搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.reason" placeholder="输入投诉理由搜索" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.type" clearable placeholder="请选择投诉类型">
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.status" clearable placeholder="请选择投诉状态">
            <el-option :label="'待处理/已处理'" :value="null" />
            <el-option :label="'待处理'" :value="1" />
            <el-option :label="'已处理'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="投诉理由">{{ row.reason }}</el-form-item>

            <el-form-item label="处理意见">{{ row.handleExplain }}</el-form-item>

            <el-form-item label="投诉时间">{{ row.createTime }}</el-form-item>

            <el-form-item>
              <el-divider content-position="left" style="width: 50%;">
                <b>被投诉用户的相关信息</b>
              </el-divider>
              <el-form v-if="row.itemData">
                <el-form-item label="头像">
                  <el-avatar :size="50" :src="row.itemData.customerAvatar" @error="errorHandler">
                    <img
                      src="/static/publicImgs/default-avatar.png"
                      style="width: 50px; height: 50px"
                    />
                  </el-avatar>
                </el-form-item>

                <el-form-item label="是否神评">
                  <i
                    :class="row.itemData.hot ? 'el-icon-success' : 'el-icon-error'"
                    :title="row.itemData.hot ? '是': '否'"
                    style="font-size: 16px;"
                  ></i>
                </el-form-item>

                <el-form-item label="昵称">{{ row.itemData.customerNick }}</el-form-item>

                <el-form-item label="手机号">{{ row.itemData.customerMobile }}</el-form-item>

                <el-form-item label="邮箱">{{ row.itemData.customerEmail }}</el-form-item>

                <el-form-item label="评论数量">{{ row.itemData.commentNum }}</el-form-item>

                <el-form-item label="点赞数量">{{ row.itemData.likesNum }}</el-form-item>

                <el-form-item label="帖子内容">{{ row.itemData.postContent }}</el-form-item>

                <el-form-item label="评论内容">{{ row.itemData.content }}</el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="投诉人头像" align="center" width="100">
        <template slot-scope="{row}">
          <el-avatar :size="50" :src="row.customerAvatar" @error="errorHandler">
            <img src="/static/publicImgs/default-avatar.png" style="width: 50px; height: 50px" />
          </el-avatar>
        </template>
      </el-table-column>

      <el-table-column label="投诉人昵称" align="center" width="160">
        <template slot-scope="{row}">{{ row.customerNick }}</template>
      </el-table-column>

      <el-table-column label="投诉人手机号" align="center" width="160">
        <template slot-scope="{row}">{{ row.customerMobile }}</template>
      </el-table-column>

      <el-table-column label="投诉人邮箱" align="center" width="160">
        <template slot-scope="{row}">{{ row.customerEmail }}</template>
      </el-table-column>

      <el-table-column label="投诉理由" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="{row}">{{ row.reason }}</template>
      </el-table-column>

      <el-table-column label="处理意见" align="center" min-width="200" show-overflow-tooltip>
        <template slot-scope="{row}">{{ row.handleExplain }}</template>
      </el-table-column>

      <el-table-column label="投诉时间" sortable="create_time" align="center" width="200">
        <template slot-scope="{row}">{{ row.createTime }}</template>
      </el-table-column>

      <el-table-column label="投诉类型" align="center" width="120">
        <template slot-scope="scope">
          <el-tag :type="scope.row.type | typeFilter">{{scope.row.type | typeTxtFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.status == 1 ? 'primary' : 'info'"
          >{{scope.row.status == 1 ? '待处理' : '已处理'}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            :disabled="scope.row.status!=1"
            @click="formVisible('deal', scope.row)"
          >点击处理</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <div slot="title">
        <b>{{title}}</b>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
        <template v-if="form.itemData">
          <el-form-item label="头像">
            <el-avatar :size="50" :src="form.itemData.customerAvatar" @error="errorHandler">
              <img src="/static/publicImgs/default-avatar.png" style="width: 50px; height: 50px" />
            </el-avatar>
          </el-form-item>

          <el-form-item label="昵称">
            <el-input
              v-model="form.itemData.customerNick"
              autosize
              type="textarea"
              placeholder="暂无数据"
              readonly
            />
          </el-form-item>

          <el-form-item label="手机号">
            <el-input
              v-model="form.itemData.customerMobile"
              autosize
              type="textarea"
              placeholder="暂无数据"
              readonly
            />
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input
              v-model="form.itemData.customerEmail"
              autosize
              type="textarea"
              placeholder="暂无数据"
              readonly
            />
          </el-form-item>

          <el-form-item label="评论内容">
            <el-input
              v-model="form.itemData.content"
              :autosize="{maxRows:4}"
              type="textarea"
              placeholder="暂无数据"
              readonly
            />
          </el-form-item>

          <el-form-item label="帖子内容">
            <el-input
              v-model="form.itemData.postContent"
              :autosize="{maxRows:4}"
              type="textarea"
              placeholder="暂无数据"
              readonly
            />
          </el-form-item>

          <el-form-item
            label="图片内容"
            v-if="form.itemData.picList && form.itemData.picList.length !==0"
          >
            <el-image
              class="postImg"
              v-for="(item,index) in form.itemData.picList.slice(0,9)"
              :key="index"
              :src="item"
              :preview-src-list="form.itemData.picList.slice(index)"
              fit="cover"
              shape="square"
              style="width:80px; height: 80px; margin: 0 10px; "
            >
              <div slot="placeholder" class="image-slot">
                加载中
                <span class="dot">...</span>
              </div>
            </el-image>
          </el-form-item>
        </template>

        <el-form-item label="处理意见" prop="handleExplain">
          <el-input
            v-model="form.handleExplain"
            :autosize="{minRows: 2, maxRows: 5}"
            type="textarea"
            placeholder="请填写处理意见"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
          <el-button @click="cancelForm('form')">取消</el-button>
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
import { getReportList, handleReportList } from '@/api/circleModule/report'

export default {
  filters: {
    typeTxtFilter(status) {
      const txtMap = {
        1: '投诉用户',
        2: '投诉帖子',
        3: '投诉评论'
      }
      return txtMap[status]
    }
  },
  data() {
    return {
      listData: {}, // 列表总数据
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      form: {}, // 编辑信息
      dialogFormVisible: false,
      typeOptions: [
        { label: '投诉用户', value: 1 },
        { label: '投诉帖子', value: 2 },
        { label: '投诉评论', value: 3 }
      ],

      handleKey: '',
      handleOptions: [
        { label: '投诉用户昵称', value: 'customerNick' },
        { label: '投诉用户手机号', value: 'customerMobile' },
        { label: '投诉用户邮箱', value: 'customerEmail' }
      ],

      title: '被投诉人信息面板',
      form: {},
      rules: {
        handleExplain: [
          { required: true, message: '请填写处理意见', trigger: 'blur' }
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
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  mounted() {},
  methods: {
    async refresh() {
      let res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },

    async fetchData() {
      this.dialogFormVisible = false
      try {
        let res = await getReportList(this.queryList)

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    formVisible(style, item) {
      switch (style) {
        case 'deal':
          this.form = Object.assign({}, this.form, {
            itemData: item.itemData ? item.itemData : {},
            id: item.id,
            handleExplain: item.handleExplain
          })
          this.dialogFormVisible = true
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          handleReportList({
            id: this.form.id,
            handleExplain: this.form.handleExplain
          }).then(v => {
            this.$notify.success('处理成功')
            this.fetchData()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    },

    cancelForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
</style>
