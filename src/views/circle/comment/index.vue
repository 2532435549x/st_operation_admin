<!--
 * @Description: comment
 * @Author: wangyun
 * @Date: 2019-09-02 15:50:13
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 14:24:29
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="默认以时间降序排列">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item label="选择排序方式">
          <el-dropdown @command="handleCommandSort" split-button>
            {{sortable | sortTxtFilter}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item, index) in sortOption"
                :key="index"
                :command="item.value"
                :disabled="sortable == item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.content" placeholder="输入评论内容关键字搜索" clearable />
        </el-form-item>

        <el-form-item label="发布时间：">
          <el-date-picker
            v-model="dateRange"
            type="daterange"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>
    <!-- 评论模块 -->
    <div class="comment">
      <div class="st-container-fluid">
        <div class="loading-container" v-if="showLoading">
          <loading-eat background="#409eff"></loading-eat>
        </div>
        <template v-else>
          <template v-if="listData.list &&  listData.list.length === 0">
            <div class="emptyData">
              <img src="/static/publicImgs/emptyData.svg" alt />
              <p>暂无数据</p>
            </div>
          </template>
          <el-row class="row-bg" :gutter="40">
            <el-col
              class="col-item-body col-comment-body st-fadeIn2"
              :xs="24"
              :sm="{span: 18, offset:3}"
              :md="{span: 12, offset:0}"
              :lg="12"
              :xl="8"
              v-for="(item,index) in listData.list"
              :key="index"
              :style="{'animation-delay': index *0.1+'s'}"
            >
              <div class="body-content">
                <div class="information">
                  <div class="information-left">
                    <em v-if="!item.isRead"></em>
                    <el-avatar :size="50" :src="item.customerAvatar" @error="errorHandler">
                      <img src="/static/publicImgs/default-avatar.png" />
                    </el-avatar>
                  </div>
                  <div class="information-right">
                    <div class="customerNick">{{item.customerNick}}</div>
                    <div class="information-right-info">
                      <span>{{item.createTime}}发布</span>
                      <b>评论{{item.commentNum}}</b>
                      <b>分享{{item.shareNum}}</b>
                      <b>打赏{{item.giveScore}}</b>
                    </div>
                    <div class="brief">
                      <div class="commentcut">{{item.content}}</div>
                      <div class="postcut">帖子：{{item.postContent}}</div>
                    </div>
                  </div>
                </div>
                <div class="body-content-fixed">
                  <li @click="dealHandler(item, 'deleteComment')">
                    <svg-icon icon-class="trash" />
                    <span>删除评论</span>
                  </li>
                  <li v-if="!item.isRead" @click="dealHandler(item, 'tagComRead')">
                    <svg-icon icon-class="sign" />
                    <span>标记已读</span>
                  </li>
                  <li @click="toDetail(item)">
                    <svg-icon icon-class="alleyes" />
                    <span>帖子详情</span>
                  </li>
                </div>
              </div>
            </el-col>
          </el-row>
        </template>
      </div>

      <!-- 弹出编辑框 -->
      <el-dialog :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false">
        <div slot="title" class="dialog-title">
          <b>{{title}}</b>
        </div>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
          <el-form-item label="评论内容">
            <el-input v-model="form.content" :autosize="{maxRows:8}" type="textarea" readonly />
          </el-form-item>

          <el-form-item label="添加删除理由" prop="remark">
            <el-input
              v-model="form.remark"
              :autosize="{minRows: 2, maxRows: 5}"
              type="textarea"
              placeholder="请添加添加删除理由"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('form')">确 定</el-button>
            <el-button @click="resetForm('form')">重 置</el-button>
            <el-button @click="cancel('form')">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 弹出编辑框 -->

      <!-- 翻页组件 -->
      <div class="pageQury st-fadeIn2" v-show="!showLoading">
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
    <!-- 评论模块 -->
  </div>
</template>
<script>
import {
  getCommentList,
  tagComRead,
  deleteComment
} from '@/api/circleModule/news'

import loadingLine from '@/components/loadings/loading-line'
import loadingEat from '@/components/loadings/loading-eat'

export default {
  components: {
    loadingLine,
    loadingEat
  },
  filters: {
    sortTxtFilter(val) {
      let sortTxt = ''
      switch (val) {
        case 'create_time':
          sortTxt = '时间排序'
          break
        case 'share_num':
          sortTxt = '分享排序'
          break
        case 'give_score':
          sortTxt = '打赏排序'
          break
        case 'likes_num':
          sortTxt = '点赞排序'
          break
      }
      return sortTxt
    }
  },
  data() {
    return {
      showLoading: false,
      queryList: {
        pageNum: 1,
        pageSize: 14,
        start: '',
        end: '',
        content: '', //评论内容关键字
        orderBy: 'create_time DESC' // 排序方式
      },
      listData: {},
      dateRange: '', // 日期范围
      sortable: 'create_time', // 默认时间排序
      sortOption: [
        { label: '时间排序', value: 'create_time' },
        { label: '分享排序', value: 'share_num' },
        { label: '打赏排序', value: 'give_score' },
        { label: '点赞排序', value: 'likes_num' }
      ],
      dialogVisible: false,
      form: {},
      title: '',
      rules: {
        remark: [{ required: true, message: '请填写删除理由', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    sortable(val, oldVal) {
      this.queryList.orderBy = `${val} DESC`
    },
    dateRange(val) {
      this.queryList.start = val ? val[0] : ''
      this.queryList.end = val ? val[1] : ''
      this.queryList.pageNum = 1
    },
    queryList: {
      handler(val) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  methods: {
    async fetchData() {
      this.dialogVisible = false
      this.showLoading = true
      try {
        let res = await getCommentList(this.queryList)
        this.showLoading = false

        if (res.code === 1000) {
          this.listData = res.data

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.showLoading = false

        return { result: false, text: e }
      }
    },

    handleCommandSort(command) {
      this.sortable = command
    }, // 选择排序方式

    dealHandler(item, funName) {
      let params = { id: item.id }
      switch (funName) {
        case 'tagComRead':
          tagComRead(params).then(v => {
            this.$notify.success('标记成功')
            this.fetchData()
          })
          break
        case 'deleteComment':
          this.title = `删除 用户【${item.customerNick}】 评论`
          this.form = Object.assign({}, this.form, {
            id: item.id,
            content: item.content,
            customerNick: item.customerNick,
            remark: ''
          })
          this.dialogVisible = true
          break
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `你正在删除【${this.form.customerNick}】的评论，是否继续？`,
            '警告',
            {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false
            }
          )
            .then(() => {
              deleteComment(this.form).then(v => {
                this.$notify.success('删除成功')
                this.fetchData()
              })
            })
            .catch(e => {
              this.$notify.info('已取消删除')
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

    cancel(formName) {
      this.$refs[formName].resetFields() // 需要重置一下 不然有些情况会现红
      this.dialogVisible = false
    },

    toDetail(item) {
      this.$router.push({
        path: '/circle/postdetail',
        query: {
          moduleName: '评论管理',
          id: item.postId,
          postUid: item.postUid
        }
      })
    },

    handleCurrentChange(currentPage) {
      this.queryList.pageNum = currentPage
      this.$_setContextData('xxx-pageNum', currentPage)
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/output.scss";

// 移到index 全局模块了
// .col-comment-body {
// }
</style>