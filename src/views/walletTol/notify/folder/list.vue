<!--
 * @Description: notify -> list
 * @Author: wangyun
 * @Date: 2019-08-12 17:12:23
 * @LastEditTime: 2019-11-21 18:10:23
 -->

<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-popover placement="top-start" width="200" trigger="hover" content="支持模糊搜索,箭头向下展开详情">
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.title" placeholder="标题查询" clearable />
        </el-form-item>

        <el-form-item label>
          <el-input v-model="queryList.titleEn" placeholder="标题(EN)查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.device" clearable placeholder="选择设备">
            <el-option
              v-for="(item, index) in deviceOptions"
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
    </div>

    <!-- 表格处理 -->
    <el-table
      :data="listData.list"
      :maxHeight="fullHeight"
      border
      fit
      highlight-current-row
      @sort-change="changeTableSort"
    >
      <el-table-column width="50" type="expand">
        <template slot-scope="{row}">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item v-if="row.extendType" label="跳转DAppId：">{{ row.extendType }}</el-form-item>

            <el-form-item label="通知标题：">{{ row.title }}</el-form-item>

            <el-form-item label="通知描述：">{{ row.description }}</el-form-item>

            <el-form-item label="通知标题(EN)：">{{ row.titleEn }}</el-form-item>

            <el-form-item label="通知描述(EN)：">{{ row.descriptionEn }}</el-form-item>

            <el-form-item label="创建时间：">{{ row.createTime }}</el-form-item>

            <el-form-item v-if="row.extendData">
              <el-divider content-position="left">
                <b>跳转DApp的详情</b>
              </el-divider>
              <el-form>
                <el-form-item label="logo">
                  <img :src="row.extendData.data.logo" width="40" alt />
                </el-form-item>

                <el-form-item label="名字">{{row.extendData.data.appName}}</el-form-item>

                <el-form-item label="简介">{{row.extendData.data.context}}</el-form-item>

                <el-form-item label="描述">{{row.extendData.data.description}}</el-form-item>

                <el-form-item label="链接地址">
                  <a
                    class="activeLink"
                    :href="row.extendData.data.path"
                    target="_blank"
                    rel="noopener noreferrer"
                  >{{ row.extendData.data.path }}</a>
                </el-form-item>
              </el-form>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="通知标题" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{ scope.row.title ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="通知标题(EN)" show-overflow-tooltip align="center">
        <template slot-scope="scope">{{ scope.row.titleEn ||"暂无数据" }}</template>
      </el-table-column>

      <el-table-column label="过期时间" sortable="custom" align="center" width="200">
        <template slot-scope="scope">{{ scope.row.expireTime }}</template>
      </el-table-column>

      <el-table-column label="设备" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-tag :type="scope.row.device | typeFilter">{{scope.row.device | deviceFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="100" align="center" fixed="right">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已启用，点击可停用"
            icon="el-icon-check"
            circle
            size="mini"
            @click="stateExchange(scope.row,'disable')"
          />
          <el-button
            v-else
            type="danger"
            title="已停用，点击可启用"
            icon="el-icon-close"
            circle
            size="mini"
            @click="stateExchange(scope.row,'open')"
          />
        </template>
      </el-table-column>

      <el-table-column label="通知内容" width="140" align="center" fixed="right">
        <template slot-scope="scope">
          <el-popover placement="left" width="800" trigger="click">
            <div class="contentPop" v-html="scope.row.content"></div>
            <el-button slot="reference" type="text" icon="el-icon-circle-plus-outline">预览</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="通知内容(EN)" width="140" align="center" fixed="right">
        <template slot-scope="scope">
          <el-popover placement="left" width="800" trigger="click">
            <div class="contentPop" v-html="scope.row.contentEn"></div>
            <el-button slot="reference" type="text" icon="el-icon-circle-plus-outline">预览</el-button>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem('delete',scope.row)">删除</el-button>
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
  getDappNotifyList,
  addDappNotify,
  editDappNotify,
  deleteDappNotify
} from '@/api/AppNotifyModule'

export default {
  filters: {
    deviceFilter(status) {
      const deviceMaps = {
        '0': '全部',
        '1': 'IOS',
        '2': 'Android'
      }
      return deviceMaps[status]
    },
    typeFilter(status) {
      const typeMaps = {
        '0': 'paimary',
        '1': 'success',
        '2': 'danger'
      }
      return typeMaps[status]
    }
  },
  data() {
    return {
      listData: {},
      queryList: {
        pageNum: 1,
        pageSize: 10,
        orderBy: '' // 排序方式
      },
      dialogFormVisible: false,
      deviceOptions: [
        { label: '全部', value: 0 },
        { label: 'IOS', value: 1 },
        { label: 'Android', value: 2 }
      ]
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
      res.result &&
        this.$message({
          message: `刷新成功！`,
          type: 'success'
        })
    },

    async fetchData() {
      this.dialogFormVisible = false
      try {
        let res = await getDappNotifyList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

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
            path: '/walletTol/notify/notify-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/notify/notify-add_edit',
            query: { style, ...item }
          })
          break
      }
    }, // 操作

    delItem(form, rest) {
      this.$confirm(`【${rest.title}】将被删除，老哥谨慎操作哦！`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(action => {
          if (action === 'confirm') {
            deleteDappNotify(rest).then(v => {
              v.code === 1000 && this.fetchData()
              this.$notify.success('删除成功')
            })
          }
        })
        .catch(() => {
          this.$notify.info('取消删除')
          console.log('取消删除')
        })
    },

    stateExchange(item, state) {
      this.$confirm(
        `【${state == 'disable' ? '停用' : '启用'}】后,前台将【${
          state == 'disable' ? '隐藏' : '显示'
        }】该条公告，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          item.status = state == 'disable' ? false : true
          editDappNotify({ ...item }).then(v => {
            console.log('v: ', v)
            this.$notify.success({
              title: '提示',
              message: '修改成功'
            })
            this.fetchData()
          })
        })
        .catch(e => {
          console.log('e: ', e)
        })
    }, // stateExchange

    changeTableSort(item) {
      // 改变排序
      console.log(item)
      let a = ''
      switch (item.order) {
        case 'ascending':
          a = 'expireTime DESC'
          break
        case 'descending':
          a = 'expireTime ASC'
          break
        default:
          a = ''
      }
      this.queryList.orderBy = a
    }, // changeTableSort

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style scope>
.contentPop {
  padding: 20px;
  width: 100%;
  max-height: 600px;
  overflow: auto;
}
.el-tooltip__popper {
  max-width: 50%;
  line-height: 30px;
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
.conJump:hover {
  text-decoration: underline;
  color: #409eff;
}
</style>
