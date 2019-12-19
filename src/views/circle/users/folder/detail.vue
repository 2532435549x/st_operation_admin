<!--
 * @Description: userdetail
 * @Author: wangyun
 * @Date: 2019-09-07 17:08:38
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-20 10:20:50
 -->
<template>
  <div class="userdetail-container">
    <!-- 用户信息模块 -->
    <el-row class="userInfo" :gutter="20">
      <el-col :xs="4" :sm="4" :md="4" :lg="3" :xl="2">
        <el-avatar :size="100" :src="userDetail.customerAvatar" @error="errorHandler">
          <img src="/static/publicImgs/default-avatar.png" style="width: 100px; height:100px;" />
        </el-avatar>
      </el-col>
      <el-col :xs="7" :sm="8" :md="8" :lg="7" :xl="8">
        <div class="userInfo-label">
          <div class="userInfo-label-name">{{userDetail.customerNick}}</div>
          <div class="userInfo-label-type">
            <span
              v-for="(v,index) in userLabel"
              :key="index"
              :style="[{backgroundColor: v.backgroundColor, color: v.textColor}]"
            >{{v.name}}</span>
            <el-button type="primary" size="mini" round @click="editUserLabelBtn()">编辑标签</el-button>
          </div>
        </div>
      </el-col>
      <el-col :xs="11" :sm="11" :md="10" :lg="10" :xl="10">
        <div class="userInfo-other">
          <li>
            <b>{{userDetail.followNum}}</b>
            <span>关注</span>
          </li>
          <li>
            <b>{{userDetail.favoriteNum}}</b>
            <span>收藏</span>
          </li>
          <li>
            <b>{{userDetail.fanNum}}</b>
            <span>粉丝</span>
          </li>
          <li>
            <b>{{userDetail.score}}</b>
            <span>积分</span>
          </li>
        </div>
      </el-col>
      <el-col :xs="4" :sm="4" :md="4" :lg="4" :xl="4" style="text-align: right;">
        <el-button type="primary" class="userInfo-blacklist" @click="shutInBlackBtn()">关进小黑屋</el-button>
        <div class="grid-content bg-purple"></div>
      </el-col>
    </el-row>

    <!-- 全部帖子 -->
    <totalPost class="totalPost" :custUid="customerUid"></totalPost>

    <!-- 全部评论 -->
    <totalComment class="totalComment" :custUid="customerUid"></totalComment>

    <!-- 弹出编辑框 -->
    <el-dialog
      :visible.sync="dialogVisible"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span slot="title" class="dialog-header">
        <b>{{title.text}}</b>
      </span>

      <el-form
        ref="labelForm"
        :model="labelForm"
        label-width="130px"
        v-if="title.editType == 'label'"
      >
        <el-form-item label="选择用户标签" prop="labels">
          <el-select v-model="labelForm.labels" multiple placeholder="请选择标签" style="width:350px;">
            <el-option
              v-for="(item, index) in labelOptions"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button
          type="primary"
          @click=" title.editType == 'label' ? submitForm('labelForm') : submitForm('blackForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑框 -->

    <!-- 弹出编辑框 -->
    <el-dialog
      :visible.sync="dialogVisible2"
      :show-close="false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <span slot="title" class="dialog-header">
        <b>{{title.text}}</b>
      </span>

      <el-form ref="blackForm" :model="blackForm" label-width="100px">
        <el-form-item label="拉黑原因" prop="reason">
          <el-select v-model="blackForm.reason" placeholder="拉黑原因">
            <el-option
              v-for="(item, index) in reasonOptions"
              :key="index"
              :label="item.dataName"
              :value="item.dataValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="拉黑时间">
          <el-date-picker
            v-model="timeHorizon"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
          />
        </el-form-item>
        <el-form-item label="限制功能">
          <el-switch
            class="switch-black"
            v-model="blackForm.banPublishComment"
            active-color="#13ce66"
            active-text="评论"
          ></el-switch>
          <el-switch
            class="switch-black"
            v-model="blackForm.banPublishPost"
            active-color="#13ce66"
            active-text="发帖"
          ></el-switch>
          <el-switch
            class="switch-black"
            v-model="blackForm.banGiveScore"
            active-color="#13ce66"
            active-text="打赏"
          ></el-switch>
          <el-switch
            class="switch-black"
            v-model="blackForm.banLogin"
            active-color="#13ce66"
            active-text="登录"
          ></el-switch>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button
          type="primary"
          @click=" title.editType == 'label' ? submitForm('labelForm') : submitForm('blackForm')"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出编辑框 -->
  </div>
</template>
<script>
import totalPost from './components/UserTotalPost'
import totalComment from './components/UserTotalComment'
import {
  getUserDetail,
  getUserLabelTotal,
  getUserLabel,
  saveUserLabel
} from '@/api/circleModule/users'

import {
  getUserBlackState,
  shutInBlackroom,
  getComplaintReason
} from '@/api/circleModule/blacklist'

