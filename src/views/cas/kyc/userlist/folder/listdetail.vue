<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-20 14:30:04
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container1">
    <el-form ref="form" :model="detail" :rules="rules" label-width="180px" class="demo-ruleForm">
      <el-form-item label="姓名">
        <el-input :value="detail.name" readonly />
        <span class="title">uid</span>
        <el-input :value="detail.uid" readonly />
      </el-form-item>
      <el-form-item label="昵称">
        <el-input :value="detail.userNick" readonly />
        <span class="title">登录号码</span>
        <el-input :value="detail.userMobile||detail.userEmail" readonly />
      </el-form-item>
      <el-form-item label="国家名">
        <el-input :value="detail.countryName" readonly />
        <span class="title">国家名(英文)</span>
        <el-input :value="detail.countryNameEn" readonly />
      </el-form-item>
      <el-form-item label="证件类型">
        <el-input v-if="detail.certificateType==1" value="身份证" readonly />
        <span class="title">证件号码</span>
        <el-input :value="detail.certificateNumber" readonly />
      </el-form-item>
      <el-form-item label="添加时间">
        <el-input v-model="detail.createTime" readonly />
        <span class="title">更新时间</span>
        <el-input v-model="detail.updateTime" readonly />
      </el-form-item>
      <el-form-item label="百度脸库groupId-待审核">
        <el-input v-model="detail.groupIdToBeAudit" readonly />
        <span class="title">百度脸库groupId-已通过</span>
        <el-input v-model="detail.groupIdAuditPassed" readonly />
      </el-form-item>
      <div class="idcardimg">
        <p class="title">证件正面照片</p>
        <div class="images" v-viewer="{movable: false}">
          <img :src="detail.frontCertificateUrl" />
        </div>
        <p class="title">证件背面照片</p>
        <div class="images1" v-viewer="{movable: false}">
          <img :src="detail.backCertificateUrl" />
        </div>
      </div>
      <el-form-item label="本人脸部照片">
        <div class="images2" v-viewer="{movable: false}">
          <img :src="detail.faceImgUrl" />
        </div>
      </el-form-item>
      <el-form-item label="审核栏" required>
        <el-input value="审核用户信息" readonly />
        <div class="detail">1、匹配用户上传的证件和实拍的相似度。</div>
         <el-button type="primary"  @click="look1">点击匹配</el-button>
        <div class="detail">2、从已注册的证件照查重。</div>
        <el-button type="primary" @click="look">点击查重</el-button>
      </el-form-item>
      <el-form-item v-if="this.detail.auditRemark" label="上次审核说明：">
        <span>{{this.detail.auditRemark}}</span>
      </el-form-item>
      <el-form-item v-if="kycAuditStatus==3" label="本次审核说明">
        <el-select disabled v-model="list1" placeholder="请选择审核说明">
          <el-option v-for="(i,index) in list" :key="index" :label="i.cfgName" :value="i.cfgValue"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else label="本次审核说明" required>
        <el-select v-model="list1" placeholder="请选择审核说明">
          <el-option v-for="(i,index) in list" :key="index" :label="i.cfgName" :value="i.cfgValue"></el-option>
        </el-select>
      </el-form-item>
      <div style="display:flex;">
        <el-form-item v-if="kycAuditStatus==3" label="审核状态">
          <el-radio-group v-model="detail.kycAuditStatus">
            <el-radio disabled :label="3">审核成功</el-radio>
            <el-radio disabled :label="4">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-if="kycAuditStatus!==3" label="审核状态" required>
          <el-radio-group v-model="detail.kycAuditStatus">
            <el-radio :label="3">审核成功</el-radio>
            <el-radio :label="4">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button v-if="kycAuditStatus==3" type="info">确定</el-button>
        <el-button v-if="kycAuditStatus!==3" type="primary" @click="submitForm('form')">确定</el-button>
        <el-button v-if="kycAuditStatus==3" type="info">取消</el-button>
        <el-button v-if="kycAuditStatus!==3" @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
    <!-- 弹出编辑框 -->
    <el-dialog  :visible.sync="dialogFormVisible" title="查看匹配结果">
      <el-form ref="form" label-width="120px" class="demo-ruleForm">
        <el-form-item v-if="facedata.msg" label="匹配结果">
          <el-input :value="facedata.msg" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item v-if="facedata.score" label="得分">
          <el-input :value="facedata.score" :min="1" :max="1000" />
        </el-form-item>
        <el-form-item v-if="facedata.picUrlCheck" label="当前上传照片">
          <img class="faceimg" :src="facedata.picUrlCheck" alt />
        </el-form-item>
        <el-form-item v-if="facedata.picURlSimilar" label="图库匹配照片">
          <img class="faceimg" :src="facedata.picURlSimilar" alt />
        </el-form-item>
        <el-form-item>
          <el-button style="margin-left:250px" type="primary" @click="close">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
      <!-- 弹出编辑框 -->
    <el-dialog  :visible.sync="dialogFormVisible1" title="匹配结果">
           <div class="detail">是否启用公安系统查询匹配<i class="tip">(每次启用都会产生相应的费用
          <span style="font-size:16px;">（0.6元）</span>，老哥，请熟知~)</i></div>
        <el-radio-group style="margin-top:20px" v-model="checkChineseId">
          <el-radio :label="true">启用</el-radio>
          <el-radio :label="false">不启用</el-radio>
        </el-radio-group>
          <br>
          <el-button style="margin-top:20px" type="primary" @click="getfaceMatchAndPersonVerify">确定</el-button>
            <div class="detail"  style="font-size:16px" v-if="matchdata.scoreOfIdCardInPolice">
          实拍的人像和公安部的身份证号对应的照片的相似度得分:
          <span
           v-if="matchdata.scoreOfIdCardInPolice"
            style="font-size:20px;color:red"
          >{{matchdata.scoreOfIdCardInPolice}}分</span>
           <span v-else style="color:red;">{{matchdata.scoreOfIdCardInPolice}}分</span>
        </div>
          <div class="detail" style="font-size:16px">
          证件上的头像和实拍的人像相似度得分:
          <span
            v-if="matchdata.scoreOfFaceInCertMatchPhotoImg"
            style="color:red;font-size:20px"
          >{{matchdata.scoreOfFaceInCertMatchPhotoImg}}分</span>
          <span v-else style="color:red;">{{matchdata.scoreOfFaceInCertMatchPhotoImg}}分</span>
        </div>
    </el-dialog>
    <!-- 弹出编辑框结束 -->
  </div>
