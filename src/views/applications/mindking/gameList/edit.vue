<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-22 10:52:31
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container1">
    <el-form ref="deatil" :model="deatil" label-width="100px" class="demo-ruleForm">
      <el-form-item label="游戏币种" required>
        <el-radio v-model="deatil.coinId" :label="10000002">AC</el-radio>
        <el-radio v-model="deatil.coinId" :label="10000001">EOS</el-radio>
      </el-form-item>

      <el-form-item label="游戏名" required>
        <el-input v-model="deatil.name"/>
      </el-form-item>
      <el-form-item label="游戏描述" required>
        <el-input v-model="deatil.description"/>
      </el-form-item>
      <el-form-item label="奖池数量" required>
        <el-input v-model="deatil.rewardPool"/>
      </el-form-item>
      <el-form-item label="题目数量" required>
        <el-input v-model="deatil.questionNum"/>
      </el-form-item>
      <el-form-item label="每题回答时间" required>
        <el-input v-model="deatil.answerTime"/>
      </el-form-item>
      <el-form-item label="奖励勋章数" required>
        <el-input v-model="deatil.rewardTicket"/>
      </el-form-item>
      <el-form-item label="报名费用" required>
        <el-input v-model="deatil.signupCost"/>
      </el-form-item>

      <el-form-item label="报名类型" required>
        <el-radio v-model="deatil.signupType" :label="0">无需报名</el-radio>
        <el-radio v-model="deatil.signupType" :label="1">扣除勋章报名</el-radio>
      </el-form-item>

      <el-form-item label="开始时间" required>
        <el-date-picker
          v-model="deatil.startTime"
          type="datetime"
          placeholder="选择日期时间">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="排序" required>
        <el-input v-model="deatil.sort"/>
      </el-form-item>

      

      <el-form-item>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { gameDetail , addGame , editGame} from '@/api/mindkingMoudle/index'
// import VueUeditorWrap from 'vue-ueditor-wrap'
// import sku from './compoments/sku'
// import { getCoteryDilt, getCotery } from '@/utils/validate'
import { Promise, resolve } from 'q'
export default {
  components: {
    // VueUeditorWrap, sku
  },
  data() {
    return {
      deatil: {

      },
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },

  async created() {
    if(this.id)this.fetchData()
  },
  methods: {
    // change() {
    //   this.question.questionAnswers.map((item)=>{
    //     if(item.answer == this.question.rightAnswer){
    //       this.question.rightAnswerId = item.answerId
    //     }
    //   })
    // },

    submitForm() {
      // let result = JSON.stringify(this.question)
      if(this.id){
        // console.log(JSON.stringify(this.question))
        editGame(this.deatil).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          // console.log(response.data)
        })
      }else{
        addGame(this.deatil).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      }
      this.$router.push({
        path: '/applications/mindking/game-list'
      })
      // console.log(this.question)
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      gameDetail({ id: params }).then(response => {
        this.deatil = response.data
        // console.log(response)
      })
    }
  }
}
</script>
// https://starteos-app.oss-cn-shenzhen.aliyuncs.com/EOSMall/goodsDetail/video/nT1cqWk7YZynEXk9rAPH0ubeMmz59aIC"
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.app-container1 .el-upload-list--picture .el-upload-list__item {
  height: auto;
  img {
    width: 300px !important;
    height: 170px !important;
  }
}
</style>

