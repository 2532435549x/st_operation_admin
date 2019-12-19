<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-19 17:05:50
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="queryList.s_LIKE_userUid"
        placeholder="请输入用户uid"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="queryList.s_LIKE_name"
        placeholder="请输入用户名"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="queryList.s_LIKE_visitIp"
        placeholder="请输入用户ip"
        style="width: 200px;"
        class="filter-item"
        clearable
      />
      <el-input
        v-model="queryList.s_LIKE_opsMessage"
        placeholder="请输入操作说明"
        style="width: 200px;"
        class="filter-item"
        clearable
      />

      <el-select v-model="queryList.s_EQ_operType" placeholder="请选择操作类型">
        <el-option label="全部" value />
        <el-option label="上传身份证" value="1" />
        <el-option label="上传活体实拍照片" value="2" />
      </el-select>
        <el-checkbox v-model="s_LIKE_enable">开启</el-checkbox>
      <el-select v-model="queryList.s_EQ_countryId" placeholder="请选择要查询的国家">
        <el-option label="全部" value />
        <el-option
          v-for="(item,index) in countryData"
          :key="index"
          :label="item.name"
          :value="item.sn"
        />
      </el-select>
      <el-date-picker
        v-model="queryList.s_BT_createTime_START"
        type="date"
        value-format="yyyy-MM-dd HH:mm:ss"
        placeholder="选择开开始日期"
      />

      <el-date-picker
        v-model="queryList.s_BT_createTime_END"
        type="date"
        placeholder="选择结束日期"
        value-format="yyyy-MM-dd HH:mm:ss"
      />

      <el-button class="filter-item" type="primary" @click="fetchData()">刷新</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>
      <!-- <el-table-column label="ID" align="center" width="100">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>-->
      <el-table-column label="用户Uid">
        <template slot-scope="scope">{{ scope.row.userUid}}</template>
      </el-table-column>
      <el-table-column label="用户名">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="ip">
        <template slot-scope="scope">{{ scope.row.visitIp }}</template>
      </el-table-column>
      <el-table-column label="操作说明" width="500">
        <template slot-scope="scope">{{ scope.row.opsMessage }}</template>
      </el-table-column>

      <el-table-column label="操作状态" align="center">
        <template slot-scope="scope">{{ scope.row.status==1 ?"成功":"失败" }}</template>
      </el-table-column>

      <el-table-column label="操作类型">
        <template slot-scope="scope">{{ scope.row.operType==1 ?"上传身份证":"上传活体实拍照片" }}</template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>
    </el-table>
    <div v-if="list.pages>1" class="pageQury">
      <div class="page">
        <el-pagination
          :total="list.total"
          :page-size="list.pageSize"
          background
          layout="prev, pager, next"
          @current-change="getPage"
        />
      </div>
      <div v-if="!list.total" class="list list1">暂无数据</div>
    </div>
  </div>
</template>

<script>
import { kyOperHistoryList, setCountry, getCountryList } from '@/api/casModule'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      countryData: [],
      options2: [
        {
          label: '开启',
          cities: [
          ]
        },
        {
          label: '未开启',
          cities: []
        }
      ],
      props: {
        value: 'label',
        children: 'cities'
      },
      queryLists: {
        pageNum: 1,
        pageSize: 240,
         s_LIKE_enable: 1,
      },
      s_LIKE_enable:true,
      title: '', // 弹出框标题；新增 --修改Nodes两种
      list: {
        isFirstPage: true, // s第一次默认没有上下页 数据加载完后根据数据的情况进行显示上下页
        isLastPage: true
      },
      listLoading: true,
      dialogTableVisible: false,
      dialogFormVisible: false,
      formLabelWidth: '120px',
      form: {
        ownStatus: '1'
      },
      keywordSearch: '',
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
      } // rr
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        this.fetchData()
      },
      deep: true
    },
    s_LIKE_enable: {
      handler(val, oldVal) {
       if(val==true){
          this.queryLists.s_LIKE_enable=1
          this.getCountryLists()
       }else if(val==false){
         this.queryLists.s_LIKE_enable=0
          this.getCountryLists()
       }
        console.log('新值', val)
        console.log('旧值', oldVal)
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
    this.getCountryLists()
  },
  methods: {
    //获取国家列表
    async getCountryLists() {
      try {
        let res = await getCountryList(this.queryLists)
        if (res.code === 1000) {
           this.countryData = res.data.list
            console.log("this.countryData",this.countryData)
        } else {
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },
    handleItemChange(val) {
      console.log('active item:', val)
      setTimeout(_ => {
        if (val.indexOf('开启') > -1 && !this.options2[0].cities.length) {
          this.queryLists.s_LIKE_enable = 1
          this.getCountryLists(val)
        } else if(val.indexOf('未开启') > -1 && !this.options2[1].cities.length){
          this.queryLists.s_LIKE_enable = 0
          this.getCountryLists(val)
        }
      }, 300)
    },
    // 获取列表
    fetchData(params = this.queryList) {
      this.listLoading = true
      kyOperHistoryList(params).then(response => {
        this.list = response.data
        console.log('this.list', this.list)
        this.listLoading = false
        this.dialogFormVisible = false
      })
    },
    // 关键词搜索
    keyWordSearch(keyword) {
      console.log(keyword)
      this.fetchData({ s_LIKE_categoryName: keyword })
    },
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) {
      // 分页加载
      this.queryList.pageNum = type
    }
  }
}
</script>
<style scoped>
.el-table {
  margin-top: 15px;
}
</style>