</template>

<script>
import {
  kycDetail,
  kycAudit,
  faceMatchAndPersonVerify,
  listAuditMessage,
  getSimilarFaceInFaceRepo
} from '@/api/casModule'
import 'viewerjs/dist/viewer.css'
import Viewer from 'v-viewer'
import Vue from 'vue'
Vue.use(Viewer)
export default {
  data() {
    return {
      detail: {
        auditRemark: '',
        kycAuditStatus: ''
      },
      kycAuditStatus: '',
      dialogFormVisible: false,
      dialogFormVisible1:false,
      facedata: '',
      list: [],
      list1: '',
      matchdata: {
        scoreOfFaceInCertMatchPhotoImg: 0,
        scoreOfIdCardInPolice: 0
      },
      checkChineseId: false,
      readonly: true,
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      rules: {
        nodeName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        nodeUrl: [
          { required: true, message: '请输入分类英文名', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {
    this.getkycDetail()
    this.getlistAuditMessage()
    console.log('xiaoli', this.facedata)
  },
  methods: {
    show() {
      const viewer = this.$el.querySelector('.images').$viewer
      viewer.show()
    },
    show1() {
      const viewer = this.$el.querySelector('.images1').$viewer
      viewer.show()
    },
    show2() {
      const viewer = this.$el.querySelector('.images2').$viewer
      viewer.show()
    },
    //获取配置
    async getlistAuditMessage() {
      try {
        let res = await listAuditMessage(this.queryList)
        if (res.code == 1000) {
          this.list = res.data.list
        } else {
          this.$message.error(res.message)
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    close() {
      this.dialogFormVisible = false
    },
    //点击查看
  async  look() {
     await this.getSimilarFace()
      this.dialogFormVisible = true
    },
    look1(){
       this.dialogFormVisible1 = true
    },
    //获取人脸匹配结果
    async getfaceMatchAndPersonVerify() {
      const params = {
        countryId: this.detail.countryId,
        faceImgToken: this.detail.faceImgToken,
        frontCertificateUrl: this.detail.frontCertificateUrl,
        name: this.detail.name,
        certificateNumber: this.detail.certificateNumber,
        checkChineseId: this.checkChineseId
      }
      try {
        let res = await faceMatchAndPersonVerify(params)
        if (res.code == 1000) {
          this.$message({
            message: `查询${res.message}`,
            type: 'success',
            center: true
          })
          this.matchdata.scoreOfFaceInCertMatchPhotoImg = res.data.scoreOfFaceInCertMatchPhotoImg.toFixed(
            0
          )
          this.matchdata.scoreOfIdCardInPolice = res.data.scoreOfIdCardInPolice.toFixed(
            0
          )
        } else {
          this.$message({
            message: `查询${res.message}`,
            type: 'error',
            center: true
          })
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    //获取相似人脸匹配结果
    async getSimilarFace() {
      this.dialogFormVisible = false
      const params = {
        id: this.detail.id
      }
      try {
        let res = await getSimilarFaceInFaceRepo(params)
        if (res.code == 1000) {
          this.facedata = res.data
          console.log('xiaozhan', this.facedata)
        } else {
          this.$message({
            message: res.message,
            type: 'error',
            center: true
          })
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    //获取用户详情
    async getkycDetail() {
      this.dialogFormVisible = false
      const params = {
        id: this.$route.query.id
      }
      try {
        let res = await kycDetail(params)

        if (res.code === 1000) {
          this.detail = res.data
          this.kycAuditStatus = res.data.kycAuditStatus
          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    //
    async setkycAudit() {
      if (this.matchdata.scoreOfFaceInCertMatchPhotoImg == 0) {
        this.$message.error('老哥，还要点击匹配后才能进行下一步哦~')
      } else if (this.facedata == '') {
         this.$message.error('老哥，先要查询去重后才能进行下一步哦~')
      } else if (this.list1 == '') {
        this.$message.error('老哥，一定要选择审核说明哦~')
      } else if (
        this.detail.kycAuditStatus == 1 ||
        this.detail.kycAuditStatus == 2
      ) {
        this.$message.error('老哥，选择审核状态后才能上传哦~')
      } else {
        let cfgValue = JSON.parse(this.list1)
        const params = {
          id: this.$route.query.id,
          uid: this.detail.uid,
          auditRemark: cfgValue.cn,
          auditRemarkEn: cfgValue.en,
          auditRemarkKo: cfgValue.ko,
          auditRemarkEs: cfgValue.es,
          kycAuditStatus: this.detail.kycAuditStatus
        }
        try {
          let res = await kycAudit(params)
          if (res.code == 1000) {
            this.$message({
              message: `操作${res.message}`,
              type: 'success'
            })
            this.$router.push({
              name: 'user-list',
              query: this.queryList
            })
          } else {
            this.$message.error(`操作${res.message}`)
          }
        } catch (error) {
          console.log('error: ', error)
        }
      }
    },
    // 提交
    submitForm() {
      this.setkycAudit()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-form {
  margin-top: 20px;
}
.el-input {
  width: 300px !important;
}
.idcardimg {
  display: flex;
  margin-bottom: 20px;
}
.images,
.images1 {
  width: 300px;
  height: 191px;
}
.images2 {
  max-width: 300px;
  height: 260px;
}
.el-icon-info {
  margin-left: 10px;
  color: red;
  margin-top: 20px;
}
img {
  max-width: 100%;
  max-height: 100%;
}
.tip {
  // display: inline-block;
  font-size: 12px;
  color: red;
  margin-top: 20px;
}
.title {
  display: inline-block;
  width: 180px;
  text-align: right;
  vertical-align: middle;
  padding: 0 12px 0 0;
  font-size: 14px;
  color: #606266;
  line-height: 40px;
  font-weight: 700;
}
.title1 {
  width: 160px;
}
.detail {
  vertical-align: middle;
  padding: 0 12px 0 0;
  font-size: 14px;
  color: #333333;
  font-weight: 700;
  margin-top: 20px;
}
.faceimg {
  width: 300px;
  height: 100%;
}
</style>

