<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-06 15:12:00
 * @LastEditTime: 2019-09-20 14:30:04
 * @LastEditors: xcq
 -->

<template>
  <div class="app-container1">
    <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="demo-ruleForm">
      <el-form-item v-if="form.id" label="商品ID">
        <el-input v-model="form.id" readonly />
      </el-form-item>

      <el-form-item label="商品名称" required>
        <el-input v-model="form.goods.name" @blur="onblur('name')" />
      </el-form-item>

      <el-form-item label="商品名称En" required>
        <el-input v-model="form.goods.nameEn" @blur="onblur('nameEn')" />
      </el-form-item>

      <el-form-item label="商品条形码" required>
        <el-input v-model="form.goods.goodsSn" placeholder="请填入商品条形码" @blur="onblur('goodsSn')" />
      </el-form-item>

      <el-form-item label="商品类目" required>
        <el-cascader
          :props="optionProps"
          :options="list1"
          v-model="form.categoryId"
          change-on-select
          @change="handleChange1"
        />
      </el-form-item>

      <el-form-item label="品牌">
        <el-select v-model="form.goods.brandId" placeholder="请选择">
          <el-option
            v-for="item in brandList"
            :key="item.name"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="商品关键字">
        <el-input v-model="form.goods.keywords" placeholder="请填入商品关键字" />
      </el-form-item>

      <el-form-item label="商品单位">
        <el-input v-model="form.goods.unit" placeholder="请填入商品单位，例如个、套" @blur="onblur('unit')" />
      </el-form-item>

      <div style="display:flex;">
        <el-form-item label>
          <span style="color:red;font-size:20px;margin-right:10px;">秒杀</span>
          <el-checkbox v-model="form.goods.isHot" />
        </el-form-item>

        <el-form-item label="自营">
          <el-checkbox v-model="form.goods.isProprietary" />
        </el-form-item>

        <el-form-item label="上架">
          <el-checkbox v-model="form.goods.isOnSale" />
        </el-form-item>
      </div>

      <el-form-item label="商品详情">
        <el-radio-group v-model="tabPosition" style="margin-bottom: 30px;">
          <el-radio-button label="移动中文" />
          <el-radio-button label="移动英文" />
          <el-radio-button label="PC中文" />
          <el-radio-button label="PC英文" />
        </el-radio-group>
      </el-form-item>

      <div>
        <el-form-item v-if="tabPosition=='移动中文'">
          <vue-ueditor-wrap v-model="form.goods.detail" :config="myConfig" />
        </el-form-item>

        <el-form-item v-if="tabPosition=='移动英文'">
          <vue-ueditor-wrap v-model="form.goods.detailEn" :config="myConfig" />
        </el-form-item>

        <el-form-item v-if="tabPosition=='PC中文'">
          <vue-ueditor-wrap v-model="form.goods.detailPc" :config="myConfig" />
        </el-form-item>

        <el-form-item v-if="tabPosition=='PC英文'">
          <vue-ueditor-wrap v-model="form.goods.detailPcEn" :config="myConfig" />
        </el-form-item>
      </div>

      <el-form-item label="支持积分">
        <el-checkbox v-model="form.goods.isOpenBonus" />
      </el-form-item>
      <el-form-item label="规格" required>
        <el-button @click="addguige('guige')">添加</el-button>
        <el-form-item v-for="(guige, index) in form.guige" :key="index">
          <!-- <el-col :span="6" style="display:flex;margin:10px 0;"> -->
          <el-form-item label="规格名">
            <el-input
              v-model="guige.value"
              size="small"
              placeholder="输入中文规格"
              style="margin:0 10px; width:150px;"
            />
            <el-input
              v-model="guige.valueEn"
              size="small"
              placeholder="输入英文规格"
              style="margin:0 10px; width:150px;"
            />
            <el-button size="small" @click.prevent="removeDomain(guige)">删除</el-button>
          </el-form-item>
          <!-- </el-col> -->
          <el-form-item label="规格值">
            <el-tag
              v-for="(tag,index1) in form.guige[index].zhi"
              :key="'tag'+index1"
              :disable-transitions="false"
              closable
              @close="handleClose(tag,index)"
            >{{ tag }}-{{ form.guige[index].zhiEn[index1] }}</el-tag>
            <!-- <el-tag
              v-for="(tag,index1) in form.guige[index].zhiEn"
              :key="'tag'+index1 + '100'"
              :disable-transitions="false"
              closable
              @close="handleClose(tag,index)"
            >{{ tag }}</el-tag>-->
            <el-input
              v-if="form.guige[index].inputVisible"
              :ref="'saveTagInput'+index"
              v-model="form.guige[index].inputValue"
              placeholder="输入中文规格值"
              class="input-new-tag"
              style="margin:0 10px; width:150px;"
              size="small"
            />
            <!-- @keyup.enter.native="handleInputConfirm(index)"
            @blur="handleInputConfirm(index)"-->
            <el-input
              v-if="form.guige[index].inputVisible"
              :ref="'saveTagInput'+index"
              v-model="form.guige[index].inputValueEn"
              placeholder="输入英文规格值"
              class="input-new-tag"
              style="margin:0 10px; width:150px;"
              size="small"
            />
            <el-button
              v-if="form.guige[index].inputVisible"
              class="button-new-tag"
              size="small"
              @click="showInput(index)"
            >+添加规格值</el-button>
            <!-- @keyup.enter.native="handleInputConfirm(index)"
            @blur="handleInputConfirm(index)"-->
            <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">+添加规格值</el-button>
          </el-form-item>
        </el-form-item>
      </el-form-item>

      <el-form-item label="价格" required>
        <sku
          v-if="form.guige"
          :isopenbonus="form.goods.isOpenBonus"
          :guige="form.guige"
          :products="form.products"
          @getTableInfo="getTableInfo"
        />
      </el-form-item>

      <el-form-item label="零售价格">
        <el-input
          v-model="form.goods.retailPrice"
          placeholder="请填入零售价格"
          @blur="onblur('retailPrice')"
        />
      </el-form-item>

      <el-form-item label="原价">
        <el-input
          v-model="form.goods.counterPrice"
          placeholder="请填入原价"
          @blur="onblur('counterPrice')"
        />
      </el-form-item>

      <el-form-item label="支付方式" required>
        <el-select
          v-model="form.supportPaymentType"
          style="width: 100%;"
          multiple
          placeholder="请选择"
        >
          <el-option v-for="item in pay" :key="item.desc" :label="item.name" :value="item.bitCode" />
        </el-select>
      </el-form-item>

      <el-form-item label="列表展示图" label-width="300">
        <div style="width:300px;margin-left:100px;">
          <el-upload
            :show-file-list="false"
            :on-success="(res,file)=>{ return handleAvatarSuccess(res,file,index)}"
            :before-upload="beforeAvatarUpload"
            :http-request="(file)=>{return upLoad(file,'Zh')}"
            class="avatar-uploader"
            action="/"
          >
            <img v-if="form.goods.picUrl" :src="form.goods.picUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="英文列表展示图" label-width="300">
        <div style="width:300px;margin-left:100px;">
          <el-upload
            :show-file-list="false"
            :on-success="(res,file)=>{ return handleAvatarSuccess(res,file,index)}"
            :before-upload="beforeAvatarUpload"
            :http-request="(file)=>{return upLoad(file,'En')}"
            class="avatar-uploader"
            action="/"
          >
            <img v-if="form.goods.picUrlEn" :src="form.goods.picUrlEn" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </div>
      </el-form-item>

      <el-form-item label="排序">
        <el-input v-model="form.goods.sortOrder" placeholder="请填入商品排序" @blur="onblur('sortOrder')" />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="$router.go(-1)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { goodsAdd, goodsDelete, goodsDetail, getSupportPaymentType, uploadImage, brandListAll, categoryList } from '@/api/grapefruit/grapefruitlist'
