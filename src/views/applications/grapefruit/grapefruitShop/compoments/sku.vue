<!--
 * @Description:
 * @Author: 熊成强
 * @Date: 2019-08-09 10:49:09
 * @LastEditTime: 2019-09-20 17:24:01
 * @LastEditors: xcq
 -->
<template>
  <div>
    <table border="1" cellspacing="0" cellpadding="0" style="border-collapse: collapse;">
      <tr v-if="tableHeader!=''">
        <th
          v-for="(item,index) in tableHeader"
          :key="index"
          style="text-align: center;"
          class="table-bordered"
        >{{ item }}</th>
        <th style="text-align: center;" class="table-bordered">中文规格图片</th>
        <th style="text-align: center;" class="table-bordered">英文规格图片</th>
        <th style="text-align: center;" class="table-bordered">库存</th>
        <th style="text-align: center;" class="table-bordered">价格</th>
        <th v-if="isopenbonus" style="text-align: center;" class="table-bordered">积分数</th>
        <th v-if="isopenbonus" style="text-align: center;" class="table-bordered">积分价格</th>
      </tr>
      <tr v-for="(row,index) in table" :key="index">
        <td
          v-for="(item,key) in row"
          :key="key"
          style="text-align: center;"
          class="table-bordered"
        >{{ item }}</td>
        <td style="text-align: center;" class="table-pic">
          <div>
            <el-upload
              :show-file-list="false"
              :on-success="(res,file)=>{ return handleAvatarSuccess(res,file,index)}"
              :before-upload="beforeAvatarUpload"
              :http-request="(file)=>{return upLoad(file,index,'Zh')}"
              class="avatar-uploader"
              action="/"
            >
              <img v-if="row.url" :src="row.url" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </td>

        <td style="text-align: center;" class="table-pic">
          <div>
            <el-upload
              :show-file-list="false"
              :on-success="(res,file)=>{ return handleAvatarSuccess(res,file,index)}"
              :before-upload="beforeAvatarUpload"
              :http-request="(file)=>{return upLoad(file,index,'En')}"
              class="avatar-uploader"
              action="/"
            >
              <img v-if="row.urlEn" :src="row.urlEn" class="avatar" >
              <i v-else class="el-icon-plus avatar-uploader-icon" />
            </el-upload>
          </div>
        </td>

        <td style="text-align: center;" class="table-bordered">
          <input v-model="row.number" class="form-control" >
        </td>
        <td style="text-align: center;" class="table-bordered">
          <input v-model="row.price" class="form-control" >
        </td>
        <td v-if="isopenbonus" style="text-align: center;" class="table-bordered">
          <input v-model="row.bonusNum" class="form-control" >
        </td>
        <td v-if="isopenbonus" style="text-align: center;" class="table-bordered">
          <input v-model="row.bonusPrice" class="form-control" >
        </td>
      </tr>
    </table>
  </div>
</template>

<script>
import { uploadImage } from '@/api/grapefruit/grapefruitlist'
export default {
  props: {
    'guige': {
      type: Array,
      default: () => []
    },
    'products': {
      type: Array,
      default: () => []
    },
    'isopenbonus': {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newunit: '',
      newcategory: '',
      // category: {},
      table: [],
      tableHeader: [],
      selectCategory: [],
      s: {}
    }
  },
  computed: {
    category() {
      const a = {}
      console.log('this.guige: ', this.guige)
      this.guige.map(i => {
        console.log('i: ', i)
        a[i.value] = []
        i.zhi.map(item => {
          a[i.value].push(item)
        })
      })
      console.log('a: ', a)
      return a
    }
  },
  watch: {
    category: {
      handler: function(category, oldCategory) {
        this.tableHeader = []
        this.selectCategory = []
        for (var i in category) {
          this.tableHeader.push(i)
          this.selectCategory.push(category[i])
        }
        this.table = this.cartesianProductOf.apply(this, this.selectCategory)

        var c = this.category
      },
      deep: true
    },
    table: {
      handler(n, o) {
        this.$emit('getTableInfo', this.table)
      }, deep: true
    }
  },
  // updated() { },
  methods: {
    upLoad(file, index, type) {
      console.log('type: ', type)
      const formData = new FormData()
      formData.append('file', file.file)
      formData.append('type', 6)
      uploadImage(formData).then(data => {
        console.log('data: ', data.data)
        if (type == 'En') {
          this.$set(this.table[index], 'urlEn', data.data.previewPath)
          this.$message({
            type: 'success',
            message: '上传成功!'
          })
          this.$forceUpdate()
          return
        }
        this.$set(this.table[index], 'url', data.data.previewPath)
        this.$forceUpdate()
        this.$message({
          type: 'success',
          message: '上传成功!'
        })
      })
    },
    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 10MB!')
        this.imgLoading = false
      }
      return isLt2M
    }, // beforeAvatarUpload
    addCategory: function() {
      this.$set(this.category, this.newcategory, [])
      this.newcategory = ''
    },
    addUnit: function(name) {
      this.category[name].push(this.newunit)
    },
    cartesianProductOf: function() { // 笛卡尔积
      const arr = Array.prototype.reduce.call(arguments, (a, b) => {
        console.log('b: ', b)
        console.log('a: ', a)
        var ret = []
        a.forEach(function(a) {
          b.forEach(function(b) {
            ret.push(a.concat([b]))
          })
        })
        return ret
      }, [
        []
      ])
      const a = 0
      this.products1 = this.products.filter(i => !i.deleted)
      console.log('this.products1 : ', this.products1)
      console.log('arr: ', arr)
      arr.map(i => {
        this.products1.map(item => {
          if (JSON.stringify(i) == item.specifications) {
            i.number = item.number
            i.price = item.price
            i.url = item.url
            i.urlEn = item.urlEn
            i.bonusPrice = item.bonusPrice
            i.bonusNum = item.bonusNum
          }
        })
      })
      // arr.map(i => {
      //   console.log(i.sort(), a++)
      //   this.products.map(item => {
      //     console.log(JSON.parse(item.specifications).sort())
      //     if (JSON.stringify(i.sort()) == JSON.stringify(JSON.parse(item.specifications).sort())) {
      //       i.number = item.number
      //       i.price = item.price
      //       console.log('xcq', i)
      //     }
      //   })
      // })
      return arr
    }
  }
}
</script>

<style lang='scss'>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
.form-control {
  width: 40px;
  margin: 20px;
}
</style>
