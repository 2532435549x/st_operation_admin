<!--
 * @Description: resourceGroup -> list
 * @Author: wangyun
 * @Date: 2019-09-09 11:07:48
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-13 17:05:59
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单处理 -->
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="下方表格点击箭头 向下展示详情">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_name" placeholder="输入名称查询" clearable />
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
          <el-select v-model="queryList.s_LIKE_type" clearable placeholder="选择租赁类型">
            <el-option :label="'全部'" :value="null" />
            <el-option
              v-for="(item, index) in rentTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
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
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="ID">{{ scope.row.id }}</el-form-item>
            <el-form-item label="名称">{{ scope.row.name }}</el-form-item>
            <el-form-item label="描述">{{ scope.row.description }}</el-form-item>

            <el-form-item label="英文名称">{{ scope.row.nameEn }}</el-form-item>
            <el-form-item label="英文描述">{{ scope.row.descriptionEn }}</el-form-item>
            <el-form-item label="创建时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="名称" align="center" min-width="180">
        <template slot-scope="scope">{{ scope.row.name }}</template>
      </el-table-column>

      <el-table-column label="支付金额" align="center" min-width="180">
        <template slot-scope="scope">{{ scope.row.price }}</template>
      </el-table-column>

      <el-table-column label="租赁可用天数" sortable="available_days" align="center" width="160">
        <template slot-scope="scope">{{ scope.row.availableDays }}</template>
      </el-table-column>

      <el-table-column label="租赁EOS数量" sortable="amount" align="center" width="160">
        <template slot-scope="scope">{{ scope.row.amount }}</template>
      </el-table-column>

      <el-table-column label="租赁项类型" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typeFilter" effect="plain">
            {{row.type == 1 ? 'CPU' : '' }}
            {{row.type == 2 ? 'NET' : '' }}
            {{row.type == 3 ? 'RAM' : '' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="所属链" align="center" width="140">
        <template slot-scope="{row}">
          <el-tag :type="row.chainType | chainTypeFilter">{{ row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否有效" align="center" width="140">
        <template slot-scope="scope">
          <el-button
            :type="scope.row.status ? 'success' : 'danger'"
            :title="scope.row.status ? '是' : '否'"
            :icon="scope.row.status ? 'el-icon-check' : 'el-icon-close'"
            circle
            size="mini"
          />
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="140">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="formVisible('edit',scope.row)">编辑</el-button>
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
        :hide-on-single-page="true"
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
import {
  getResourceItemList,
  getResourceItemDetail,
  addResourceItem,
  editResourceItem
} from '@/api/resourceRent/items'

export default {
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
      },
      listData: {}
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
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
      this.dialogFormVisible = false
      try {
        let res = await getResourceItemList(this.queryList)
        this.listData = res.data

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)
        return { result: false, text: e }
      }
    },

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/resourceRent/items/items-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/resourceRent/items/items-add_edit',
            query: { style, id: item.id }
          })
          break
      }
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // 翻页处理
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  cursor: auto;
}
</style>