export default {
  components: {
    totalPost,
    totalComment
  },
  data() {
    return {
      id: '', // 用户列表id
      customerUid: '', // 用户id
      userDetail: {}, // 用户详情
      userLabel: [], // 用户已有标签列表

      dialogVisible: false,
      dialogVisible2: false,

      title: {
        editType: '', // 'black' 'label'
        text: ''
      },

      labelOptions: [], // 总标签列表
      labelForm: {
        labels: [] // 标签列表
      },

      timeHorizon: [], // 日期时间范围
      reasonOptions: [], // 总拉黑原因列表
      blackForm: {
        startTime: '',
        endTime: ''
      }
    }
  },
  watch: {
    timeHorizon(val) {
      this.blackForm.startTime = val ? val[0] : ''
      this.blackForm.endTime = val ? val[1] : ''
    }
  },
  created() {
    this.initFetch()
  },
  methods: {
    cancel() {
      this.dialogVisible = false
      this.dialogVisible2 = false
    },
    initFetch() {
      this.dialogVisible = false
      this.dialogVisible2 = false

      if (this.$route.query.id) {
        this.id = this.$route.query.id
        this.fetchUserDetail()
      }

      if (this.$route.query.customerUid) {
        this.customerUid = this.$route.query.customerUid
        this.fetchUserLabel()
      }
    },

    // 获取用户详情
    fetchUserDetail() {
      getUserDetail({ id: this.id }).then(v => {
        this.userDetail = v.data
      })
    },

    // 获取用户标签
    fetchUserLabel() {
      getUserLabel({ customerUid: this.customerUid }).then(v => {
        this.userLabel = v.data
      })
    },

    // 编辑标签按钮
    async editUserLabelBtn() {
      this.labelOptions = []
      this.labelForm.labels = []

      let res = await getUserLabelTotal({ customerUid: this.customerUid })

      if (res) {
        this.title = Object.assign({}, this.title, {
          editType: 'label',
          text: `编辑【${
            this.userDetail.customerNick ? this.userDetail.customerNick : ''
          }】标签`
        })

        res.data.forEach(v => {
          this.labelOptions.push({
            id: v.id,
            name: v.name
          })

          if (v.checked) {
            this.labelForm.labels.push(v.id)
          }
        })
        this.dialogVisible = true
      }
    },

    // 关进小黑屋
    async shutInBlackBtn() {
      this.timeHorizon = []

      let state_res = await getUserBlackState({
        customerUid: this.customerUid
      })

      let reason_res = await getComplaintReason({
        dictName: 'complaint_reason'
      })

      if (state_res) {
        this.blackForm = state_res.data
        if (this.blackForm.startTime && this.blackForm.endTime) {
          this.timeHorizon.push(
            this.blackForm.startTime,
            this.blackForm.endTime
          )
        }
      }

      if (reason_res) {
        this.reasonOptions = reason_res.data
      }

      if (state_res && reason_res) {
        this.title = Object.assign({}, this.title, {
          editType: 'black',
          text: `拉黑用户【${
            this.userDetail.customerNick ? this.userDetail.customerNick : ''
          }】`
        })

        this.dialogVisible2 = true
      }
    },

    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.title.editType == 'label') {
            saveUserLabel({
              customerUid: this.customerUid,
              labels: this.labelForm.labels
            }).then(v => {
              this.$message.success(`成功${this.title.text}`)
              this.initFetch()
            })
          } else if (this.title.editType == 'black') {
            if (this.blackForm.reason == '') {
              this.$message.error('请选择拉黑原因')
              return
            }
            if (this.timeHorizon.length === 0) {
              this.$message.error('请选择拉黑时间')
              return
            }
            shutInBlackroom(this.blackForm).then(v => {
              this.$message.success(`成功${this.title.text}`)
              this.initFetch()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/output.scss";

.userdetail-container {
  min-height: calc(100vh - 50px);
  padding: 20px;
  overflow-y: auto;
  background: #f5f5f5;
  .userInfo {
    padding: 10px 20px;
    background: #fff;
    display: flex;
    align-items: center;
    @extend %boxshadow;

    &-label {
      &-name{
        color:$customerNick;
        font-weight: bold;
      }
      &-type {
        color: #616161;
        font-size: 14px;
        margin-top: 20px;
        span {
          display: inline-block;
          padding: 4px 6px;
          margin-right: 4px;
          border-radius: 10px;
          border: 1px solid #ccc;
        }
      }
    }

    &-other {
      width: 80%;
      display: flex;
      justify-content: space-around;
      li {
        // width: 25%;
        display: flex;
        flex-direction: column;
        align-items: center;
        b {
          font-size: 20px;
        }
        span {
          margin-top: 6px;
          color: #616161;
          font-size: 14px;
        }
      }
    }
  }
  .totalPost {
    margin: 50px 0;
  }
}

.switch-black {
  margin-right: 10px;
}
</style>