import VueUeditorWrap from 'vue-ueditor-wrap'
import sku from './compoments/sku'
import { getCoteryDilt, getCotery } from '@/utils/validate'
import { Promise, resolve } from 'q'
export default {
  components: {
    VueUeditorWrap, sku
  },
  data () {
    return {
      tabPosition: '移动中文',
      brandList: [],
      optionProps: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      list1: [],
      deleteShops: [],
      dataBale: [],
      pay: [],
      fileList: [],
      // pos: 0,
      myConfig: {
        autoHeightEnabled: true,
        initialFrameHeight: 500,
        initialFrameWidth: '100%',
        serverUrl: '/apiUrl/api/eosmall/file/ue/uploadImage', // 'http://35.201.165.105:8000/controller.php',
        UEDITOR_HOME_URL: '/static/UEditor/'
      },
      spanArr: [],
      // dataTable: [],
      inputVisible: false,
      inputValue: '',
      inputValueEn: '',
      listLoading: true,
      dialogTableVisible: false,
      formLabelWidth: '120px',
      form: {
        goods: {
          isOpenBonus: false
        },
        guige: [],
        products: []
      },
      guige: {},
      rules: {
        nodeName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        nodeUrl: [
          { required: true, message: '请输入分类英文名', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请输入分类排序', trigger: 'blur' }
        ]
      }// rr
    }
  },
  computed: {
    id () {
      return this.$route.query.id
    }
  },

  async created () {
    this.list2 = (await categoryList()).data
    this.list1 = getCoteryDilt(this.list2)
  },
  async mounted () {
    if (this.$route.query.style == 0) {
      this.fetchData()
    }
    this.pay = (await getSupportPaymentType()).data
    this.brandList = (await brandListAll()).data
    this.$route.meta.title = this.$route.query.style == 0 ? '添加商品' : '新增商品'
  },
  methods: {
    handleChange1 (value) {
      console.log(value)
    },
    // 表格信息
    getTableInfo (table) {
      this.dataBale = table
    },
    getGroup (data, index = 0, group = []) {
      var need_apply = []
      need_apply.push(data[index])
      for (var i = 0; i < group.length; i++) {
        need_apply.push(group[i] + data[index])
      }
      group.push.apply(group, need_apply)

      if (index + 1 >= data.length) return group
      else return this.getGroup(data, index + 1, group)
    },
    // 提交
    async submitForm () {
      try {
        this.form.products = []
        this.form.specifications = []
        let a = true
        this.dataBale.map(i => {
          if (!i.number || !i.price) {
            a = false
          } else {
            const specifications = []
            const specificationsEn = []
            console.log('i1: ', i)
            i.map(item => {
              specifications.push(item)
              console.log('item: ', item)
              this.form.guige.map((itemG, indexG) => {
                const _indexOf = itemG.zhi.indexOf(item)
                console.log('itemG.zhi: ', itemG.zhi)
                console.log('_indexOf: ', _indexOf)
                if (_indexOf != -1) {
                  specificationsEn.push(itemG.zhiEn[_indexOf])
                }
              })
            })

            // specifications.map((itemd, indexI) => {
            //   this.form.guige.map((itemG, indexG) => {
            //     const _indexOf = itemG.zhi.indexOf(itemd)
            //     if (_indexOf > 0) {
            //       specificationsEn.push(itemG.zhiEn[_indexOf])
            //     }
            //   })
            // })
            console.log('specificationsEn: ', specificationsEn)
            this.form.products.push({
              specifications: JSON.stringify(specifications),
              specificationsEn: JSON.stringify(specificationsEn),
              price: i.price,
              number: i.number,
              url: i.url,
              urlEn: i.urlEn,
              bonusPrice: i.bonusPrice,
              bonusNum: i.bonusNum
            })
          }
        })
        this.form.guige.map(i => {
          i.zhi.map((item, index) => {
            this.form.specifications.push({
              specification: i.value,
              specificationEn: i.valueEn,
              value: item,
              valueEn: i.zhiEn[index]
            })
          })
        })
        console.log('this.form: ', this.form)
        console.log('this.dataBale: ', this.dataBale)
        // debugger
        // return
        if (!a) {
          this.$message({
            type: 'success',
            message: '老哥，规格填完整撒!'
          })
          return
        }
        if (this.form.supportPaymentType.length == 1 && this.form.supportPaymentType[0] == 8) {
          this.$message({
            type: 'success',
            message: '老哥，不能只支持积分支付，有可能会产生邮费哦~!'
          })
          return
        }
        if (this.form.goods.isOpenBonus && !this.form.supportPaymentType.includes(8)) {
          this.form.supportPaymentType.push(8)
        }
        const result = this.form.supportPaymentType.reduce((result, item) => {
          result = result | item
          return result
        }, 0)
        if (this.form.supportPaymentType.length < 1) {
          this.$message({
            type: 'success',
            message: '老哥，用啥支付!'
          })
        }
        if (Number(this.form.goods.sortOrder) < Math.pow(2, 15) * -1 || Number(this.form.goods.sortOrder) > Math.pow(2, 15) - 1) {
          this.$message({
            type: 'success',
            message: '老哥，排序只能在-32768到32767之间哦~'
          })
          return
        }

        // console.log('this.form.supportPaymentType: ', this.form.supportPaymentType)
        // console.log('result: ', result)
        // return
        // debugger
        this.form.goods.supportPaymentType = result
        if (!this.form.goods.name || !this.form.goods.goodsSn || !this.form.goods.supportPaymentType || !this.form.products.length || !this.form.specifications.length) {
          this.$message({
            type: 'success',
            message: '老哥，必填还没有填完整!'
          })
          return
        }
        if (this.form.categoryId) {
          this.form.goods.categoryId = this.form.categoryId[this.form.categoryId.length - 1]
        }
        // this.form.goods.picUrl = this.fileList.length > 0 ? this.fileList[0].url : ''
        this.$delete(this.form, 'guige')
        delete this.form.goods.createTime
        delete this.form.goods.updateTime

        console.log('this.form: ', this.form)
        const res = await goodsAdd({ goods: this.form.goods, products: this.form.products, specifications: this.form.specifications })
        if (res.code == 1000) {
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.$router.replace({
            path: '/applications/grapefruit/grapefruit-shops'
          })
        } else {
          this.$message({
            type: 'success',
            message: res.message
          })
          this.fetchData()
          this.$forceUpdate()
        }
      } catch (error) {
        console.log('error: ', error)
        if (this.$route.query.style == 0) {
          this.fetchData()
        }
      }
    },
    handleRemove (file, fileList) {
    },
    handlePreview (file) {
    },
    handleAvatarSuccess () { },
    upLoad (file, type) {
      console.log('type: ', type)
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('type', 4)
      uploadImage(formData).then(res => res.data)
        .then(data => {
          if (type == 'En') {
            this.$set(this.form.goods, 'picUrlEn', data.previewPath)
          } else {
            this.$set(this.form.goods, 'picUrl', data.previewPath)
          }
          this.$forceUpdate()
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
        })
    },
    beforeAvatarUpload (file) {
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
      }
      return isLt2M
    },
    handleChange (file, fileList) {
      this.fileList = fileList.slice(-3)
    },
    handleClose (tag, index) {
      this.form.guige[index].zhi.splice(this.form.guige[index].zhi.indexOf(tag), 1)
      this.form.guige[index].zhiEn.splice(this.form.guige[index].zhi.indexOf(tag), 1)
      this.$set(this.form, 'guige', this.form.guige)
    },

    showInput (index) {
      console.log('this.form: ', this.form)
      this.form.guige[index].inputVisible = true
      this.handleInputConfirm(index)
      // this.$nextTick(_ => {
      //   this.$refs[`saveTagInput${index}`].$refs.input.focus()
      // })
    },
    handleInputConfirm (index) {
      const inputValue = this.form.guige[index].inputValue
      console.log('inputValue: ', inputValue)
      const inputValueEn = this.form.guige[index].inputValueEn
      console.log('inputValueEn: ', inputValueEn)
      if (!inputValue || !inputValueEn) {
        return
      }
      this.form.guige[index].zhi.push(inputValue)
      this.form.guige[index].zhiEn.push(inputValueEn)
      // this.form.guige[index].inputVisible = false
      this.form.guige[index].inputValue = ''
      this.form.guige[index].inputValueEn = ''
    },
    // 删除规格
    async removeDomain (item) {
      const re = await this.suresure()
      if (!re) {
        return
      }
      var index = this.form.guige.indexOf(item)
      if (index !== -1) {
        this.form.guige.splice(index, 1)
      }
    },
    suresure () {
      return new Promise(resolve => {
        this.$confirm('此操作为危险操作?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            resolve(true)
          }).catch(() => {
            resolve(false)
          })
        }).catch(() => {
          resolve(false)
        })
      })
    },
    // 添加规格
    addguige (value) {
      const a = this.form.guige.every(i => i.value != '')
      if (!a) {
        this.$message({
          type: 'success',
          message: '老哥，还有规格还没填写呢，就不要添加那么多啦!'
        })
        return
      }
      this.form.guige.push({ value: '', zhi: [], zhiEn: [], inputVisible: true })
    },
    // 操作
    async edit (style, item) {
      style == 1 && this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        const result = await this.deleteShop(style, item)
        if (result.code == 200) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      if (style == 0 || style == 3) { this.addShop(style, item) }
    },
    async deleteShop (item) {
      return await goodsDelete({ id: item.id })
    },
    // 新增或者编辑商品
    async addShop (style, item) {
      this.title = style == 3 ? '新增' : '编辑'
      this.dialogFormVisible = true
    },
    // 获取详情
    fetchData (params = this.id) {
      this.listLoading = true

      goodsDetail({ id: params }).then(response => {
        this.form = Object.assign({}, this.form, response.data)
        this.listLoading = false
        const arr = []

        response.data.specifications.map(i => {
          if (i.deleted) {
            return
          }
          const ishave = arr.some(a => a.value == i.specification)
          console.log('ishave: ', ishave)
          if (ishave) {
            arr.map(item => {
              if (item.value == i.specification) {
                item.zhi.push(i.value)
                item.zhiEn.push(i.valueEn)
              }
            })
          } else {
            arr.push({
              value: i.specification,
              valueEn: i.specificationEn,
              deleted: i.deleted,
              inputVisible: false,
              zhi: [i.value],
              zhiEn: [i.valueEn]
            })
          }
        })

        this.form.guige = arr
        console.log('this.form.guige: ', this.form.guige)
        const data = getCotery(this.list2)

        const data1 = data.filter(i => i.id == this.form.goods.categoryId)[0]
        // const a = response.data.paymentTypeSupported.filter(i => i.isSupported)
        this.form.supportPaymentType = response.data.paymentTypeSupported.map(i => i.bitCode)
        this.form.categoryId = this.getC(data, data1)
        this.dialogFormVisible = false
      })
    }, // fetchData
    getC (data, data1, arr = [data1.id]) {
      for (const i in data) {
        if (data[i].id == data1.parentId) {
          arr.unshift(data[i].id)
          if (data[i].id != data[i].parentId) {
            this.getC(data, data[i], arr)
          } else {
            return arr
          }
        }
      }
    }
  }
}
</script>
// https://starteos-app.oss-cn-shenzhen.aliyuncs.com/EOSMall/goodsDetail/video/nT1cqWk7YZynEXk9rAPH0ubeMmz59aIC"
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

