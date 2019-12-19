<!--
 * @Description: news -> post
 * @Author: wangyun
 * @Date: 2019-09-02 15:50:05
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 14:26:08
 -->
<template>
  <div class="post-panel">
    <div class="st-container-fluid">
      <el-row class="row-bg">
        <el-col :xs="12" :sm="12" :md="6" :lg="6" :xl="12">
          <div class="header-content header-content--left">
            <label class="panel-label" @click="fetchData">
              <svg-icon icon-class="post" />
              全部帖子({{this.listData.total}})
            </label>
          </div>
        </el-col>

        <el-col :xs="12" :sm="12" :md="18" :lg="18" :xl="12">
          <div class="header-content header-content--right">
            <!-- 表单查询 -->
            <el-form :inline="true" class="demo-form-inline">
              <!-- <el-form-item>
                <el-popover placement="top-start" width="200" trigger="hover" content="支持评论内容关键字匹配">
                  <i slot="reference" class="el-icon-info" />
                </el-popover>
              </el-form-item>-->
              <el-form-item label>
                <el-input
                  v-model="queryList.s_LIKE_customerNick"
                  placeholder="输入评论内容关键字搜索"
                  clearable
                />
              </el-form-item>
              <el-form-item>
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
        <el-row class="row-bg" :gutter="60">
          <el-col
            class="col-item-body col-post-body st-fadeIn2"
            :xs="24"
            :sm="24"
            :md="24"
            :lg="12"
            :xl="12"
            v-for="(item,index) in listData.list"
            :key="index"
          >
            <div class="body-content">
              <template v-if="item.picList.length !==0">
                <el-image class="picfirst" :src="item.picList[0]" fit="cover"></el-image>
              </template>
              <template v-else>
                <div class="emptyImg emptyImg-big">暂无数据</div>
              </template>
              <div class="hastop-fixed" v-if="item.top">
                <img src="/static/publicImgs/hastop.svg" alt />
              </div>
              <div class="information">
                <section>{{item.content}}</section>
                <div class="information-bottom">
                  <div class="info-avatar">
                    <em v-if="!item.isRead"></em>
                    <el-avatar :size="50" :src="item.customerAvatar" @error="errorHandler">
                      <img
                        src="/static/publicImgs/default-avatar.png"
                        style="width: 50px; height: 50px"
                      />
                    </el-avatar>
                  </div>
                  <div class="info-specific">
                    <p>
                      <span class="customerNick">{{item.customerNick}}</span>
                      <span>{{item.createTime}}发布</span>
                    </p>
                    <p>
                      <b>点赞{{item.likesNum}}</b>
                      <b>评论{{item.commentNum}}</b>
                      <b>分享{{item.shareNum}}</b>
                      <b>打赏{{item.giveScore}}</b>
                    </p>
                  </div>
                </div>
              </div>
              <div class="body-content-fixed">
                <li @click="dealHandler(item, 'deletePost')">
                  <svg-icon icon-class="trash" />
                  <span>删除帖子</span>
                </li>
                <li v-if="!item.isRead" @click="dealHandler(item, 'tagRead')">
                  <svg-icon icon-class="sign" />
                  <span>标记已读</span>
                </li>
                <li @click="dealHandler(item, `${item.top ?  'unTopPost' : 'topPost'}`)">
                  <svg-icon :icon-class="item.top ? 'unstick' : 'stick'" />
                  <span>{{item.top ? '取消置顶' : '置顶帖子'}}</span>
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
        <el-form-item label="帖子内容">
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
  getPostList,
  deletePost,
  tagRead,
  topPost,
  unTopPost
} from '@/api/circleModule/news'

import { mapState } from 'vuex'

import loadingLine from '@/components/loadings/loading-line'
export default {
  props: {
    custUid: String
  },
  components: {
    loadingLine
  },
  data() {
    return {
      showLoading: false,
      queryList: {
        pageNum: 1,
        pageSize: 8,
        start: '',
        end: '',
        content: '' // 评论关键字
      },
      dateRange: '', // 日期范围
      listData: {},
      dialogVisible: false,
      form: {},
      title: '',
      rules: {
        remark: [{ required: true, message: '请填写删除理由' }]
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
    dateRange(val) {
      this.queryList.start = val ? val[0] : ''
      this.queryList.end = val ? val[1] : ''
    },
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.query.customerUid) {
      this.queryList = Object.assign({}, this.queryList, {
        customerUid: this.$route.query.customerUid
      })

      if (this.cachePageNum && this.fieldType == 'userPost') {
        this.queryList.pageNum = this.cachePageNum
      } else {
        this.fetchData()
      }
    }
  },
  methods: {
    async fetchData() {
      this.dialogVisible = false
      this.showLoading = true
      try {
        let res = await getPostList(this.queryList)
        setTimeout(() => {
          this.showLoading = false
        }, 500)

        this.listData = res.data
      } catch (e) {
        this.showLoading = false
      }
    },

    dealHandler(item, funName) {
      let params = { id: item.id }
      switch (funName) {
        case 'tagRead':
          tagRead(params).then(v => {
            this.$notify.success('标记成功')
            this.fetchData()
          })
          break
        case 'topPost':
          topPost(params).then(v => {
            this.$notify.success('置顶成功')
            this.fetchData()
          })
          break
        case 'unTopPost':
          unTopPost(params).then(v => {
            this.$notify.success('取消置顶成功')
            this.fetchData()
          })
          break
        case 'deletePost':
          this.title = `删除 用户【${item.customerNick}】 帖子`
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
            `你正在删除用户【${this.form.customerNick}】的帖子，是否继续？`,
            '警告',
            {
              type: 'warning',
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              closeOnClickModal: false
            }
          )
            .then(() => {
              deletePost(this.form).then(v => {
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
          fieldType: 'userPost',
          cachePageNum: this.queryList.pageNum
        })
      }

      // route skip postUid 详情需要字段
      this.$router.push({
        path: '/circle/postdetail',
        query: { moduleName: '用户详情', id: item.id, postUid: item.uid }
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

.post-panel {
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

  // 移到index的全局模块了
  // .col-post-body {
  // }
}
</style>