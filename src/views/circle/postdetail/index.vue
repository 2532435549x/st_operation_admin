<!--
 * @Description: postdetail
 * @Author: wangyun
 * @Date: 2019-09-05 19:45:58
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-22 14:23:55
 -->
<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="goBack" :content="moduleName"></el-page-header>
    </div>
    <div class="postdetail-container">
      <div class="container-left">
        <!-- 帖子详情模块 -->
        <div class="information">
          <div class="information-title">
            <span>帖子内容</span>
            <label v-if="postDetail" @click="replyCommentBtn(postDetail, 1)">
              <i class="el-icon-s-order"></i>
              <span>回复帖子</span>
            </label>
          </div>
          <div class="information-top">
            <el-avatar
              class="avatar"
              :size="40"
              :src="postDetail.customerAvatar"
              @error="errorHandler"
            >
              <img src="/static/publicImgs/default-avatar.png" />
            </el-avatar>
            <div class="information-top-info">
              <div class="information-top-info-name">{{postDetail.customerNick}}</div>
              <div class="information-top-info-other">
                <span>{{postDetail.createTime}}发布</span>
                <b>分享{{postDetail.shareNum}}</b>
                <b>点赞{{postDetail.likesNum}}</b>
              </div>
            </div>
          </div>
          <div class="information-bottom">
            <div class="post-detail">{{postDetail.content}}</div>
            <div class="post-imgsList" v-if="postDetail.picList && postDetail.picList.length !==0">
              <div
                class="postImg"
                v-for="(item,index) in postDetail.picList.slice(0,9)"
                :key="index"
              >
                <el-image
                  :src="item"
                  :preview-src-list="postDetail.picList.slice(index)"
                  fit="cover"
                  shape="square"
                  style="width:80px; height: 80px "
                >
                  <div slot="placeholder" class="image-slot">
                    加载中
                    <span class="dot">...</span>
                  </div>
                </el-image>
              </div>
            </div>
          </div>
        </div>
        <!-- 帖子详情模块 -->

        <!-- 打赏模块 -->
        <div class="reward">
          <div class="reward-title">帖子打赏（共{{rewardList.length}}个）</div>
          <div class="reward-ul">
            <div class="reward-li" v-for="(item,index) in rewardList" :key="index">
              <el-avatar class="avatar" :size="40" :src="item.customerAvatar" @error="errorHandler">
                <img src="/static/publicImgs/default-avatar.png" />
              </el-avatar>
              <div class="info">
                <div class="info-name">{{item.customerNick}}</div>
                <div class="info-time">{{item.createTime}}</div>
                <div class="info-line"></div>
                <div class="info-integral">+{{item.giveScore}}积分</div>
              </div>
            </div>
          </div>
        </div>
        <!-- 打赏模块 -->
      </div>

      <!-- 评论详情模块 -->
      <div class="container-right">
        <div class="comment-title">评论内容（共{{commentList.length}}条）</div>
        <div class="comment-ul">
          <div class="comment-li" v-for="(item,index) in commentList" :key="index">
            <div class="comment-li-top">
              <el-avatar class="avatar" :size="40" :src="item.customerAvatar" @error="errorHandler">
                <img src="/static/publicImgs/default-avatar.png" style="width: 40px; height: 40px;" />
              </el-avatar>
              <div class="info">
                <div class="info-name">{{item.customerNick}}</div>
                <div class="info-other">
                  <span class="time">{{item.createTime}}</span>
                  <b class="like">点赞{{item.likesNum}}</b>
                </div>
              </div>
              <div class="godcom" v-if="item.hot">
                <label>
                  <i class="el-icon-s-flag"></i>
                  <span>神评</span>
                </label>
              </div>
              <div class="operation">
                <label @click="replyCommentBtn(item, 2)">
                  <i class="el-icon-s-comment"></i>
                  <span>回复</span>
                </label>
                <label @click="deleteCommentBtn(item)">
                  <i class="el-icon-delete-solid"></i>
                  <span>删除</span>
                </label>
                <label @click="hotHandler(item)">
                  <i :class="item.hot ?  'el-icon-s-release' :'el-icon-s-claim' "></i>
                  <span>{{item.hot ? '取消神评':'选为神评' }}</span>
                </label>
              </div>
            </div>
            <div class="comment-li-bottom">
              <div class="person">{{item.content}}</div>
              <div class="group">
                <template v-if="item.childrens.length !==0">
                  <div class="group-com" v-for="(v,index) in item.childrens" :key="index">
                    <div class="group-com-detail">
                      <template v-if="v.reply && Object.keys(v.reply).length !== 0">
                        <b>{{v.customerNick}}</b>
                        回复
                        <b>{{v.reply.customerNick}}</b>
                        {{v.content}}
                      </template>
                      <template v-else>
                        <b>{{v.customerNick}}：</b>
                        {{v.content}}
                      </template>
                    </div>
                    <div class="group-com-fixIcon">
                      <li @click="replyCommentBtn(v, 2)">
                        <i class="el-icon-s-comment icon-style"></i>
                        <span>回复</span>
                      </li>
                      <li @click="deleteCommentBtn(v)">
                        <i class="el-icon-error icon-style"></i>
                        <span>删除</span>
                      </li>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 评论详情模块 -->

      <!-- 弹出编辑框 -->
      <el-dialog :visible.sync="dialogVisible" :show-close="false" :close-on-click-modal="false">
        <div slot="title" class="dialog-title">
          <b>{{title.text}}</b>
        </div>
        <el-form
          ref="deleteForm"
          :model="deleteForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item label="评论内容">
            <el-input v-model="deleteForm.content" :autosize="{maxRows:8}" type="textarea" readonly />
          </el-form-item>

          <el-form-item label="添加删除理由" prop="remark">
            <el-input
              v-model="deleteForm.remark"
              :autosize="{minRows: 2, maxRows: 5}"
              type="textarea"
              placeholder="请添加添加删除理由"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('deleteForm')">确 定</el-button>
            <el-button @click="resetForm('deleteForm')">重 置</el-button>
            <el-button @click="cancelForm('deleteForm')">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 弹出编辑框 -->

      <!-- 弹出编辑框 -->
      <el-dialog
        :visible.sync="dialogReplyVisible"
        :show-close="false"
        :close-on-click-modal="false"
      >
        <div slot="title" class="dialog-title">
          <b>{{title.text}}</b>
        </div>
        <el-form
          ref="replyForm"
          :model="replyForm"
          :rules="rules"
          label-width="120px"
          class="demo-ruleForm"
        >
          <el-form-item :label="this.replyForm.target == 1 ?  '帖子内容' : '评论内容'">
            <el-input v-model="replyForm.content" :autosize="{maxRows:8}" type="textarea" readonly />
          </el-form-item>

          <el-form-item label="添加回复内容" prop="replyContent">
            <el-input
              v-model="replyForm.replyContent"
              :autosize="{minRows: 2, maxRows: 5}"
              type="textarea"
              placeholder="请添加添加回复内容"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('replyForm')">确 定</el-button>
            <el-button @click="resetForm('replyForm')">重 置</el-button>
            <el-button @click="cancelForm('replyForm')">取 消</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
      <!-- 弹出编辑框 -->
    </div>
  </div>
