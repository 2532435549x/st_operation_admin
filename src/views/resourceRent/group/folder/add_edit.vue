
<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :rules="rules" label-width="140px" class="demo-form-inline">
      <el-form-item label="所属链" prop="chainType">
        <el-select v-model="form.chainType" placeholder="请选择所属链">
          <el-option
            v-for="(item, index) in chainTypeOptions"
            :key="index"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="资源包类型">
        <el-select v-model="signValue" class="multiple-select" multiple placeholder="请选择资源包类型">
          <el-option label="CPU" value="1"></el-option>
          <el-option label="NET" value="2"></el-option>
          <el-option label="RAM" value="3"></el-option>
        </el-select>
        <el-tag type="danger">注意：RAM 不能和CPU NET共用</el-tag>
      </el-form-item>

      <el-form-item label="cpuId" v-if="signValue.indexOf('1') !== -1 || form.hasCpu">
        <el-input v-model="form.cpuId" placeholder="点击查看套餐，选择套餐名字自动填入" />
        <el-popover placement="right-start" width="200" height="100">
          <div class="comboList">
            <el-table :data="cpuList" max-height="250">
              <el-table-column width="140" label="CPU套餐名字" align="center" fixed>
                <template slot-scope="scope">
                  <div @click="choose(scope.row, 'cpuId')" class="pointDiv">{{scope.row.name}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button slot="reference" type="primary" plain>点击查看CPU套餐</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="netId" v-if="signValue.indexOf('2') !== -1 || form.hasNet">
        <el-input v-model="form.netId" placeholder="点击查看套餐，选择套餐名字自动填入" />
        <el-popover placement="right-start" width="200" height="100">
          <div class="comboList">
            <el-table :data="netList" max-height="250">
              <el-table-column width="150" label="NET套餐名字" align="center" fixed>
                <template slot-scope="scope">
                  <div @click="choose(scope.row, 'netId')" class="pointDiv">{{scope.row.name}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button slot="reference" type="primary" plain>点击查看NET套餐</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="ramId" v-if="signValue.indexOf('3') !== -1 || form.hasRam">
        <el-input v-model="form.ramId" placeholder="点击查看套餐，选择套餐名字自动填入"/>
        <el-popover placement="right-start" width="200" height="100">
          <div class="comboList">
            <el-table :data="ramList" max-height="250">
              <el-table-column width="150" label="RAM套餐名字" align="center" fixed>
                <template slot-scope="scope">
                  <div @click="choose(scope.row, 'ramId')" class="pointDiv">{{scope.row.name}}</div>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-button slot="reference" type="primary" plain>点击查看RAM套餐</el-button>
        </el-popover>
      </el-form-item>

      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请填写名称" />
      </el-form-item>

      <el-form-item label="英文名称" prop="name">
        <el-input v-model="form.nameEn" placeholder="请填写英文名称" />
      </el-form-item>

      <el-form-item label="描述" prop="description">
        <el-input v-model="form.description" type="textarea" autosize placeholder="请填写描述" />
      </el-form-item>

      <el-form-item label="英文描述" prop="descriptionEn">
        <el-input v-model="form.descriptionEn" type="textarea" autosize placeholder="请填写英文描述" />
      </el-form-item>

      <el-form-item label="可用天数" prop="availableDays">
        <el-input
          type="number"
          v-model="form.availableDays"
          @blur="checkNumberHandler(form.availableDays, 'availableDays')"
          placeholder="请填写可用天数"
          min="0"
          step="1"
        />
      </el-form-item>

      <el-form-item label="排序" prop="sort">
        <el-input
          type="number"
          v-model="form.sort"
          @blur="checkNumberHandler(form.sort, 'sort')"
          placeholder="请填写排序"
          min="0"
          step="1"
        />
      </el-form-item>

      <el-form-item label="是否有效" prop="status" v-if="form.style == 'edit'">
        <el-switch v-model="form.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </el-form-item>

      <br />
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">确定</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  getResourceGroupList,
  getResourceGroupDetail,
  addResourceGroup,
  editResourceGroup,
  getResourceGroupItems
} from '@/api/resourceRent/group'
export default {
  data() {
    return {
      form: {
        cpuId: '',
        netId: '',
        ramId: '',
        chainType: 'EOS' // 默认为'EOS'
      },
      signValue: [],
      cpuList: [],
      netList: [],
      ramList: [],
      rules: {
        name: [{ required: true, message: '名称不能为空' }],

        description: [{ required: true, message: '描述不能为空' }],

        nameEn: [{ required: true, message: '英文名称不能为空' }],

        descriptionEn: [{ required: true, message: '英文描述不能为空' }],
        availableDays: [{ required: true, message: '可用天数不能为空' }],
        sort: [{ required: true, message: '排序不能为空' }],

        chainType: [
          { required: true, message: '请选择所属链', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    signValue(val) {
      console.log('val: ', val)
      let params = {
        chainType: 'EOS'
      }
      val.forEach(val => {
        params = Object.assign({}, params, { type: val })
        if (val == '1') {
          if (this.cpuList.length === 0) {
            getResourceGroupItems(params).then(v => {
              this.cpuList = v.data
            })
          }
        } else if (val == '2') {
          if (this.netList.length === 0) {
            getResourceGroupItems(params).then(v => {
              this.netList = v.data
            })
          }
        } else if (val == '3') {
          if (this.ramList.length === 0) {
            getResourceGroupItems(params).then(v => {
              this.ramList = v.data
            })
          }
        }
      })

      if (val.indexOf('1') === -1) {
        this.form.hasCpu = false
        this.form.cpuId = ''
      }
      if (val.indexOf('2') === -1) {
        this.form.hasNet = false
        this.form.netId = ''
      }
      if (val.indexOf('3') === -1) {
        this.form.hasRam = false
        this.form.ramId = ''
      }
    }
  },
  created() {
    if (this.$route.query) {
      this.form = Object.assign({}, this.form, this.$route.query)
      if (this.$route.query.id) {
        getResourceGroupDetail({ id: this.$route.query.id }).then(v => {
          this.form = Object.assign({}, this.form, v.data)
          this.form.hasCpu && this.signValue.push('1')
          this.form.hasNet && this.signValue.push('2')
          this.form.hasRam && this.signValue.push('3')
        })
      }
    }
  },

  methods: {
    choose(item, sign) {
      this.form[sign] = item.id
    },

    submitForm(formName) {
      if (this.signValue.length === 0) {
        return this.$message.error('资源包类型必须要选！！！')
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `是否进行【${
              this.$route.query.style == 'add' ? '添加' : '编辑'
            }】操作?`,
            '提示',
            {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }
          )
            .then(() => {
              this.submitHandler()
            })
            .catch(e => {
              this.$notify({
                type: 'info',
                title: '提示',
                message: `已取消${
                  this.$route.query.style == 'add' ? '添加' : '编辑'
                }`
              })
            })
        } else {
          this.$message.error('大哥，请填写完整表单！')
          return false
        }
      })
    }, // 表单验证

    submitHandler() {
      let params = Object.assign({}, this.form)
      console.log('params: ', params)
      if (this.form.style == 'add') {
        addResourceGroup(params)
          .then(v => {
            console.log('v: ', v)
            this.$notify({
              title: '成功',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}成功`,
              type: 'success'
            })
            this.$router.push({
              path: '/resourceRent/group/group-list'
            })
          })
          .catch(e => {
            this.$notify({
              title: '失败',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}失败`,
              type: 'error'
            })
          })
      } else if (this.form.style == 'edit') {
        editResourceGroup(params)
          .then(v => {
            this.$notify({
              title: '成功',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}成功`,
              type: 'success'
            })
            this.$router.push({
              path: '/resourceRent/group/group-list'
            })
          })
          .catch(e => {
            this.$notify({
              title: '失败',
              message: `${this.form.style == 'add' ? '添加' : '编辑'}失败`,
              type: 'error'
            })
          })
      }
    },

    resetForm(formName) {
      this.$refs[formName].resetFields()
    } // 表单重置
  }
}
</script>

<style lang="scss" scoped>
.el-input {
  width: 600px;
}
.multiple-select {
  min-width: 250px;
}
.el-textarea {
  width: 600px;
}
.pointDiv {
  cursor: pointer;
}
</style>

