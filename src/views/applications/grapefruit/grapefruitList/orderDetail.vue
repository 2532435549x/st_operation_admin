<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-27 11:41:48
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container">
    <el-form v-if="list" label-width="100px" class="demo-ruleForm">
      <el-form-item label="商品详情">
        <el-form
          v-for="i in list.goodsProductList"
          :key="i.id"
          label-width="100px"
          label-position="left"
          class="demo-conetnt"
        >
          <el-form-item label="商品id">{{ i.id }}</el-form-item>
          <el-form-item label="商品名字">{{ i.goodsName }}</el-form-item>
          <el-form-item label="是否支持积分支付">{{ i.isBonusUsed?"是":"否" }}</el-form-item>
          <el-form-item label="积分数">{{ i.bonusNum }}</el-form-item>
          <el-form-item label="积分对应价格">{{ i.bonusPrice }}</el-form-item>
          <el-form-item label="商品创建时间">{{ i.createTime }}</el-form-item>
          <el-form-item label="商品更新时间">{{ i.updateTime }}</el-form-item>
          <el-form-item label="商品图片">
            <img :src="i.picUrl" alt style="width:150px;" >
          </el-form-item>
          <el-form-item label="商品数量">{{ i.number }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="订单详情">
        <el-form label-width="100px" label-position="left" class="demo-conetnt">
          <el-form-item label="收货人名字">{{ list.orderDetail.consignee }}</el-form-item>
          <el-form-item label="收货手机号">{{ list.orderDetail.mobile }}</el-form-item>
          <el-form-item label="收货地址">{{ list.orderDetail.address || "无" }}</el-form-item>
          <el-form-item label="邮编">{{ list.orderDetail.postalCode || "无" }}</el-form-item>
          <el-form-item label="订单备注">{{ list.orderDetail.message|| "无" }}</el-form-item>
          <el-form-item label="运费">{{ list.orderDetail.freightPrice || 0 }}</el-form-item>
          <el-form-item label="订单价格">{{ list.orderDetail.paymentPrice || "无" }}</el-form-item>
          <el-form-item label="订单状态">
            <template>
              <span v-if="list.orderDetail.orderServiceStatus ==101">订单生成，未支付</span>
              <span v-if="list.orderDetail.orderServiceStatus ==102">下单未支付，用户取消</span>
              <span v-if="list.orderDetail.orderServiceStatus ==103">下单未支付超期,系统自动取消</span>
              <span v-if="list.orderDetail.orderServiceStatus ==201">支付完成，商家未发货</span>
              <span v-if="list.orderDetail.orderServiceStatus ==202">订单生产，已付款未发货，用户申请退款</span>
              <span v-if="list.orderDetail.orderServiceStatus ==203">管理员执行退款操作，确认退款成功</span>
              <span v-if="list.orderDetail.orderServiceStatus ==301"> 商家发货，用户未确认</span>
              <span v-if="list.orderDetail.orderServiceStatus ==401">用户确认收货</span>
              <span v-if="list.orderDetail.orderServiceStatus ==402">系统自动确认收货</span>
            </template>
          </el-form-item>

          <el-form-item label="订单编号">{{ list.orderDetail.orderSn || "无" }}</el-form-item>
          <el-form-item label="订单日期">{{ list.orderDetail.createTime || "无" }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="支付信息">
        <el-form label-width="150px" label-position="left" class="demo-conetnt">
          <el-form-item label="支付方式">
            <template>
              <span v-if="list.orderDetail.paymentType ==5">USDE支付</span>
              <span v-if="list.orderDetail.paymentType ==1">微信支付</span>
              <span v-if="list.orderDetail.paymentType ==2">支付宝支付</span>
              <span v-if="list.orderDetail.paymentType ==6">积分支付</span>
              <span v-if="list.orderDetail.paymentType ==7">EOS支付</span>
              <span v-if="list.orderDetail.paymentType ==8">paypal支付</span>
            </template>
          </el-form-item>

          <el-form-item label="支付价格">{{ list.orderDetail.paymentPrice || 0 }}</el-form-item>
          <el-form-item label="是否使用积分支付">{{ list.orderDetail.isBonusUsed ? "是":"否" }}</el-form-item>
          <el-form-item label="积分数">{{ list.orderDetail.bonusNum || 0 }}</el-form-item>
          <el-form-item label="积分扣除状态">{{ list.orderDetail.isBonusPaySuccess ? '成功':"失败" }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="物流信息">
        <el-form label-width="100px" label-position="left" class="demo-conetnt">
          <el-form-item label="快递公司">{{ list.orderDetail.shipChannel || "暂无信息" }}</el-form-item>
          <el-form-item label="物流单号">{{ list.orderDetail.shipSn || "暂无信息" }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="积分相关">
        <el-form label-width="100px" label-position="left" class="demo-conetnt">
          <el-form-item label="积分使用">{{ list.orderDetail.isBonusUsed ? "是":"否" }}</el-form-item>
          <el-form-item
            v-if="list.orderDetail.isBonusUsed"
            label="积分扣除"
          >{{ list.orderDetail.isBonusPaySuccess ? "是":"否" }}</el-form-item>
          <el-form-item
            v-if="list.orderDetail.isBonusUsed"
            label="积分退还"
          >{{ list.orderDetail.isBonusPayBackSuccess ? "是":"否" }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="用户信息">
        <el-form label-width="100px" label-position="left" class="demo-conetnt">
          <el-form-item label="用户ID">{{ list.orderDetail.userUid || "暂无信息" }}</el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item v-if="list.orderRecord" label="OrderRecord">
        <el-form label-width="100px" label-position="left" class="demo-conetnt">
          <el-form-item label="支付帐号">{{ list.orderRecord.account || "暂无信息" }}</el-form-item>
          <el-form-item label="商品名称">{{ list.orderRecord.subject || "暂无信息" }}</el-form-item>
          <el-form-item label="订单ID">{{ list.orderRecord.itemId || "暂无信息" }}</el-form-item>
          <el-form-item label="订单金额">{{ list.orderRecord.price || "暂无信息" }}</el-form-item>
          <el-form-item label="支付金额">{{ list.orderRecord.paymentPrice || "暂无信息" }}</el-form-item>

          <el-form-item label="支付类型">
            <span v-if=" list.orderRecord.paymentType ==1">微信</span>
            <span v-if=" list.orderRecord.paymentType ==2">支付宝</span>
                 <span v-if=" list.orderRecord.paymentType ==5">USDE</span>
            <span v-if=" list.orderRecord.paymentType ==6">积分</span>
                 <span v-if=" list.orderRecord.paymentType ==7">EOS</span>
            <span v-if=" list.orderRecord.paymentType ==8">PayPal</span>
          </el-form-item>

          <el-form-item label="支付订单号">{{ list.orderRecord.orderCode || "暂无信息" }}</el-form-item>
          <el-form-item label="支付网关订单号">{{ list.orderRecord.gatewayOrderId || "暂无信息" }}</el-form-item>

          <el-form-item label="是否支付成功">{{ list.orderRecord.success ?"成功":"失败" }}</el-form-item>
          <el-form-item label="订单支付状态">
            <span v-if=" list.orderRecord.orderStatus ==1">预支付订单</span>
            <span v-if=" list.orderRecord.orderStatus ==2">支付成功</span>
            <span v-if=" list.orderRecord.orderStatus ==3">业务处理成功</span>
            <span v-if=" list.orderRecord.orderStatus ==4">支付失败</span>
            <span v-if=" list.orderRecord.orderStatus ==5">业务处理失败</span>
          </el-form-item>

          <el-form-item label="错误代码">{{ list.orderRecord.errorCode || '无' }}</el-form-item>
          <el-form-item label="错误内容">{{ list.orderRecord.errorMessage || '无' }}</el-form-item>

          <el-form-item label="创建时间">{{ list.orderRecord.createTime || '无' }}</el-form-item>
          <el-form-item label="支付时间">{{ list.orderRecord.paymentTime || '无' }}</el-form-item>

          <el-form-item label="订单数据">{{ list.orderRecord.orderData || '无' }}</el-form-item>
        </el-form>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { orderDetail } from '@/api/grapefruit/grapefruitlist'
export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      orderId: this.$route.query.orderId,
      list: null
    }
  },
  watch: {
    qureyList: {
      handler(val, oldVal) {
        this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 获取列表
    fetchData(params = this.orderId) {
      this.listLoading = true
      orderDetail({ orderDetailId: params }).then(response => {
        this.list = response.data
        this.listLoading = false
        this.dialogFormVisible = false
      })
    }, // fetchData
    cancel(formName) {
      this.dialogFormVisible = false
    },
    // 关键词搜索
    keyWordSearch(keyword) {
      this.fetchData({ s_LIKE_categoryName: keyword })
    },
    // 分页查询 style = 0 为上一页 1 为下页
    getPage(type) { // 分页加载
      console.log(type)
      this.qureyList.pageNum = type
      this.fetchData()
    }
  }
}
</script>
<style scoped>
.demo-conetnt .el-form-item {
  width: 50%;
  float: left;
  border: 1px solid #d6d6d6;
  padding: 0 0 0 10px;
}
.scale-1px {
  position: relative;
  border: none;
}
.scale-1px:after {
  content: "";
  position: absolute;
  bottom: 0;
  background: #000;
  width: 100%;
  height: 1px;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
</style>