</template>
<script>
import {
  getPostDetail,
  getRewardList,
  getPostCommentList,
  deleteComment,
  setComHot,
  replyCom
} from '@/api/circleModule/news'
export default {
  data() {
    return {
      moduleName: '上一级', // 上级模块名字
      postDetail: {
        picList: []
      }, // 帖子详情数据
      postD_params: {},
      commentD_params: {},
      rewardList: {}, // 打赏列表
      commentList: [], // 帖子评论列表
      dialogVisible: false,
      deleteForm: {},

      dialogReplyVisible: false,
      replyForm: {},

      title: {
        editType: '',
        text: ''
      },

      rules: {
        remark: [
          { required: true, message: '请填写删除理由', trigger: 'blur' }
        ],
        replyContent: [
          { required: true, message: '请填写回复内容', trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initFetch()
  },
  methods: {
    goBack() {
      this.$router.go(-1)
    },

    initFetch() {
      this.dialogVisible = false
      this.dialogReplyVisible = false
      if (this.$route.query) {
        let query = this.$route.query
        if (query.id) {
          this.postD_params = { id: query.id }
          this.fetchPostDetail()
          this.fetchRewardDetail()
        }
        if (query.postUid) {
          this.commentD_params = { postUid: query.postUid }
          this.fetchCommentDetail()
        }
        if (query.moduleName) {
          this.moduleName = query.moduleName
        }
      }
    },

    // 获取帖子详情
    async fetchPostDetail() {
      try {
        let res = await getPostDetail(this.postD_params)
        res.data.createTime = this.formatTime(new Date(res.data.createTime))
        this.postDetail = res.data
      } catch (e) {}
    },

    // 获取打赏详情
    async fetchRewardDetail() {
      try {
        let res = await getRewardList(this.postD_params)
        this.rewardList = res.data
      } catch (e) {}
    },

    // 获取帖子评论详情
    async fetchCommentDetail() {
      this.dialogVisible = false
      this.dialogReplyVisible = false
      try {
        let res = await getPostCommentList(this.commentD_params)
        this.commentList = res.data
      } catch (e) {}
    },

    // 热评操作
    hotHandler(item) {
      setComHot({ id: item.id, hot: !item.hot }).then(v => {
        this.$notify.success(`${item.hot ? '取消' : '选为'}神评成功`)
        this.fetchCommentDetail()
      })
    },

    // 回复操作
    replyCommentBtn(item, type) {
      console.log('item: ', item)
      this.title = Object.assign({}, this.title, {
        editType: 'reply',
        text: `回复 用户【${item.customerNick}】 ${type == 1 ? '帖子' : '评论'}`
      })
      this.replyForm = Object.assign({}, this.replyForm, {
        id: item.id,
        target: type,
        itemUid: item.uid,
        customerNick: item.customerNick,
        content: item.content,
        replyContent: ''
      })
      this.dialogReplyVisible = true
    },

    // 删除评论操作
    deleteCommentBtn(item) {
      this.title = Object.assign({}, this.title, {
        editType: 'delete',
        text: `删除 用户【${item.customerNick}】评论`
      })
      this.deleteForm = Object.assign({}, this.deleteForm, {
        id: item.id,
        customerNick: item.customerNick,
        content: item.content,
        remark: ''
      })
      this.dialogVisible = true
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title.editType == 'delete') {
            this.$confirm(
              `你正在删除【${this.deleteForm.customerNick}】的评论，是否继续？`,
              '警告',
              {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                closeOnClickModal: false
              }
            )
              .then(() => {
                deleteComment(this.deleteForm).then(v => {
                  this.$notify.success('删除成功')
                  this.fetchCommentDetail()
                })
              })
              .catch(e => {
                this.$notify.info('已取消删除')
              })
          } else if (this.title.editType == 'reply') {
            replyCom(this.replyForm).then(v => {
              this.$notify.success('回复成功')
              this.fetchCommentDetail()
            })
          }
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
      this.$refs[formName].resetFields() // 需要重置一下 不然有些情况会现红
      this.dialogVisible = false
      this.dialogReplyVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/output.scss";
$shadow: rgb(185, 179, 179);

.postdetail-container {
  min-height: calc(100vh - 150px);
  padding: 10px 20px 10px;
  overflow-y: auto;
  display: flex;
  .container-left {
    width: 25%;
    min-width: 380px;
    margin-right: 20px;
    .information {
      width: 100%;
      padding: 20px;
      background: #fff;
      box-shadow: 2px 2px 3px 2px $shadow;

      &-title {
        font-weight: bold;
        position: relative;
        label {
          position: absolute;
          right: 0;
          padding: 5px;
          color: $labelCol;
          background: $labelBg;
          font-weight: normal;
          transition: all 0.3s ease;
        }
        label:hover {
          cursor: pointer;
          color: $labelColHover;
          background: $labelBgHover;
          @extend %item-box-shadow;
        }
      }

      &-top {
        margin: 15px 0;
        // margin-left: -10px;
        display: flex;
        align-items: center;

        &-info {
          margin-left: 10px;
          font-size: 14px;
          &-name {
            color: $customerNick;
            font-weight: bold;
          }
          &-other {
            margin-top: 6px;
            span {
              color: $createTime;
              margin-right: 5px;
            }
            b {
              margin-right: 5px;
            }
          }
        }
      }

      &-bottom {
        .post-detail {
          font-size: 14px;
          line-height: 18px;
          text-align: justify;
        }
        .post-imgsList {
          width: 100%;
          margin-top: 10px;
          padding: 20px 0;
          display: flex;
          flex-wrap: wrap;
          align-content: space-between;
          background: #f6f6f6;
          .postImg {
            width: 33%;
            text-align: center;
            margin-bottom: 10px;
          }
        }
      }
    }

    .reward {
      margin-top: 40px;
      padding: 20px;
      background: #fff;
      box-shadow: 2px 2px 3px 2px $shadow;

      &-title {
        font-weight: bold;
        margin: 20px 0;
      }

      &-ul {
        padding-right: 10px;
        max-height: 400px;
        overflow-y: auto;
      }

      &-li {
        list-style: none;
        display: flex;
        align-items: center;
        margin-bottom: 15px;
        .info {
          width: calc(100% - 48px);
          position: relative;
          font-size: 14px;
          margin-left: 8px;
          margin-bottom: -4px;

          &-name {
            color: $customerNick;
            font-weight: bold;
          }

          &-time {
            color: $createTime;
            margin: 4px 0;
          }

          &-line {
            width: 100%;
            height: 1px;
            background: #ccc;
          }

          &-integral {
            position: absolute;
            top: 20%;
            right: 0;
            color: #000;
            font-weight: bold;
          }
        }
      }
    }
  }

  .container-right {
    width: calc(75% - 20px);
    min-width: 800px;
    max-height: calc(100vh - 180px);
    padding: 20px 40px;
    background: #fff;
    box-shadow: 2px 2px 3px 2px $shadow;
    overflow: hidden;
    .comment {
      &-title {
        line-height: 20px;
        margin: 15px 0;
        font-weight: bold;
      }

      &-ul {
        padding-right: 40px;
        padding-bottom: 30px;
        height: calc(100% - 50px);
        overflow-y: auto;
      }

      &-li {
        &-top {
          position: relative;
          padding: 10px 0;
          display: flex;
          align-items: center;
          .info {
            margin-left: 10px;
            color: #424242;
            font-size: 14px;
            &-name {
              color: $customerNick;
              font-weight: bold;
            }
            &-other {
              margin-top: 6px;
              .time {
                color: $createTime;
                margin-right: 10px;
              }
            }
          }
          .godcom {
            position: absolute;
            left: 45%;
            label {
              border-radius: 15px;
              padding: 5px 8px;
              font-size: 15px;
              @extend %text-shadow;
            }
          }
          .operation {
            position: absolute;
            right: 0;
            label {
              padding: 5px;
              color: $labelCol;
              background: $labelBg;
              font-weight: normal;
              transition: all 0.3s ease;
            }
            label:hover {
              cursor: pointer;
              color: $labelColHover;
              background: $labelBgHover;
              @extend %item-box-shadow;
            }
          }
        }

        &-bottom {
          width: 90%;
          margin: 0 auto;
          font-size: 14px;

          .person {
            text-indent: 1em;
            margin: 5px 0;
          }

          .emptyComment {
            padding-left: 0.5em;
            font-size: 14px;
            line-height: 32px;
          }

          .group {
            color: #616161;
            background: #f5f5f5;
            b {
              color: #000;
            }
            &-com {
              margin-bottom: 4px;
              text-align: justify;
              padding: 6px 10px;
              position: relative;
              cursor: default;
              &-detail {
                transition: all 0.3s ease;
              }
              &-fixIcon {
                display: none;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                li {
                  display: inline-block;
                  margin: 0 10px;
                  color: rgba(0, 0, 0, 0.9);
                  .icon-style {
                    font-size: 20px;
                    vertical-align: middle;
                    transition: all 0.2s ease;
                  }
                  span {
                    font-size: 12px;
                  }
                }
              }
            }
          }

          .group-com:hover {
            .group-com-detail {
              padding: 15px 10px;
              opacity: 0.3;
              @extend %item-box-shadow;
            }
            .group-com-fixIcon {
              display: block;
            }
          }

          .group-com-fixIcon > li:hover {
            cursor: pointer;
            color: $-theme;
          }
        }
      }
    }
  }
}
</style>