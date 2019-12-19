<!--
 * @Description: find -> dappCategory -> allocation
 * @Author: wangyun
 * @Date: 2019-08-21 17:37:21
 * @LastEditTime: 2019-11-22 09:55:29
 -->
<template>
  <div>
    <!-- 已选择的DApp列表 -->
    <div class="app-container">
      <el-form style="text-align: center">
        <img
          v-if="queryData.symbolIconPreview"
          :src="queryData.symbolIconPreview"
          :title="queryData.symbol"
          width="80"
        />
        <el-form-item>
          <el-tag size="mini" effect="plain">{{queryData.symbol}}</el-tag>
        </el-form-item>
      </el-form>

      <div class="filter-container" style="margin-top: 40px;">
        <el-form inline>
          <el-form-item>
            <el-tag>{{queryData.symbol}}代币关联下的DApp列表</el-tag>
          </el-form-item>
          <el-form-item>
            <el-badge :value="itemCheckedLength">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="checkedHandler"
              >保存DApp关联</el-button>
            </el-badge>
          </el-form-item>
        </el-form>
        <!-- <draggable v-model="checkedList"> -->
        <el-table
          ref="checkedTable"
          class="table-list"
          :data="checkedList"
          row-key="appId"
          max-height="800"
          border
          fit
          sortable
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>

          <el-table-column label="LOGO" align="center" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt width="80%" />
            </template>
          </el-table-column>

          <el-table-column label="DApp名称" align="center">
            <template slot-scope="scope">{{ scope.row.appName ||"暂无数据" }}</template>
          </el-table-column>

          <el-table-column label="开发者" align="center">
            <template slot-scope="scope">{{ scope.row.userName ||"暂无数据" }}</template>
          </el-table-column>

          <!-- <el-table-column label="排序" align="center" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.sort"
                type="number"
                min="0"
                step="1"
                placeholder="0(默认)"
                class="numInput"
                @blur="filterSortInput(scope.row)"
              />
            </template>
          </el-table-column>-->

          <el-table-column align="center" prop="created_at" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" @click="formVisible('remove',scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- </draggable> -->
      </div>
    </div>
    <!-- 已选择的DApp列表 -->

    <!-- 未选择的DApp列表 -->
    <div class="app-container">
      <div class="filter-container">
        <el-form inline class="demo-form-inline">
          <el-form-item>
            <el-badge :value="itemUnCheckedLength" :max="99" type="primary" class="item-badge">
              <el-tag type="danger">非{{queryData.symbol}}代币关联下的DApp列表</el-tag>
            </el-badge>
          </el-form-item>
          <el-form-item>
            <el-input class="search-input" v-model="search" placeholder="输入DApp名称搜索" />
          </el-form-item>
        </el-form>

        <el-table
          ref="uncheckedTable"
          :data="uncheckedList"
          max-height="800"
          border
          fit
          highlight-current-row
        >
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{ scope.$index + 1 }}</template>
          </el-table-column>

          <el-table-column label="LOGO" align="center" width="100">
            <template slot-scope="scope">
              <img :src="scope.row.logo" alt width="80%" />
            </template>
          </el-table-column>

          <el-table-column label="DApp名称" align="center">
            <template slot-scope="scope">{{ scope.row.appName ||"暂无数据" }}</template>
          </el-table-column>

          <el-table-column label="开发者" align="center">
            <template slot-scope="scope">{{ scope.row.userName ||"暂无数据" }}</template>
          </el-table-column>

          <!-- <el-table-column label="排序" align="center" width="100">
            <template slot-scope="scope">{{ scope.row.sort || 0 }}</template>
          </el-table-column>-->

          <el-table-column align="center" prop="created_at" label="操作" width="300">
            <template slot-scope="scope">
              <el-button type="primary" @click="formVisible('add',scope.row)">添加</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 未选择的DApp列表 -->
  </div>
