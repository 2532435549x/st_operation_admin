<template>
  <div class="app-container" v-if="pageData">

    <div class="btnBox">
      <router-link class="inlineBlock" :to="{path:'/find/addArticle',query:{id:pageData.id}}" >
        <el-button type="primary">编辑</el-button>
      </router-link>
      <el-button type="danger" @click="delTweet(pageData.id)">删除</el-button>
    </div>

    <div class="mainBox">

     
      <el-row>
        <el-col :span="5">
          <div><img class="bannerUrl" :src="pageData.bannerUrl" alt="" srcset=""></div>
        </el-col>
        <el-col :span="19" class="titleBox">
           <div class="h1">{{pageData.title}}</div>
          <div class="h2">{{pageData.subtitle}}</div>
          <div class="h3">{{pageData.description}}</div>
          <span v-if="pageData.tweetLanguageList.length">
            <hr>
            <div class="h1">{{pageData.tweetLanguageList[0].title}}</div>
            <div class="h2">{{pageData.tweetLanguageList[0].subtitle}}</div>
            <div class="h3">{{pageData.tweetLanguageList[0].description}}</div>
          </span>
          <hr>
          <div class="date">{{pageData.createTime}}创建</div>
          <hr>
          <div class="tagDiv">
            <el-tag  type="danger" v-if="pageData.top">已置顶</el-tag>
            <el-tag  v-if="pageData.tweetLanguageList.length">支持英文</el-tag>
            <el-tag v-if="pageData.type==1">图片封面</el-tag>
            <el-tag type="success" v-if="pageData.type==2">滚动封面</el-tag>
            <el-tag type="warning" v-if="pageData.type==3">列表封面</el-tag>
            <el-tag type="danger">{{pageData.chainTypes}}</el-tag>
          </div>
          <hr>
        </el-col>
      </el-row>

      <div style="height:50px;"></div>


      <div class="htmlContent_box">
        <div class="htmlBox" v-html="pageData.content"></div>
      </div>

      <div class="htmlContent_box" v-if="pageData.tweetLanguageList.length">
        <div class="htmlBox" v-html="pageData.tweetLanguageList[0].content"></div>
      </div>

    </div>
    <!-- mainBox -->

    <div class="dappBox">
      <div class="title">关联dapp</div>
      <el-table
        :data="pageData.tweetAppList"
        style="width: 100%">

        <el-table-column
          prop="appId"
          label="id"
          width="100px">
        </el-table-column>

        <el-table-column
          prop="appName"
          label="名称">
        </el-table-column>

        <el-table-column
          label="图标"
          width="180px">
          <template slot-scope="scope">
            <img :src="scope.row.logo" alt="" srcset="" class="appLogo">
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          label="描述">
        </el-table-column>

        <el-table-column
          prop="chainTypes"
          label="支持链">
        </el-table-column>

        <el-table-column
          prop="sort"
          label="排序"
          width="50px">
        </el-table-column>

        <el-table-column align="center" prop="created_at" label="操作" width="230">
        <template slot-scope="scope">
          <router-link class="inlineBlock" :to="{path:'/find/articleDetail',query:{id:scope.row.id}}" >
            <el-button type="primary" size="small">查看详情</el-button>
          </router-link>
        </template>
      </el-table-column>

      </el-table>
    </div>
    <!-- dappBox -->
    
    <div class="space100"></div>

  </div>
</template>

<script>
import { getTweetDetail,deleteTweet } from '@/api/find'

export default {
  data() {
    return {
      pageData:null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    delTweet(id){//删除文章
      let params = {id:id}
      this.$confirm(`你正在删除 [${this.pageData.title}]，删除之后就没法找到了，小老弟谨慎操作哦！`,'FBI WARNING', 
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(_ => {

            deleteTweet(params).then(v=>{
            console.log(v)
            this.$message.success(v.message);
            setTimeout(() => {
              this.$router.go(-1);
            }, 1000);
          })//deleteTweet
          
      })//confirm
    }//delTweet
  },
  created(){
    let params = {
      id:this.$route.query.id
    }
    getTweetDetail(params).then(v=>{
      console.log(v)
      this.pageData = v.data;
    })//getTweetDetail
  }
}
</script>
<style scoped>
  .mainBox{
    margin-bottom: 20px;
  }
  .h1{
    font-size: 20px;
    font-weight: bold;
  }
  .h2{
    font-size: 15px;
    font-weight: bold;
  }
  .h3{
    color: gray;
  }
  .titleBox>div{
    margin: 15px 0;
  }
  .date{
    color: grey;
  }
  .dappBox{
    border: 1px solid gainsboro;
  }
  .htmlContent_box{
    width: 400px;
    background: url(../../assets/img/iphone_x.png) no-repeat;
    background-size:100%;
    height: 800px;
    padding: 40px 30px;
    padding-top: 60px;
    display: inline-block;
    margin-right: 50px !important;
  }
  .htmlContent_box .htmlBox{
    height: 700px;
    border-radius: 20px;
    overflow-y: auto;
  }
  .dappBox{
    padding: 20px;
  }
  .dappBox .title{
    font-size: 23px;
    font-weight: bold;
  }
  .dappBox .appLogo{
    width: 60px;
    height: 60px;
  }
  .bannerUrl{
    width: 300px;
    height: 300px;
    display: block;
    background: rgba(0,0,0,0.04);
  }
  .btnBox{
    text-align: right;
    top:80px;
    right: 50px;
    background:white;
  }
</style>
