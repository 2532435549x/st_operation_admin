<!--
 * @Description: news -> comment
 * @Author: wangyun
 * @Date: 2019-09-02 15:50:13
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 14:23:18
 -->
<template>
  <div class="comment-panel">
    <div class="st-container-fluid">
      <el-row class="row-bg">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="12">
          <div class="header-content header-content--left">
            <label class="panel-label" @click="fetchData()">
              <svg-icon icon-class="comment" style="margin-right: 5px; " />
              最新评论({{listData.total}})
            </label>
          </div>
        </el-col>
        <el-col :xs="12" :sm="12" :md="18" :lg="18" :xl="12">
          <div class="header-content header-content--right">
            <label class="panel-label" @click="readComAll">
              <svg-icon icon-class="alleyes" style="margin-right: 5px;" />全部已读
            </label>
          </div>
        </el-col>
      </el-row>
    </div>

    <div class="st-container-fluid">
      <div class="loading-container" v-if="showLoading">
        <loading-line background="#409eff"></loading-line>
      </div>
      <template v-else>
        <template v-if="listData.list &&  listData.list.length === 0">
          <div class="emptyData">
            <img src="/static/publicImgs/emptyData.svg" alt />
            <p>暂无数据</p>
          </div>
        </template>
        <el-row class="row-bg" :gutter="20">
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
                    <img
                      src="/static/publicImgs/default-avatar.png"
                      style="width: 50px; height: 50px"
                    />
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
                  <span>删除帖子</span>
                </li>
                <li @click="dealHandler(item, 'tagComRead')">
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
    <el-dialog
      :visible.sync="dialogVisible"
      :append-to-body="true"
      :show-close="false"
      :close-on-click-modal="false"
    >
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
    <div class="panel-page st-fadeIn2" v-show="!showLoading">
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
import {
  getNewCommentList,
  tagComRead,
  tagComReadAll,
  deleteComment
} from '@/api/circleModule/news'

import { mapState } from 'vuex'

import loadingLine from '@/components/loadings/loading-line'

export default {
  components: {
    loadingLine
  },
  data() {
    return {
      showLoading: false,
      queryList: {
        pageNum: 1,
        pageSize: 8
      },
      listData: {},
      dialogVisible: false,
      form: {},
      title: '',
      rules: {
        remark: [{ required: true, message: '请填写删除理由', trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      fieldType: state => state.circle.fieldType,
      cachePageNum: state => state.circle.cachePageNum
    })
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    if (this.cachePageNum && this.fieldType == 'newComment') {
      this.queryList.pageNum = this.cachePageNum
    } else {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      this.dialogVisible = false
      this.showLoading = true
      try {
        let res = await getNewCommentList(this.queryList)
        setTimeout(() => {
          this.showLoading = false
        }, 500)
        this.listData = res.data

        return { result: true, text: 'success' }
      } catch (e) {
        this.showLoading = false

        return { result: false, text: e }
      }
    }, // fetchData

    readComAll() {
      if (this.listData.list && this.listData.list.length === 0) {
        return this.$message.warning('评论内容为空')
      }

      let paramsArr = []
      this.listData.list.forEach(v => {
        paramsArr.push(v.id)
      })
      tagComReadAll({ ids: paramsArr }).then(v => {
        this.$message.success('本页已读')
        this.fetchData()
      })
    },

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
      // 不是第一页 记录缓存页码
      if (this.queryList.pageNum != 1) {
        this.$store.commit('setCachePageNum', {
          fieldType: 'newComment',
          cachePageNum: this.queryList.pageNum
        })
      }

      // postUid 详情需要字段
      this.$router.push({
        path: '/circle/postdetail',
        query: {
          moduleName: '最新消息',
          id: item.postId,
          postUid: item.postUid
        }
      })
    },

    handleCurrentChange(currentPage) {
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/output.scss";

.comment-panel {
  padding: 20px 0;
  overflow: hidden;
  background: #fff;
  @extend %boxshadow;
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }

  .header-content {
    min-height: 40px;
    line-height: 40px;
    .panel-label {
      padding: 8px;
      border-radius: 6px;
      font-weight: 600;
      color: $-theme;
      transition: all 0.3s ease;
      cursor: pointer;
    }
    .panel-label:hover {
      color: #fff;
      background: $-theme;
    }
  }

  .header-content {
    &--right {
      text-align: right;
    }
  }

  // 移到index 全局模块了
  // .col-comment-body {
  // }

  .panel-page {
    text-align: right;
    padding: 0 40px;
  }
}
</style>