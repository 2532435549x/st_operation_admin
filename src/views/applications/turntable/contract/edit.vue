<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-08-22 10:52:31
 * @LastEditors: 熊成强
 -->

<template>
  <div class="app-container1">
    <el-form ref="contract" :model="contract" label-width="100px" class="demo-ruleForm">
      <el-form-item label="链类型" required>
        <el-input :disabled="true" v-model="contract.chainType"/>
      </el-form-item>
      <el-form-item label="代币名称" required>
        <el-input v-model="contract.symbol"/>
      </el-form-item>
      <el-form-item label="合约账户" required>
        <el-input v-model="contract.contract"/>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm()">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getContractDetail , addContract , editContract} from '@/api/turntableModule/index'
import { Promise, resolve } from 'q'
export default {
  components: {
    // VueUeditorWrap, sku
  },
  data() {
    return {
      // id: '',
      contract: {
        id: '',
        chainType: 'EOS',
        symbol: '',
        contract: ''
      },
    }

  },
  computed: {
    id() {
      return this.$route.query.id
    }
  },

  async created() {
    if(this.id)this.fetchData()
  },
  methods: {

    submitForm() {
      if(this.id){
        editContract(this.contract).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '修改成功'
            })
          }
        })
      }else{
        addContract(this.contract).then(response => {
          if(response.code == 1000){
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }
        })
      }
      this.$router.push({
        path: '/applications/turntable/contract'
      })
    },
    // 获取详情
    fetchData(params = this.id) {
      this.listLoading = true
      getContractDetail({ id: params }).then(response => {
        console.log(response)
        this.contract.id = response.data.id
        // this.contract.chainType = response.data.chainType
        this.contract.symbol = response.data.symbol
        this.contract.contract = response.data.contract
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

