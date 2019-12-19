<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-22 10:52:31
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container1">
    <el-form ref="question" :model="question" label-width="100px" class="demo-ruleForm">


      <el-form-item label="题目" required>
        <el-input v-model="question.question"/>
      </el-form-item>
      <el-form-item label="答案" required>
        <!-- <el-button @click="addguige('guige')">添加</el-button> -->
        <el-form-item v-for="(item, index) in question.questionAnswers" :key="index">
          <el-form-item>
            <el-input v-model="item.answer" size="small" style="margin:0; width:200px;" />
            <!-- <el-button size="small" @click.prevent="removeDomain(item)">删除</el-button> -->
          </el-form-item>
        </el-form-item>
      </el-form-item>

      <el-form-item label="正确答案" required>
        <el-select v-model="question.rightAnswer" placeholder="请选择" @change="change()">
          <el-option
            v-for="(item,index) in question.questionAnswers"
            :key="index"
            :value="item.answer">
          </el-option>
        </el-select>
<!--         <el-input v-model="question.rightAnswer" placeholder="请填入正确答案"/> -->
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { questionDetail , addQuestion , editQuestion} from '@/api/mindkingMoudle/index'
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
      question: {
        question: '',
        questionId: '',
        rightAnswer: '',
        rightAnswerId: '',
        questionAnswers: [
          {
            answer: '',
            answerId: ''
          },
          {
            answer: '',
            answerId: ''
          },
          {
            answer: '',
            answerId: ''
          },
          {
            answer: '',
            answerId: ''
          },
         ],
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
    change() {
      this.question.questionAnswers.map((item)=>{
        if(item.answer == this.question.rightAnswer){
          this.question.rightAnswerId = item.answerId
        }
      })
    },

    submitForm() {
      // let result = JSON.stringify(this.question)
      if(this.id){
        // console.log(JSON.stringify(this.question))
        editQuestion(this.question).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          // console.log(response.data)
        })
      }else{
        addQuestion(this.question).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      }
      this.$router.push({
        path: '/applications/mindking/question-bank'
      })
      // console.log(this.question)
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      questionDetail({ id: params }).then(response => {
        this.question.question = response.data[0].question
        this.question.questionId = response.data[0].questionId
        this.question.rightAnswer = response.data[0].rightAnswer
        this.question.rightAnswerId = response.data[0].rightAnswerId
        this.question.questionAnswers = response.data[0].errorAnswers
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

