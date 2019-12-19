<!--
 * @Description: walletUpdate -> list
 * @Author: wangyun
 * @Date: 2019-09-09 11:07:48
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-26 11:25:40
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

        <el-form-item label="所属设备">
          <el-dropdown @command="handleCommandDevice" split-button>
            {{queryList.s_EQ_device | deviceTxtFilter}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in deviceOption"
                :key="index"
                :command="item.value"
                :disabled="queryList.s_EQ_device == item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item label="版本类型">
          <el-dropdown @command="handleCommandType" split-button>
            {{queryList.s_EQ_type | typeTxtFilter}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in typeOption"
                :key="index"
                :command="item.value"
                :disabled="queryList.s_EQ_type == item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-form-item>

        <el-form-item label="打包版本">
          <el-dropdown @command="handleCommandBuildType" split-button>
            {{queryList.s_EQ_buildType | buildTypeTxtFilter}}
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(item,index) in buildTypeOption"
                :key="index"
                :command="item.value"
                :disabled="queryList.s_EQ_buildType == item.value"
              >{{item.label}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
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
      :max-height="fullHeight"
      border
      fit
      highlight-current-row
    >
      <!-- 拓展 -->
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand" style="padding-right: 200px;">
            <el-form-item label="id">{{ scope.row.id }}</el-form-item>
            <el-form-item label="版本升级描述">{{ scope.row.content }}</el-form-item>

            <el-form-item label="内部版本详细说明">{{ scope.row.buildContent }}</el-form-item>

            <el-form-item label="升级文件地址">{{ scope.row.fileUrl }}</el-form-item>

            <el-form-item label="创建时间">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <!-- 拓展 -->`

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (queryList.pageNum - 1) * queryList.pageSize }}</template>
      </el-table-column>

      <el-table-column label="所属设备" align="center" width="110">
        <template slot-scope="{row}">
          <el-tag :type="row.device | typeFilter" effect="plain">{{row.device | deviceTxtFilter}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="版本类型" align="center" width="120">
        <template slot-scope="{row}">{{row.type | typeTxtFilter}}</template>
      </el-table-column>

      <el-table-column label="外部版本号" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.majorVersion }}</template>
      </el-table-column>

      <el-table-column label="内部版本号" align="center" min-width="120">
        <template slot-scope="scope">{{ scope.row.buildVersion }}</template>
      </el-table-column>

      <el-table-column label="打包版本" align="center" width="120">
        <template slot-scope="scope">{{ scope.row.buildType | buildTypeTxtFilter }}</template>
      </el-table-column>

      <!-- <el-table-column label="内部版本详细说明" min-width="180">
        <template slot-scope="scope">{{ scope.row.buildContent }}</template>
      </el-table-column>

      <el-table-column label="版本升级描述" min-width="180">
        <template slot-scope="scope">{{ scope.row.content }}</template>
      </el-table-column> -->

      <el-table-column label="是否强制升级" align="center" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.forced ? '是' : '否'" placement="top">
            <el-switch
              v-model="scope.row.forced"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="behaviorHandler(scope.row, 'forced')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="是否通过审核" align="center" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.auditResult ? '是' : '否'" placement="top">
            <el-switch
              v-model="scope.row.auditResult"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="behaviorHandler(scope.row, 'auditResult')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="是否有效" align="center" width="120">
        <template slot-scope="scope">
          <el-tooltip :content="scope.row.status ? '是' : '否'" placement="top">
            <el-switch
              v-model="scope.row.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="behaviorHandler(scope.row, 'status')"
            ></el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="created_at" label="操作" fixed="right" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" size="mini" @click="deleteKeywords('delete',scope.row)">删除</el-button>
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
import {
  getAppList,
  getAppVersionDetail,
  deleteAppVersion,
  saveAppVersion
} from '@/api/AppVersionModule'

export default {
  filters: {
    deviceTxtFilter(val) {
      const deviceMaps = {
        null: '默认',
        1: 'IOS',
        2: 'Android'
      }
      return deviceMaps[val]
    },

    typeTxtFilter(val) {
      const typeMaps = {
        null: '默认',
        1: '测试版本',
        2: '正式版/企业版',
        3: '商店版',
        4: 'TestFly版'
      }
      return typeMaps[val]
    },

    buildTypeTxtFilter(val) {
      const buildTypeMaps = {
        null: '默认',
        1: 'D版本',
        2: 'B版本',
        3: 'R版本'
      }
      return buildTypeMaps[val]
    }
  },
  data() {
    return {
      queryList: {
        pageNum: 1,
        pageSize: 10,
        s_EQ_device: null,
        s_EQ_type: null,
        s_EQ_buildType: null
      },
      listData: {},
      deviceOption: [
        { label: '默认', value: null },
        { label: 'IOS', value: 1 },
        { label: 'Android', value: 2 }
      ],
      typeOption: [
        { label: '默认', value: null },
        { label: '测试版本', value: 1 },
        { label: '正式版/企业版', value: 2 },
        { label: '商店版', value: 3 },
        { label: 'TestFly版', value: 4 }
      ],
      buildTypeOption: [
        { label: '默认', value: null },
        { label: 'D版本', value: 1 },
        { label: 'B版本', value: 2 },
        { label: 'R版本', value: 3 }
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
    this.queryList.pageNum = this.$_getContextData('xxx-pageNum') || 1
    this.queryList.pageNum == 1 && this.fetchData()
  },
  methods: {
    async refresh() {
      this.queryList.s_EQ_device = null
      this.queryList.s_EQ_type = null
      this.queryList.s_EQ_buildType = null
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
        let res = await getAppList(this.queryList)
        this.listData = res.data

        return { result: true, text: 'success' }
      } catch (e) {
        console.log('e: ', e)
        return { result: false, text: e }
      }
    },

    handleCommandDevice(command) {
      this.queryList.s_EQ_device = command
    },

    handleCommandType(command) {
      this.queryList.s_EQ_type = command
    },

    handleCommandBuildType(command) {
      this.queryList.s_EQ_buildType = command
    },

    async behaviorHandler(item, type) {
      try {
        // let params = JSON.parse(JSON.stringify(item))
        // params[type] = item[type] ? 1 : 0
        await saveAppVersion(item)
        this.$notify.success('修改成功')
      } catch (e) {
        console.log('e: ', e)
        setTimeout(() => {
          this.$notify.warning('修改失败')
          this.fetchData()
        }, 500)
      }
    }, // 操作集合

    formVisible(style, item) {
      // this.dialogFormVisible = ['add', 'edit'].includes(state)
      switch (style) {
        case 'add':
          this.$router.push({
            path: '/walletUpdate/walletUpdate-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            path: '/walletUpdate/walletUpdate-add_edit',
            query: { style, id: item.id }
          })
          break
      }
    }, // FormVisible

    deleteKeywords(form, rest) {
      console.log(form, rest)
      this.$confirm(`此版本将被删除，老哥谨慎操作哦！`, '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(action => {
          if (action === 'confirm') {
            deleteAppVersion({ id: rest.id }).then(v => {
              v.code === 1000 && this.fetchData()
            })
          }
        })
        .catch(() => {
          console.log('取消删除')
        })
    },

    handleCurrentChange(currentPage) {
      this.$_setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>