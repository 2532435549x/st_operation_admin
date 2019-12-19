<!--
 * @Description: resRent -> detail
 * @Author: wangyun
 * @Date: 2019-11-08 10:50:08
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-11 10:58:06
 -->
<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.go(-1)" content="资源租赁列表"></el-page-header>
    </div>
    <div class="app-container-flex">
      <div class="filter-container container-flex container-flex1">
        <el-form>
          <el-form-item label="Id">{{ detailData.id }}</el-form-item>
          <el-form-item label="商品名称">{{ detailData.subject }}</el-form-item>

          <el-form-item label="商品金额">{{ detailData.price }}</el-form-item>

          <el-form-item label="购买用户">{{ detailData.account }}</el-form-item>

          <el-form-item label="支付类型">
            <el-tag :type="detailData.paymentType | typeFilter" effect="plain">
              <template v-if="detailData.paymentType == 2">支付宝</template>
              <template v-else-if="detailData.paymentType == 1">微信</template>
              <template v-else>未知</template>
            </el-tag>
          </el-form-item>

          <el-form-item label="订单状态">
            <el-tag
              :type="detailData.orderStatus | orderStatusTypeFilter"
            >{{ detailData.orderStatus | orderStatusFilter}}</el-tag>
          </el-form-item>

          <el-form-item label="下单时间">{{ detailData.createTime ? detailData.createTime : '暂无数据' }}</el-form-item>

          <el-form-item label="支付时间">{{ detailData.paymentTime ? detailData.paymentTime : '暂无数据'}}</el-form-item>
        </el-form>
      </div>

      <div class="other-container container-flex container-flex2">
        <el-collapse :accordion="accordion">
          <el-collapse-item title="订单附加数据" v-if="detailData.orderData">
            <el-form>
              <el-form-item label="所属链">
                <el-tag
                  :type="detailData.orderData.chainType | chainTypeFilter"
                  effect="plain"
                  size="small"
                >{{ detailData.orderData.chainType }}</el-tag>
              </el-form-item>
              <el-form-item label="接收资源账号">{{ detailData.orderData.receiveAccount }}</el-form-item>
              <el-form-item label="CPU资源租赁数量">{{ detailData.orderData.cpuAmount }}</el-form-item>
              <el-form-item label="CPU资源租赁时常">{{ detailData.orderData.cpuAvailableDays }}</el-form-item>
              <el-form-item label="NET资源租赁数量">{{ detailData.orderData.netAmount }}</el-form-item>
              <el-form-item label="NET资源租赁时常">{{ detailData.orderData.netAvailableDays }}</el-form-item>
              <el-form-item label="RAM资源租赁数量">{{ detailData.orderData.ramAmount }}</el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="链上信息" v-if="detailData.transaction">
            <el-form>
              <el-form-item label="交易ID">{{ detailData.transaction.trxId }}</el-form-item>
              <el-form-item label="orderId">{{ detailData.transaction.orderId }}</el-form-item>
              <el-form-item label="合约名称">{{ detailData.transaction.contractName }}</el-form-item>
              <el-form-item label="返回内容">{{ detailData.transaction.responseText }}</el-form-item>
              <el-form-item label="是否异常">
                <el-tag
                  :type="detailData.transaction.hasException ? 'danger' : 'success'"
                  size="small"
                >{{detailData.transaction.hasException ? '异常' : '正常'}}</el-tag>
              </el-form-item>
              <el-form-item label="是否成功">
                <el-tag
                  :type="detailData.transaction.success ? 'success' : 'danger'"
                  size="small"
                >{{detailData.transaction.success ? '成功' : '失败'}}</el-tag>
              </el-form-item>
              <el-form-item label="节点地址">{{detailData.transaction.nodeUrl}}</el-form-item>
              <el-form-item label="打包时间">{{ detailData.transaction.blockTime }}</el-form-item>
            </el-form>
          </el-collapse-item>
        </el-collapse>
      </div>

      <div>
        <h4 class="title-h4">手风琴模式</h4>
        <el-switch
          v-model="accordion"
          active-text="启用"
          inactive-text="关闭"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </div>
    </div>
  </div>
</template>

<script>
import { resRentOrderList, resRentOrderDetail } from '@/api/resourceRent/order'

export default {
  filters: {
    orderStatusFilter(val) {
      const orderStatusMaps = {
        1: '预支付订单',
        2: '支付成功',
        3: '业务处理成功',
        4: '支付失败',
        5: '业务处理失败'
      }
      return orderStatusMaps[val]
    },
    orderStatusTypeFilter(type) {
      let colorType = ''
      switch (type) {
        case 1:
          colorType = 'warning'
          break
        case 2:
          colorType = 'success'
          break
        case 3:
          colorType = 'success'
          break
        case 4:
          colorType = 'danger'
          break
        case 5:
          colorType = 'danger'
          break
        default:
          colorType = 'primary'
      }
      return colorType
    }
  },
  data() {
    return {
      detailData: {},
      accordion: false
    }
  },
  created() {
    if (this.$route.query.id) {
      resRentOrderDetail({ id: this.$route.query.id }).then(v => {
        this.detailData = v.data
        console.log('this.detailData: ', this.detailData)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.other-container {
  width: 40%;
  padding-right: 80px;
}
.container {
  &-flex {
    padding-left: 32px;
  }
  &-flex1 {
    flex: 0.35;
  }
  &-flex2 {
    flex: 0.45;
  }
}
</style>