<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-22 10:52:31
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container1">
    <el-form ref="prizeDetail" :model="prizeDetail" label-width="100px" class="demo-ruleForm">
      <el-form-item label="奖品名称" required>
        <el-input v-model="prizeDetail.message"/>
      </el-form-item>

      <el-form-item label="奖品类型" required>
        <el-select v-model="prizeDetail.status" placeholder="请选择">
          <el-option :value="0" label="代币"/>
          <el-option :value="1" label="积分"/>
          <el-option :value="2" label="实物"/>
        </el-select>
        <!-- <el-input v-model="prizeDetail.status"/> -->
      </el-form-item>

      <el-form-item v-if="prizeDetail.status == 0" label="奖品币种" required>
        <el-select v-model="prizeDetail.type" placeholder="请选择">
          <el-option v-for="(item,index) in typeList" :key="index" :label="item" :value="item"/>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPrizeDetail, addPrize, editPrize, getContractList } from '@/api/turntableModule/index'
// import { Promise, resolve } from 'q'
export default {
  components: {
    // VueUeditorWrap, sku
  },
  data() {
    return {
      // id: '',
      prizeDetail: {
        id: '',
        message: '',
        status: '',
        type: ''
      },
      typeList: []
    }
  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },
  watch: {
    'prizeDetail.status': {
      handler(val, oldVal) {
        if (val == 1 || val == 2) {
          this.prizeDetail.type = ''
        }
      }
    }
  },

  async created() {
    if (this.id) this.fetchData()
    this.getTypeList()
  },
  methods: {

    submitForm() {
      if (this.id) {
        editPrize(this.prizeDetail).then(response => {
          if (response.code == 1000) {
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      } else {
        addPrize(this.prizeDetail).then(response => {
          if (response.code == 1000) {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      }
      this.$router.push({
        path: '/applications/turntable/prize'
      })
    },

    async getTypeList() {
      const response = await getContractList()
      response.data.map((item) => {
        this.typeList.push(item.symbol)
      })
      // console.log(this.typeList)
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      getPrizeDetail({ id: params }).then(response => {
        console.log(response)
        this.prizeDetail.id = response.data.id
        this.prizeDetail.message = response.data.message
        this.prizeDetail.status = response.data.status
        this.prizeDetail.type = response.data.type
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
</style>