</template>
<script>
import { getCoinDapp, saveCoinDapp } from '@/api/walletTolModule/coin'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      search: '', // 搜索关键词
      queryData: {},
      queryList: {
        pageNum: 1,
        pageSize: 10
      },

      title: {
        state: '',
        text: ''
      },

      id: '', // dappID 用于接口转发参数

      checkedList: [], // 属于Dapp分类下的dapp列表
      uncheckedList: [], // 不属于Dapp分类下的dapp列表

      TotalUncheckList: [], // 用于前端自定义模糊搜索的缓存数据

      rules: {
        sort: [{ required: true, message: '请填写排序' }]
      }
    }
  },
  computed: {
    itemCheckedLength() {
      return this.checkedList.length
    },
    itemUnCheckedLength() {
      return this.uncheckedList.length
    },
    itemTotalLength() {
      return this.checkedList.length + this.uncheckedList.length
    }
  },
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    },

    // 前端自定义模糊搜索
    search(val, oldVal) {
      this.uncheckedList = this.TotalUncheckList.filter(item => {
        if (!val) {
          return item
        } else {
          return item.appName.toLowerCase().includes(val.toLowerCase())
        }
      })
    }
  },
  created() {
    if (this.$route.query.id) {
      this.queryData = this.$route.query
      this.id = this.$route.query.id
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      try {
        let res = await getCoinDapp({ id: this.id })
        console.log('res: ', res)

        if (res) {
          this.checkedList = res.data.checked
          this.uncheckedList = res.data.unchecked

          this.TotalUncheckList = JSON.parse(JSON.stringify(this.uncheckedList)) // 深拷贝一份用于缓存

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        return { result: false, text: e }
      }
    },

    checkedHandler() {
      this.$confirm(
        `你正在进行【${this.queryData.symbol}】代币关联DApp操作？ 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(async () => {
          let params = {}
          let checkArr = []
          this.checkedList.forEach(item => {
            checkArr.push({
              dappId: item.appId,
              appName: item.appName,
              sort: item.sort
            })
          })
          params = Object.assign({}, { id: this.id, dapps: checkArr })
          try {
            let res = await saveCoinDapp(params)
            if (res.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功'
              })
              this.fetchData()
              // this.$router.go(-1)
            }
          } catch (e) {}
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '取消保存'
          })
        })
    },

    formVisible(style, payload) {
      switch (style) {
        case 'remove':
          this.checkedList = this.checkedList.filter(
            item => item.appId !== payload.appId
          )

          this.uncheckedList.unshift(payload)
          this.TotalUncheckList = JSON.parse(JSON.stringify(this.uncheckedList)) // 用于缓存
          break

        case 'add':
          // debugger
          if (this.itemCheckedLength === 1) {
            this.$message.warning('按照需求, 一个代币只能关联一个dapp')
            break
          }

          this.spliceFun(this.uncheckedList, payload, 'appId')
          this.spliceFun(this.TotalUncheckList, payload, 'appId') // 缓存数据也做一次清除

          this.checkedList.push(payload)

          break
      }
    },

    filterSortInput(v) {
      const Rex = /^([0-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
      if (v.sort == '' || !v.sort) {
        return this.$message.warning('排序不能为空')
      }
    },

    /**
     * @method: spliceFun
     * @param {arr, data, prop}
     * @return: none(responsive)
     */

    spliceFun(arr, data, prop) {
      arr.forEach((v, i) => {
        v[prop] == data[prop] && arr.splice(i, 1)
      })
    }
  }
}
</script>


<style lang="scss">
.search-input {
  margin-left: 20px;
}
.item-badge {
  .is-fixed {
    top: 5px;
    right: 12px;
  }
}
.sortable-ghost {
  opacity: 0.8;
  color: #fff !important;
  background: #00796b !important;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none !important;
}
.numInput {
  input[type="number"] {
    -moz-appearance: textfield;
    text-align: center;
  }
}
</style>