<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-22 10:52:31
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container1">
    <el-form ref="form" :rules="rules" :model="deatil" label-width="100px" class="demo-ruleForm">
      <el-form-item label="需要积分" prop="useCoinsNum">
        <el-input v-model="deatil.useCoinsNum"/>
      </el-form-item>

      <el-form-item label="使用次数" prop="totalUse">
        <el-input v-model="deatil.totalUse"/>
      </el-form-item>

      <el-form-item label="奖品配置" required>
        <el-table
          :data="deatil.list"
          style="width: 100%"
          max-height="1000">

          <!--           <el-table-column
            prop="id"
            label="奖品id"
            width="80">
          </el-table-column> -->
          <el-table-column prop="message" label="奖品名称" width="120"/>
          <el-table-column prop="probability" label="中奖概率%">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.probability" size="small" type="number" style="margin:0 10px; width:100px;" />
            </template>
          </el-table-column>
          <el-table-column prop="rewardNum" label="单次中奖个数">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.rewardNum" size="small" type="number" style="margin:0 10px; width:100px;" />
            </template>
          </el-table-column>
          <el-table-column prop="rewardTotalNum" label="该奖品剩余个数(整数)">
            <template slot-scope="scope">
              <el-input v-model.number="scope.row.rewardTotalNum" size="small" type="number" style="margin:0 10px; width:100px;" />
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="deleteRow(scope.$index, deatil.list)">
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button v-if="deatil.list.length < 8" size="small" @click.native.prevent="addRow(deatil.list)">新增</el-button>

      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>

    <el-dialog :visible.sync="dialogPrizeVisible" title="选择题目">
      <prize :is-config="true" @choose="choose"/>
    </el-dialog>

  </div>
</template>

<script>
import { getConfigDetail, editConfig } from '@/api/turntableModule/index'
import prize from '../prize/index'
import { Promise, resolve } from 'q'
export default {
  components: {
    // VueUeditorWrap, sku
    prize
  },
  data() {
    return {
      deatil: {
        useCoinsNum: '',
        totalUse: '',
        list: []
      },
      dialogPrizeVisible: false,
      isSave: true,
      rules: {
        useCoinsNum: [
          { required: true, message: '请输入积分', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (value == 0) {
                return
              } else {
                if (!/^[1-9][0-9]*$/.test(value)) {
                  callback(new Error('请输入正整数'))
                } else {
                  callback()
                }
              }
            }
          }
        ],
        totalUse: [
          { required: true, message: '请输入使用次数', trigger: 'change' },
          {
            validator: (rule, value, callback) => {
              if (!/^[1-9][0-9]*$/.test(value)) {
                callback(new Error('请输入正整数'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },

  async created() {
    this.fetchData()
  },
  methods: {
    choose(options) {
      this.dialogPrizeVisible = false
      this.deatil.list.push({
        createTime: null,
        probability: '',
        id: '',
        message: options.message,
        prizeId: options.id,
        rewardNum: '',
        rewardTotalNum: '',
        version: 0
      })
    },
    verificateData() {
      var reg = new RegExp('^(100|(([1-9]){1}[0-9]?|0{1})((\.)([0-9]){1,2})?)$')
      this.deatil.list.map((item) => {
        if (!item.probability || (!item.rewardNum && item.rewardNum != 0) || (!item.rewardTotalNum && item.rewardTotalNum != 0)) {
          this.$message({
            type: 'fail',
            message: '奖品信息不完整'
          })
          this.isSave = false
        } else if (!reg.test(item.probability)) {
          this.$message({
            type: 'fail',
            message: '中奖概率必须为0~100的数'
          })
          this.isSave = false
        } else if (!/^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/.test(item.rewardNum)) {
          this.$message({
            type: 'fail',
            message: '单次中奖个数必须为正数'
          })
          this.isSave = false
        } else if (!/^\d+$/.test(item.rewardTotalNum)) {
          this.$message({
            type: 'fail',
            message: '奖品个数必须为正整数'
          })
          this.isSave = false
        }
      })

      let count = 0
      this.deatil.list.map((item) => {
        count += item.probability
      })
      console.log(count)
      if (count != 100) {
        this.$message({
          type: 'fail',
          message: '中奖概率和必须为100'
        })
        this.isSave = false
      }

      if (this.deatil.list.length != 8) {
        this.$message({
          type: 'fail',
          message: '奖品个数必须为8个'
        })
        this.isSave = false
      }
    },
    submitForm() {
      this.isSave = true
      this.verificateData()
      if (this.isSave) {
        editConfig(this.deatil).then(response => {
          if (response.code == 1000) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
          // console.log(response.data)
        })
      }
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    addRow(rows) {
      this.dialogPrizeVisible = true
    },
    // 获取详情
    fetchData() {
      this.listLoading = true
      getConfigDetail().then(response => {
        this.deatil = response.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}

.app-container1 .el-upload-list--picture .el-upload-list__item {
  height: auto;
  img {
    width: 300px !important;
    height: 170px !important;
  }
}
.app-container1-rows{
  display: flex;
}
</style>

