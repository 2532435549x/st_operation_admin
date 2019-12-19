<!--
 * @Description: dappCategory -> list
 * @Author: wangyun
 * @Date: 2019-08-16 14:14:06
 * @LastEditTime: 2019-11-15 09:26:37
 -->
<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form inline class="demo-form-inline">
        <el-form-item>
          <el-input v-model="queryList.s_LIKE_categoryName" placeholder="请输入分类名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-input v-model="queryList.s_LIKE_categoryNameEn" placeholder="请输入分类英文名称" clearable />
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_status" clearable placeholder="选择状态">
            <el-option :label="'开启/关闭'" :value="null" />
            <el-option :label="'开启'" :value="1" />
            <el-option :label="'关闭'" :value="0" />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-select v-model="queryList.s_LIKE_chainType" clearable placeholder="选择所属链">
            <el-option :label="'全部'" :value="null" />
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-edit" @click="formVisible('add')">新增</el-button>
          <el-button type="primary" @click="refresh">刷新</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 表格处理 -->
    <el-table
      v-loading="listLoading"
      :data="listData.list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
      sortable
      @sort-change="changeTableSort"
    >
      <el-table-column align="center" label="序号" width="50">
        <template
          slot-scope="scope"
        >{{ scope.$index + 1 + (listData.pageNum-1) * listData.pageSize }}</template>
      </el-table-column>

      <el-table-column class-name="status-col" label="分类ID" width="110" align="center">
        <template slot-scope="scope">{{ scope.row.id }}</template>
      </el-table-column>

      <el-table-column label="图标" align="center" width="140">
        <template slot-scope="scope">
          <img :src="scope.row.previewPath" alt width="90" />
        </template>
      </el-table-column>

      <el-table-column label="分类名称" align="center">
        <template slot-scope="scope">{{ scope.row.categoryName }}</template>
      </el-table-column>

      <el-table-column label="分类英文名称" align="center">
        <template slot-scope="scope">{{ scope.row.categoryNameEn }}</template>
      </el-table-column>

      <el-table-column label="排序" width="110" sortable="custom" align="center">
        <template slot-scope="scope">{{ scope.row.sort }}</template>
      </el-table-column>

      <el-table-column label="所属链" width="100" align="center">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.chainType=='EOS'">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else-if="scope.row.chainType=='BOS'" type="success">{{ scope.row.chainType }}</el-tag>
          <el-tag v-else type="warning">{{ scope.row.chainType }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="状态" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.status"
            type="success"
            title="已开启，点击可关闭"
            icon="el-icon-check"
            circle
            size="mini"
            @click="stateExchange('disable', scope.row)"
          />
          <el-button
            v-else
            type="danger"
            title="已关闭，点击可开启"
            icon="el-icon-close"
            circle
            size="mini"
            @click="stateExchange('open', scope.row,)"
          />
        </template>
      </el-table-column>

      <el-table-column label="创建时间" sortable="create_time" align="center">
        <template slot-scope="scope">{{ scope.row.createTime }}</template>
      </el-table-column>

      <el-table-column align="center" label="操作" fixed="right" width="280">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="formVisible('edit',scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="delItem(scope.row)">删除</el-button>
          <el-button type="primary" size="small" @click="formVisible('set',scope.row)">配置DApp</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格处理 -->

    <!-- 弹出编辑框 -->
    <el-dialog :visible.sync="dialogFormVisible" :title="title.text">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="demo-ruleForm">
        <el-form-item label="分类图标">
          <el-upload
            v-loading="imgLoading"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :data="ruleForm"
            class="avatar-uploader"
            action="/apiUrl/api/common/uploadImage"
          >
            <img v-if="form.previewPath" :src="form.previewPath" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
          <el-tag size="small">图标 建议尺寸 w:80px h:80px</el-tag>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryName">
          <el-input v-model="form.categoryName" placeholder="请填入分类名称" />
        </el-form-item>

        <el-form-item label="分类名称(EN)" prop="categoryNameEn">
          <el-input v-model="form.categoryNameEn" placeholder="请输入分类名称(英文)" />
        </el-form-item>

        <el-form-item label="所属链类型" prop="chainType">
          <el-select v-model="form.chainType" placeholder="选择所属链">
            <el-option
              v-for="(item, index) in chainTypeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="分类排序" prop="sort">
          <el-input
            v-model="form.sort"
            type="number"
            min="0"
            step="1"
            placeholder="请填入排序,数字越大越靠前(默认为0)"
          />
        </el-form-item>

        <el-form-item label="状态管理" prop="status">
          <el-switch v-model="form.status" inactive-text="关闭" active-text="开启" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">确定</el-button>
          <el-button @click="cancel('form')">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 弹出编辑框 -->

    <!-- 翻页组件 -->
    <div class="pageQury">
      <el-pagination
        :total="listData.total"
        :page-size="listData.pageSize"
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page.sync="queryList.pageNum"
        v-if="listData.total !=0"
      />
    </div>
    <!-- 翻页组件 -->
  </div>
</template>

<script>
import { setContextData, getContextData } from '@/utils/validate'

import {
  getCategoryList,
  addCategory,
  deleteCategory,
  editCategory,
  checkClassify
} from '@/api/findModule/dappCategory'

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
      ruleForm: { type: 4 }, // 上传时附带的额外参数 @params{type} 1 推文图片 2 代币图片 3 启动广告 4 发现banner、精品推荐
      imgLoading: false, // 图片上传加载
      listLoading: false,
      dialogFormVisible: false,

      queryList: {
        pageNum: 1,
        pageSize: 10,
        // LIKE 模糊查询
        s_LIKE_categoryName: '',
        s_LIKE_categoryNameEn: ''
      },
      listData: {}, // 列表数据
      form: {},
      title: {
        state: '',
        text: ''
      }, // 弹出框标题；新增 --修改分类两种

      rules: {
        categoryName: [
          { required: true, message: '请填入分类名称', trigger: 'blur' }
        ],
        categoryNameEn: [
          { required: true, message: '请输入分类名称（英文）', trigger: 'blur' }
        ],
        chainType: [
          { required: true, message: '请选择所属链类型', trigger: 'change' }
        ],
        sort: [{ required: true, message: '请输入分类排序', trigger: 'blur' }]
      }
    }
  },
  computed: {},
  watch: {
    queryList: {
      handler(val, oldVal) {
        val && this.fetchData()
      },
      deep: true
    }
  },
  created() {
    this.queryList.pageNum = getContextData('xxx-pageNum') || 1
    this.fetchData()
  },
  methods: {
    async refresh() {
      let res = await this.fetchData()
      if (res.result) {
        this.$message({
          message: '刷新成功！',
          type: 'success'
        })
      }
    },

    async fetchData() {
      this.listLoading = true
      this.dialogFormVisible = false
      try {
        let res = await getCategoryList(this.queryList)
        this.listLoading = false

        if (res.code === 1000) {
          this.listData = res.data
          console.log('this.listData: ', this.listData)

          return { result: true, text: 'success' }
        } else {
          return { result: false, text: 'fail' }
        }
      } catch (e) {
        this.listLoading = false

        return { result: false, text: e }
      }
    }, // fetchData

    handleAvatarSuccess(res, file) {
      if (res.code == 1000) {
        this.form.categoryIcon = res.data.savePath // 后台需要字段
        this.form.previewPath = res.data.previewPath // 前端展示字段
        this.imgLoading = false
        this.$message.success('上传成功')
      } else {
        this.imgLoading = false
        this.$message.error('上传失败')
      }
    }, // 文件上传成功时的钩子方法

    beforeAvatarUpload(file) {
      this.imgLoading = true
      const isJPG = file.type === 'image/jpeg' || 'image/gif' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
        this.imgLoading = false
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
        this.imgLoading = false
      }
      return isJPG && isLt2M
    }, // 上传文件之前的钩子方法，参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传

    formVisible(style, item) {
      this.dialogFormVisible = ['add', 'edit'].includes(style)

      switch (style) {
        case 'add':
          this.form = Object.assign({}, { chainType: 'EOS' })
          this.title = Object.assign({}, { state: style, text: '新增' })
          break
        case 'edit':
          this.form = { ...item }
          this.title = Object.assign({}, { state: style, text: '编辑' })
          break
        case 'set':
          this.$router.push({
            path: '/walletTol/find/dappCategory/dappCategory-allocation',
            query: { ...item }
          })
          break
      }
    },

    submitForm(formName) {
      if (!this.form.categoryIcon) {
        this.$message.error('小老弟，你图标都不上传，我很难办啊！')
        return false
      }

      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(
            `此操作将【${this.title.text}】该分类, 是否继续?`,
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
            .catch(() => {
              this.$message.info({
                title: '提示',
                message: `已取消${this.title.text}`
              })
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    submitHandler() {
      let status = this.form.status ? 1 : 0
      let params = Object.assign({}, { ...this.form }, { status })
      console.log('params: ', params)
      if (this.title.state === 'edit') {
        editCategory(params).then(v => {
          if (v.code === 1000) {
            this.$notify.success({
              title: '成功',
              message: `${this.title.text}成功`
            })
            this.fetchData()
          }
        })
      } else if (this.title.state == 'add') {
        addCategory(params).then(v => {
          if (v.code === 1000) {
            this.$notify.success({
              title: '成功',
              message: `${this.title.text}成功`
            })
            this.fetchData()
          }
        })
      }
    },

    cancel(formName) {
      this.dialogFormVisible = false
      this.$notify.info({
        title: '提示',
        message: `已取消${this.title.text}`
      })
    },

    stateExchange(state, item) {
      this.$confirm(
        `${state == 'disable' ? '关闭' : '开启'}启用后,前台【${
          item.categoryName
        }】分类 将${state == 'disable' ? '隐藏' : '显示'}，老哥谨慎操作哦！`,
        'FBI WARNING',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          let status = state == 'disable' ? 0 : 1
          let params = Object.assign({}, { ...item }, { status })
          editCategory(params).then(v => {
            if (v.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: `修改成功`
              })
              this.fetchData()
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: `已取消修改`
          })
        })
    },

    delItem(item) {
      this.$confirm(
        `你正在删除 【${
          item.categoryName
        }】分类，删除之后就没法找到了，老哥谨慎操作哦！`,
        '删除',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          deleteCategory({ ...item }).then(v => {
            if (v.code == 1000) {
              this.$notify.success({
                title: '成功',
                message: '删除成功'
              })
              this.fetchData()
            }
          })
        })
        .catch(() => {
          this.$notify.info({
            title: '提示',
            message: '已取消删除'
          })
        })
    }, // 删除操作

    changeTableSort(payload) {
      let rule = ''
      switch (payload.order) {
        case 'ascending':
          rule = 'sort DESC'
          break
        case 'descending':
          rule = 'sort ASC'
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
      console.log('this.queryList ', this.queryList)
    }, // 改变排序

    handleCurrentChange(currentPage) {
      setContextData('xxx-pageNum', currentPage)
      this.queryList.pageNum = currentPage
    } // handleCurrentChange
  }
}
</script>
<style lang="scss" scoped>
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
  display: block;
}
</style>
