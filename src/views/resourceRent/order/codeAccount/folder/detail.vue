<!--
 * @Description: In User Settings Edit
 * @Author: wangyun
 * @Date: 2019-11-09 18:30:47
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-20 15:47:07
 -->
<!--
 * @Description: resRent -> detail
 * @Author: wangyun
 * @Date: 2019-11-08 10:50:08
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-11 10:56:35
 -->
<template>
  <div class="app-container">
    <div class="page-header">
      <el-page-header @back="$router.go(-1)" content="账户注册邀请码列表"></el-page-header>
    </div>
    <div class="app-container-flex">
      <div class="filter-container container-flex container-flex1">
        <el-form>
          <el-form-item label="Id">{{ detailData.id }}</el-form-item>

          <el-form-item label="订单编号">{{ detailData.orderCode }}</el-form-item>

          <el-form-item label="商品名称">{{ detailData.subject }}</el-form-item>

          <el-form-item label="商品金额">{{ detailData.price }}</el-form-item>

          <el-form-item label="购买用户">{{ detailData.account }}</el-form-item>

          <el-form-item label="支付金额">{{ detailData.paymentPrice}}</el-form-item>

          <el-form-item label="支付类型">
            <el-tag :type="detailData.paymentType | typeFilter" effect="plain">
              <template v-if="detailData.paymentType == 2">支付宝</template>
              <template v-else-if="detailData.paymentType == 1 ">微信</template>
              <template v-else>未知</template>
            </el-tag>
          </el-form-item>

          <el-form-item label="订单状态">
            <el-tag
              :type="detailData.orderStatus | orderStatusTypeFilter"
            >{{ detailData.orderStatus | orderStatusFilter}}</el-tag>
          </el-form-item>

          <el-form-item label="下单时间">{{ detailData.createTime ? detailData.createTime : '暂无数据' }}</el-form-item>

          <el-form-item label="支付时间">{{ detailData.paymentTime ? detailData.paymentTime : '暂无数据' }}</el-form-item>
        </el-form>
      </div>

      <div class="other-container container-flex container-flex2">
        <el-collapse :accordion="accordion">
          <el-collapse-item title="邀请码详情" v-if="detailData.inviteCode">
            <el-form>
              <el-form-item label="邀请码">{{ detailData.inviteCode.inviteCode }}</el-form-item>

              <el-form-item label="使用状态">
                <el-tag
                  :type="detailData.inviteCode.status == 1 ? 'warning' : 'primary'"
                  size="small"
                >{{detailData.inviteCode.status == 1 ? '未使用' : '已使用'}}</el-tag>
              </el-form-item>

              <el-form-item label="类型">
                <el-tag
                  :type="detailData.inviteCode.type | typeFilter"
                  size="small"
                  effect="plain"
                >{{ detailData.inviteCode.type | typeStatusFilter}}</el-tag>
              </el-form-item>

              <el-form-item label="使用账号">{{ detailData.inviteCode.account }}</el-form-item>
              <el-form-item label="使用数据">{{ detailData.inviteCode.useData }}</el-form-item>
              <el-form-item label="使用时间">{{detailData.inviteCode.useTime}}</el-form-item>

              <el-form-item label="邀请码创建时间">{{ detailData.inviteCode.createTime }}</el-form-item>
              <el-form-item label="过期时间">{{ detailData.inviteCode.expireTime }}</el-form-item>
              <el-form-item label="邀请码发送状态">
                <el-tag
                  :type="detailData.inviteCode.sendStatus | typeFilter"
                  effect="plain"
                  size="small"
                >{{ detailData.inviteCode.sendStatus | sendStatusFilter}}</el-tag>
              </el-form-item>

              <el-form-item label="邀请码发送信息">{{ detailData.inviteCode.sendToUserInfo }}</el-form-item>
            </el-form>
          </el-collapse-item>

          <el-collapse-item title="订单拓展数据" v-if="detailData.orderData">
            <el-form>
              <el-form-item label="所属链">
                <el-tag
                  :type="detailData.orderData.chainType | chainTypeFilter"
                  effect="plain"
                  size="small"
                >{{ detailData.orderData.chainType }}</el-tag>
              </el-form-item>
              <el-form-item label="购买用户">{{ detailData.orderData.account }}</el-form-item>
              <el-form-item label="语言">{{ detailData.orderData.language }}</el-form-item>
              <el-form-item label="接收邀请码手机号">{{ detailData.orderData.phoneNumber }}</el-form-item>
              <el-form-item label="接收邀请码邮箱">{{ detailData.orderData.userEmail }}</el-form-item>
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
import { codeAccountOrderDetail } from '@/api/resourceRent/order'

export default {
  filters: {
    // 订单类型对应颜色
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
    },

    // 订单状态
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

    // 发送状态
    sendStatusFilter(val) {
      const sendStatusMaps = {
        0: '手机和邮件均未发送成功',
        1: '仅手机短信发送成功',
        2: '仅邮件发送成功',
        3: '手机短信和邮件均发送成功'
      }
      return sendStatusMaps[val]
    },

    // 注册状态
    typeStatusFilter(val) {
      const typeStatusMaps = {
        1: '通用注册类型',
        2: '仅EOS账号注册',
        3: '仅BOS账号注册',
        4: '仅MEETONE账号注册'
      }
      return typeStatusMaps[val]
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
      codeAccountOrderDetail({ id: this.$route.query.id }).then(v => {
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