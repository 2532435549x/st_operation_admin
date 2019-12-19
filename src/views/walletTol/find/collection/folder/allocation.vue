<!--
 * @Description: find -> collection -> allocation
 * @Author: wangyun
 * @Date: 2019-08-21 17:37:21
 * @LastEditTime: 2019-11-09 14:22:11
 -->
<template>
  <div>
    <!-- 已选择的DApp列表 -->
    <div class="app-container">
      <el-form style="text-align: center">
        <el-form-item>
          <img
            :src="queryData.previewPath"
            v-if="queryData.previewPath"
            :title="queryData.name"
            width="150"
          />
        </el-form-item>
        <el-form-item>
          <el-tag size="medium" effect="plain">{{queryData.name}}</el-tag>
        </el-form-item>
      </el-form>

      <div class="filter-container" style="margin-top: 40px;">
        <el-form inline>
          <el-form-item>
            <el-tag>{{queryData.name}}下的DApp列表</el-tag>
          </el-form-item>
          <el-form-item>
            <el-badge :value="itemCheckedLength" v-if="itemCheckedLength>=1">
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="checkedHandler"
              >保存DApp关联</el-button>
            </el-badge>
          </el-form-item>
        </el-form>

        <el-table
          ref="checkedTable"
          class="table-list"
          v-loading="listLoading"
          :data="checkedList"
          row-key="appId"
          element-loading-text="Loading"
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

          <el-table-column label="排序" align="center" width="100">
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
              <!-- <el-input>
                {{ itemCheckedLength - scope.$index || 0 }}
              </el-input>-->
            </template>
          </el-table-column>

          <el-table-column align="center" prop="created_at" label="操作" width="400">
            <template slot-scope="scope">
              <el-button type="primary" @click="formVisible('remove',scope.row)">移除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 已选择的DApp列表 -->

    <!-- 未选择的DApp列表 -->
    <div class="app-container">
      <div class="filter-container">
        <el-form inline class="demo-form-inline">
          <el-form-item>
            <el-badge :value="itemUnCheckedLength" :max="99" type="primary" class="item-badge">
              <el-tag type="danger">非{{queryData.name}}下的DApp列表</el-tag>
            </el-badge>
          </el-form-item>
          <el-form-item>
            <el-input v-model="search" placeholder="输入DApp名称搜索" />
          </el-form-item>
        </el-form>

        <el-table
          ref="uncheckedTable"
          v-loading="listLoading"
          :data="uncheckedList"
          element-loading-text="Loading"
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

          <el-table-column label="排序" align="center" width="100">
            <template slot-scope="scope">{{ scope.row.sort || 0 }}</template>
          </el-table-column>

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
// import Sortable from 'sortablejs'
import {
  saveCollectionDapp,
  getCollectionDapp
} from '@/api/findModule/collection'
import { getDappList } from '@/api/findModule/dapp'
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      search: '',
      queryData: {},
      listLoading: false,
      dialogFormVisible: false,
      queryList: {
        pageNum: 1,
        pageSize: 10
      },
      title: {
        state: '',
        text: ''
      },
      collectionId: '', // 合集ID 用于接口转发参数
      checkedList: [], // 属于Dapp分类下的dapp列表
      uncheckedList: [], // 不属于Dapp分类下的dapp列表
      TotalUncheckList: [], // 用于前端自定义模糊搜索的缓存数据

      tempList: [],
      multipleSelection: [],
      rules: {
        sort: [{ required: true, message: '请填写分类排序', trigger: 'blur' }]
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

    search(val, oldVal) {
      this.uncheckedList = this.TotalUncheckList.filter(item => {
        if (!val) {
          return item
        } else {
          return item.appName.toLowerCase().includes(val.toLowerCase())
        }
      })
    } // 前端自定义模糊搜索
  },
  created() {
    if (this.$route.query) {
      console.log('this.$route.query: ', this.$route.query)
      this.queryData = this.$route.query
      this.collectionId = this.$route.query.id
    }
    if (this.collectionId) {
      this.fetchData()
    }
  },
  methods: {
    async fetchData() {
      this.listLoading = true
      try {
        let collectionId = this.collectionId
        let res = await getCollectionDapp({ collectionId })
        console.log('res: ', res)
        this.listLoading = false

        if (res.code === 1000) {
          this.checkedList = res.data.checked
          this.uncheckedList = res.data.unchecked

          this.TotalUncheckList = JSON.parse(JSON.stringify(this.uncheckedList)) // 深拷贝一份用于缓存

          // this.$nextTick(() => {
          //   this.initSort()
          // })

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    },

    // initSort() {
    //   const el = this.$refs.checkedTable.$el.querySelectorAll(
    //     '.el-table__body-wrapper > table > tbody'
    //   )[0]
    //   this.sortable = Sortable.create(el, {
    //     ghostClass: 'sortable-ghost',
    //     // handle: ".drag-item", // 指定推拽列
    //     setData: function(dataTransfer) {
    //       // to avoid Firefox bug
    //       dataTransfer.setData('Text', '')
    //     },
    //     onEnd: evt => {
    //       this.$nextTick(() => {
    //         let targetRow = this.checkedList.splice(evt.oldIndex, 1)[0]
    //         this.checkedList.splice(evt.newIndex, 0, targetRow)
    //       })
    //     }
    //   })
    // },

    checkedHandler() {
      if (this.itemCheckedLength === 0) {
        setTimeout(() => {
          this.$message({
            message: '至少选一个嘛，老兄',
            type: 'warning'
          })
        }, 200)
        return
      }

      this.$confirm(
        `确定保存这${this.itemCheckedLength}个DApp到【${this.queryData.name}】, 小老弟确定了么？ 是否继续？`,
        '提示',
        {
          confirmButtonText: '确定了',
          cancelButtonText: '再想想',
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
          params = Object.assign(
            {},
            { collectionId: this.collectionId, dapps: checkArr }
          )
          console.log('params: ', params)
          try {
            let res = await saveCollectionDapp(params)
            if (res.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '保存成功'
              })
              this.fetchData()
            }
          } catch (e) {
            console.log('e: ', e)
          }
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '取消保存'
          })
        })
    },

    formVisible(style, payload) {
      console.log('payload.appId: ', payload.appId)
      switch (style) {
        case 'remove':
          this.checkedList = this.checkedList.filter(
            item => item.appId !== payload.appId
          )

          this.uncheckedList.unshift(payload)
          this.TotalUncheckList = JSON.parse(JSON.stringify(this.uncheckedList)) // 用于缓存
          break

        case 'add':
          this.spliceFun(this.uncheckedList, payload, 'appId')
          this.spliceFun(this.TotalUncheckList, payload, 'appId') // 缓存数据也做一次清除

          this.checkedList.push(payload)
          break
      }
    },

    filterSortInput(v) {
      const Rex = /^([0-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
      if (!Rex.test(v.sort)) {
        this.$message.warning('不能输入小于0的数')
        this.checkedList = this.checkedList.map(item => {
          item.appId == v.appId && (item.sort = 0)
          return item
        })
      }
    }, // 排序输入判断（未完善，需要优化）

    /**
     * @method: spliceFun
     * @param {arr, data, prop}
     * @return: none(responsive)
     */

    spliceFun(arr, data, prop) {
      arr.forEach((v, i) => {
        v[prop] == data[prop] && arr.splice(i, 1)
      })
    },

    handleCurrentChange(currentPage) {
      this.queryList.pageNum = currentPage
    } // 页码改变触发事件
  }
}
</script>

<style lang="scss">
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
  input[type='number'] {
    -moz-appearance: textfield;
    text-align: center;
  }
}
</style>