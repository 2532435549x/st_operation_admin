<!--
 * @Description: find -> recommend -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-15 09:30:55
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_title" placeholder="请输入标题" clearable />
        </el-form-item>
        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_titleEn" placeholder="请输入英文标题" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="null" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
            <el-option :label="'开启/关闭'" :value="''" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      v-loading="listLoading"
      :data="listData.list"
      :max-height="fullHeight"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="ID：">{{ scope.row.id }}</el-form-item>
            <el-form-item label="描述：">{{ scope.row.descriptionEn }}</el-form-item>
            <el-form-item label="描述(EN)：">{{ scope.row.descriptionEn }}</el-form-item>

            <el-form-item label="网页链接地址：" v-if="scope.row.actionType == '1'">
              <a
                class="conJump"
                :href="scope.row.actionData"
                target="_blank"
                rel="noopener noreferrer"
              >{{ scope.row.actionData }}</a>
            </el-form-item>
            <el-form-item
              label="DAppId："
              v-if="scope.row.actionType == '2'"
            >{{ scope.row.actionData }}</el-form-item>

            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="标题" show-overflow-tooltip min-width="140" align="center">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="标题(EN)" show-overflow-tooltip min-width="140" align="center">
        <template slot-scope="scope">{{ scope.row.titleEn }}</template>
      </el-table-column>

      <el-table-column label="精品推荐图片" align="center" min-width="140px">
        <template slot-scope="scope">
          <img :src="scope.row.previewPath" alt width="100" />
        </template>
      </el-table-column>

      <el-table-column label="精品推荐图片(EN)" align="center" min-width="140px">
        <template slot-scope="scope">
          <img :src="scope.row.previewPathEn" alt width="100" />
        </template>
      </el-table-column>

      <el-table-column label="所属链" width="120" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='ETH'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已开启，点击可关闭"
            icon="el-icon-check"
            circle
            size="mini"
            @click="stateExchange(scope.row,'disable')"
          />
          <el-button
            v-else
            type="danger"
            title="已关闭，点击可开启"
            icon="el-icon-close"
            circle
            size="mini"
            @click="stateExchange(scope.row,'open')"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="240">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit', scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        :total="listData.total"
        :page-size="listData.pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="queryList.pageNum"
        v-if="listData.total !=0"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { setContextData, getContextData } from '@/utils/validate'

import {
  getRecommendList,
  addRecommend,
  editRecommend,
  deleteRecommend
} from '@/api/findModule/recommend'

export default {
  filters: {},
  data() {
    return {
      listLoading: true,
      listData: {},
      queryList: {
        pageNum: 1,
        pageSize: 20,
      },
      coinsOptions: [{ label: '禁用', value: 0 }, { label: '启用', value: 1 }]
    }
  },
  computed: {},
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },

    async fetchData() {
      this.listLoading = true
      this.dialogFormVisible = false
      try {
        let res = await getRecommendList(this.queryList)
        this.listLoading = false

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    }, // fetchData

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/walletTol/find/recommend/recommend-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/find/recommend/recommend-add_edit',
            query: { style, ...item }
          })
          break
      }
    },

    stateExchange(item, state) {
      this.$confirm(
        `${state == 'disable' ? '关闭' : '开启'}启用后,前台【${item.title}】将${
          state == 'disable' ? '隐藏' : '显示'
        }，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editRecommend(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改状态成功'
            })
            this.fetchData()
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    },

    delItem(item) {
      this.$confirm(
        `你正在删除 [${item.title}]，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        deleteRecommend({ id: item.id }).then(v => {
          if (v.code == 1000) {
            this.$notify({
              title: '提示',
              message: '删除成功',
              type: 'success'
            })
            this.fetchData()
          }
        })
      })
    }, // delItem

    changeTableSort(payload) {
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = 'sort DESC'
          break
        case 'descending':
          rule = 'sort ASC'
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
    }, // 排序

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
.conJump:hover {
  text-decoration: underline;
  color: #409eff;
}
.icon img {
  width: 20px;
  height: 20px;
  opacity: 0.7;
  vertical-align: middle;
  cursor: pointer;
}
.icon.type2 img {
  opacity: 0.2;
}
.description {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>
