<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>
          <el-form-item width="80">
          <el-select  v-model="queryList.isChina" placeholder="是否为中国">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'中国'" :value="1" />
            <el-option :label="'外国'" :value="0" />
          </el-select>
        </el-form-item>
            <el-form-item width="80">
          <el-select  v-model="queryList.s_EQ_kycAuditStatus" placeholder="审核状态">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'只上传了证件，实拍未上传'" :value="1" />
            <el-option :label="'证件实拍都已上传'" :value="2" />
            <el-option :label="'审核通过'" :value="3" />
               <el-option :label="'审核失败'" :value="4" />
          </el-select>
        </el-form-item>
              <el-form-item width="80">
          <el-select  v-model="queryList.s_EQ_certificateType" placeholder="证件类型">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'身份证'" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_certificateNumber" placeholder="输入证件号码搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_uid" placeholder="输入uid搜索" clearable />
        </el-form-item>
          <el-form-item>
          <el-input v-model="queryList.s_LIKE_name" placeholder="输入用户姓名搜索" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单查询 -->
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="uid" align="center" width="130">
        <template slot-scope="scope">{{ scope.row.uid }}</template>
      </el-table-column>
        <el-table-column label="昵称" align="center" width="130">
        <template slot-scope="scope">{{ scope.row.userNick }}</template>
      </el-table-column>
      <el-table-column label="姓名" align="center" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>
        <el-table-column label="登录号" align="center" min-width="130" show-overflow-tooltip>
        <template  slot-scope="scope">{{ scope.row.userMobile||scope.row.userEmail }}</template>
          <!-- <template v-if="scope.row.userEmail" slot-scope="scope">{{ scope.row.userEmail }}</template> -->
      </el-table-column>
       <el-table-column label="国家名" align="center" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.countryName }}</template>
      </el-table-column>

      <el-table-column label="国家名(英文)" align="center" min-width="130" show-overflow-tooltip>
        <template slot-scope="scope">{{ scope.row.countryNameEn }}</template>
      </el-table-column>

      <el-table-column label="证件类型" align="center" min-width="130">
        <template slot-scope="scope" v-if="scope.row.certificateType==1">身份证</template>
      </el-table-column>
       <el-table-column label="证件号" align="center" min-width="150">
        <template slot-scope="scope">{{ scope.row.certificateNumber }}</template>
      </el-table-column>
         <el-table-column label="审核状态" align="center" min-width="130">
           <template slot-scope="scope">
               <span v-if="scope.row.kycAuditStatus==1">实拍未上传</span>
              <span style="color:red" v-if="scope.row.kycAuditStatus==2">待审核(证件实拍都已上传)</span> 
              <span v-if="scope.row.kycAuditStatus==3">审核成功</span> 
              <span v-if="scope.row.kycAuditStatus==4">审核失败</span>    
              </template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
      <el-table-column label="更新时间" sortable="create_time" align="center" width="180">
        <template slot-scope="scope">{{ scope.row.updateTime }}</template>
      </el-table-column>

      <el-table-column fixed="right" label="操作" align="center" width="180">
        <template slot-scope="scope">
           <el-button type="primary" size="small"  @click="toDetail(scope.row.id)">信息详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
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
import { kycInfoList } from '@/api/casModule'

export default {
  data() {
    return {
      listData: {}, // 列表总数据
      tt: '',
      queryList: {
        pageNum: 1,
        pageSize: 10,
        // orderBy:'id DESC'
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.getkycInfoList()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    // this.fetchData()
  },
  mounted() {
    this.getkycInfoList()
  },
  methods: {
    async refresh() {
      let res = await this.getkycInfoList()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },
    //获取用户信息列表
      async getkycInfoList() {
      this.dialogFormVisible = false
      try {
        let res = await kycInfoList(this.queryList)

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: xl', this.listData)
          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
   //去详情
    toDetail( id) {
      console.log('id: ', id)
      const params = {
        id
      }
      this.$router.push({
        name: 'listdetail',
        query: params
      })
    },

    stateExchange(item, state) {
      this.$confirm(
        `你正在${state == 'open' ? '开启' : '关闭'}该应用，是否继续？`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          let enable = state == 'disable' ? false : true
          let params = Object.assign({}, { id:item.id }, { enable })
          setCountry(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '操作成功'
            })
            this.getkycInfoList()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消操作'
          })
        })
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // hCC
  }
}
</script>
<style lang="scss" scope>
</style>
