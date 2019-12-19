<!--
 * @Description: coin -> list
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditTime: 2019-12-02 16:54:48
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" class="demo-form-inline">
        <!-- <el-form-item class="tableInfo">
          <el-popover placement="right" width="600" trigger="hover">
            <div class="tableInfoBox">
              <img src="@/assets/img/info1.png" alt />
            </div>
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>-->
        <el-form-item>
          <el-popover
            placement="top-start"
            width="200"
            trigger="hover"
            content="如果出现图片丢失，是因为数据库在进行迁移,重新上传代币图标即可， 支持模糊搜索"
          >
            <i slot="reference" class="el-icon-info" />
          </el-popover>
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_symbol" placeholder="输入币种名称查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_contract" placeholder="输入合约地址查询" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
            <el-option :label="'开启/关闭'" :value="null" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
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
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      v-loading="listLoading"
      :data="listData.list"
      :height="fullHeight"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-form label-position="left" class="demo-table-expand">
            <el-form-item label="ID：">{{ scope.row.id }}</el-form-item>

            <el-form-item label="描述：">{{ scope.row.description }}</el-form-item>

            <el-form-item label="发行时间：">{{ scope.row.publishTime }}</el-form-item>
            <el-form-item label="创建时间：">{{ scope.row.createTime }}</el-form-item>
          </el-form>
        </template>
      </el-table-column>

      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column label="LOGO" align="center" width="80">
        <template slot-scope="scope">
          <img :src="scope.row.symbolIconPreview" alt width="50" height="50" />
        </template>
      </el-table-column>

      <el-table-column label="名称" align="center" min-width="120">
        <template slot-scope="scope">
          {{ scope.row.symbol }}
          <el-tag v-if="scope.row.isSelf" type="danger" size="small">ST</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="项目名称" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <span>{{ scope.row.projectName }}</span>
        </template>
      </el-table-column>

      <el-table-column label="合约地址" align="center" min-width="140" show-overflow-tooltip>
        <template slot-scope="scope">
          <a
            :href="'https://eospark.com/contract/'+scope.row.contract"
            target="_blank"
            style="text-decoration:underline;"
          >{{ scope.row.contract }}</a>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="120" align="center" sortable="sort">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
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
            v-if="scope.row.status==1"
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

      <el-table-column align="center" fixed="right" label="操作" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit', scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="formVisible('set',scope.row)">配置DApp</el-button>
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
import { setContextData, getContextData } from '@/utils/validate'
import {
  getCoinList,
  getCoinDetail,
  addCoin,
  editCoin,
  deleteCoin
} from '@/api/walletTolModule/coin'

export default {
  filters: {},
  data() {
    return {
      disableHide: false, // 隐藏禁用列表
      listData: {}, // 列表总数据
      listLoading: true,
      queryList: {
        pageNum: 1,
        pageSize: 20,
        s_LIKE_contract: '', // 根据合约地址查询
        s_LIKE_projectName: '', // 根据项目名称查询
        s_LIKE_symbol: '', // 根据币种名称查询
        s_LIKE_chainType: '', // 根据所属链查询
        s_LIKE_status: '', // 根据代币状态查询

        contract: '', // 合约名 （非必传）
        symbol: '', // 代币符号 （非必传）
        orderBy: '' // 排序
      }
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    },

    disableHide(val, oldVal) {
      this.queryList.status = val ? 1 : 0
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
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      } else {
        this.$message({
          message: '刷新失败！',
          type: 'error'
        })
      }
    },

    async fetchData() {
      this.listLoading = true
      try {
        let res = await getCoinList(this.queryList)
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
        `${state == 'disable' ? '关闭' : '开启'}启用后,前台${
          item.symbol
        }代币将${state == 'disable' ? '隐藏' : '显示'}，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let status = state == 'disable' ? 0 : 1
          getCoinDetail({ id: item.id }).then(v => {
            v.data.publishTime = this.formatTime(new Date(v.data.publishTime))
            v.data.createTime = this.formatTime(new Date(v.data.createTime))
            v.data.status = status
            editCoin(v.data).then(v => {
              this.$notify.success({
                title: '提示',
                message: '修改成功'
              })
              this.fetchData()
            })
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消修改'
          })
        })
    }, // stateExchange

    formVisible(style, item) {
      switch (style) {
        case 'add':
          this.$router.push({
            name: 'WalletTol-coin-add_edit',
            query: { style }
          })
          break
        case 'edit':
          this.$router.push({
            name: 'WalletTol-coin-add_edit',
            query: { style, id: item.id }
          })
          break
        case 'set':
          this.$router.push({
            name: 'WalletTol-coin-allocation',
            query: { ...item }
          })
          break
      }
    },

    delItem(item) {
      this.$confirm(
        `你正在删除 [${item.symbol}]，删除之后就没法找到了，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(_ => {
        const params = {
          id: item.id
        }
        deleteCoin(params).then(v => {
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
