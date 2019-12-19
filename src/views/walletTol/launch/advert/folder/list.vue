<!--
 * @Description: find -> banner -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-10-23 10:33:45
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- 表单查询 -->
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="支持模糊搜索，支持联动查询，类型不选择时以默认方式进行查询，箭头向下展开详情"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_type" clearable placeholder="选择广告类型">
            <el-option :label="'图片'" :value="1" />
            <el-option :label="'视频'" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_pathType" clearable placeholder="选择跳转类型">
            <el-option :label="'H5'" :value="1" />
            <el-option :label="'原生'" :value="2" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_allowSkip" clearable placeholder="选择跳过状态">
            <el-option :label="'允许'" :value="1" />
            <el-option :label="'禁止'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
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
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="id：">{{ scope.row.id }}</el-form-item>

            <el-form-item label="跳转地址：">
              <a
                class="conJump"
                :href="scope.row.path"
                target="_blank"
                rel="noopener noreferrer"
              >{{ scope.row.path }}</a>
            </el-form-item>

            <el-form-item label="资源文件(HASH)值：">{{ scope.row.resourceHash }}</el-form-item>

            <el-form-item label="资源文件英文(HASH)值：">{{ scope.row.resourceEnHash }}</el-form-item>

            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="启动页广告" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.resourcePreviewPath" alt width="150" />
        </template>
      </el-table-column>

      <el-table-column label="启动页广告(英文版)" align="center">
        <template slot-scope="scope">
          <img :src="scope.row.resourceEnPreviewPath" alt width="150" />
        </template>
      </el-table-column>

      <el-table-column label="显示时长(s)" sortable="duration" align="center">
        <template slot-scope="scope">{{scope.row.duration}}</template>
      </el-table-column>

      <el-table-column label="当日几次后不再显示" sortable="silent" align="center">
        <template slot-scope="scope">{{scope.row.silent}}</template>
      </el-table-column>

      <el-table-column label="过期时间" align="center">
        <template slot-scope="scope">{{scope.row.expireTime}}</template>
      </el-table-column>

      <el-table-column label="跳转类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.pathType | typesFilter">{{ row.pathType === 1 ? 'H5' : '原生' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="广告类型" align="center" width="120">
        <template slot-scope="{row}">
          <el-tag :type="row.type | typesFilter">{{ row.type === 1 ? '图片' : '视频' }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否允许跳过" align="center" width="120">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.allowSkip"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="switchHandler(scope.row, 'allowSkip')"
          ></el-switch>
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
  getAdvertList,
  addAdvert,
  editAdvert,
  deleteAdvert
} from '@/api/walletTolModule/launch'

export default {
  filters: {
    typesFilter(type) {
      const typeMaps = {
        1: 'primary',
        2: 'success'
      }
      return typeMaps[type]
    }
  },
  data() {
    return {
      listData: {}, // 列表总数据
      form: {}, // 验证数据表
      queryList: {
        pageNum: 1,
        pageSize: 20,
        orderBy: ''
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
  mounted() {},
  methods: {
    switchHandler(item, type) {
      let params = JSON.parse(JSON.stringify(item))
      params[type] = item[type] == true ? 1 : 0
      editAdvert(params)
        .then(v => {
          v.code === 1000 && this.$notify.success('修改成功')
          this.fetchData()
        })
        .catch(e => {
          this.$notify.error('修改失败')
        })
    },

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
        let res = await getAdvertList(this.queryList)
        this.listData = res.data
        console.log('this.listData: ', this.listData)

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)

        return { result: false, text: e }
      }
    }, // fetchData

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/walletTol/launch/advert/advert-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletTol/launch/advert/advert-add_edit',
            query: { style, ...item }
          })
          break
      }
    }, // 操作

    delItem(item) {
      this.$confirm(
        `你正在删除该广告，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(_ => {
          deleteAdvert({ id: item.id }).then(v => {
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

    changeTableSort(payload) {
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = `${payload.column.sortable} DESC`
          break
        case 'descending':
          rule = `${payload.column.sortable} ASC`
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
.pageQury {
  text-align: right;
  margin: 30px 0;
}
</style>
