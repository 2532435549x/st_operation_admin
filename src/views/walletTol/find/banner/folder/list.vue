<!--
 * @Description: find -> banner -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-11-20 18:55:26
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单处理 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item label>
          <el-input v-model="queryList.s_LIKE_title" clearable placeholder="输入标题查询" />
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
            <el-option :label="'开启/关闭'" :value="null" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_actionType" clearable placeholder="选择跳转方式">
            <el-option :label="'全部'" :value="null" />
            <el-option :label="'网页链接'" :value="'1'" />
            <el-option :label="'DAppId'" :value="'2'" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
      <!-- 表单处理 -->
    </div>

    <!-- 表格处理 -->
    <el-table
      v-loading="listLoading"
      :data="listData.list"
      element-loading-text="Loading"
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="描述">{{ row.description }}</el-form-item>
            <el-form-item label="描述(EN)">{{ row.descriptionEn }}</el-form-item>
            <el-form-item label="创建时间">{{ row.createTime }}</el-form-item>

            <el-form-item label="跳转方式：">
              <el-tag
                effect="dark"
                size="small"
                :type="row.actionType == 1 ? 'success' : 'primary' "
              >{{row.actionType == 1 ? "网页链接" : "DAppId"}}</el-tag>
            </el-form-item>

            <el-form-item>
              <el-divider content-position="left">
                <b>{{ row.actionType == 1 ? '跳转网站详情' : '跳转DApp详情'}}</b>
              </el-divider>
              <template v-if="row.actionType == 1">
                <el-form>
                  <el-form-item label="链接地址">
                    <a
                      class="activeLink"
                      :href="row.actionData"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ row.actionData }}</a>
                  </el-form-item>
                </el-form>
              </template>
              <template v-if="row.actionType == 2">
                <el-form>
                  <el-form-item label="Logo">
                    <img :src="row.actionDataDetail.logo" width="50" alt />
                  </el-form-item>

                  <el-form-item label="名字">{{ row.actionDataDetail.appName }}</el-form-item>

                  <el-form-item label="简介">{{ row.actionDataDetail.context }}</el-form-item>

                  <el-form-item label="描述">{{ row.actionDataDetail.description}}</el-form-item>

                  <el-form-item label="链接地址">
                    <a
                      class="activeLink"
                      :href="row.actionDataDetail.path"
                      target="_blank"
                      rel="noopener noreferrer"
                    >{{ row.actionDataDetail.path }}</a>
                  </el-form-item>
                </el-form>
              </template>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="标题" align="center" show-overflow-tooltip width="200">
        <template slot-scope="scope">{{ scope.row.title }}</template>
      </el-table-column>

      <el-table-column label="标题(EN)" align="center" show-overflow-tooltip width="200">
        <template slot-scope="scope">{{ scope.row.titleEn }}</template>
      </el-table-column>

      <el-table-column label="banner图片" align="center" min-width="200">
        <template slot-scope="scope">
          <img :src="scope.row.previewPath" alt width="150" />
        </template>
      </el-table-column>

      <el-table-column label="banner图片(EN)" align="center" min-width="200">
        <template slot-scope="scope">
          <img :src="scope.row.previewPathEn" alt width="150" />
        </template>
      </el-table-column>

      <el-table-column label="跳转方式" align="center" width="120">
        <template slot-scope="scope">
          <el-tag
            effect="dark"
            :type="scope.row.actionType == 1 ? 'success' : 'primary' "
          >{{scope.row.actionType == 1 ? "网页链接" : "DAppId"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="排序" align="center" sortable="sort" width="120">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="120">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='BOS'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" align="center" width="120">
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

      <el-table-column align="center" label="操作" fixed="right" width="240">
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
import { setContextData, getContextData } from '@/utils/validate'

import {
  getBannerList,
  addBanner,
  editBanner,
  deleteBanner
} from '@/api/findModule/banner'

export default {
  filters: {},
  data() {
    return {
      listLoading: true,
      listData: {}, // 列表总数据
      form: {}, // 验证数据表
      queryList: {
        pageNum: 1,
        pageSize: 10,
        s_LIKE_title: '',
        s_LIKE_titleEn: '',
        orderBy: ''
      }
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
  mounted() {},
  methods: {
    async refresh() {
      let res = await this.fetchData()
      res.result &&
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
    },

    async fetchData() {
      this.listLoading = true
      this.dialogFormVisible = false
      try {
        let res = await getBannerList(this.queryList)
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
        .then(_ => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editBanner(params).then(v => {
            this.$notify.success({
              title: '成功',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    }, // 修改状态

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/walletTol/find/banner/banner-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/find/banner/banner-add_edit',
            query: { style, ...item }
          })
          break
      }
    }, // 操作

    delItem(item) {
      this.$confirm(
        `你正在删除 [${item.title}]，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          deleteBanner({ id: item.id }).then(v => {
            if (v.code == 1000) {
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success'
              })
              this.fetchData()
            }
          })
        })
        .catch(e => {
          this.$notify.info({
            title: '提示',
            message: '已取消删除'
          })
        })
    }, // delItem

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scope>
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
</style>
