<!--
 * @Description: news
 * @Author: wangyun
 * @LastEditTime: 2019-11-21 11:22:38
 -->
<template>
  <div class="news-container">
    <new-post class="panel"></new-post>
    <new-comment class="panel"></new-comment>
  </div>
</template>
<script>
import NewPost from './components/NewPost'
import NewComment from './components/NewComment'
export default {
  components: {
    NewPost,
    NewComment
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss">
// $-black: rgba(0, 0, 0, 0.7);
// $-white: rgba(255, 255, 255, 0.9);

// .panel {
//   .panel-page {
//     .el-pagination.is-background .el-pager li:not(.disabled):hover {
//       color: $-white;
//       background: $-black;
//     }
//     .el-pagination.is-background .el-pager li:not(.disabled).active {
//       background-color: rgba(0, 0, 0, 0.7);
//     }
//   }
// }
</style>

<style lang="scss" scoped>
.news-container {
  min-height: calc(100vh - 50px);
  padding: 40px 20px;
  background: #f5f5f5;
}
.panel {
  &:first-child {
    margin-bottom: 60px;
  }
}
</style>