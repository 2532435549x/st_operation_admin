/*
 * @Description: mixins 放置常用方法
 * @Author: wangyun
 * @Date: 2019-08-30 11:03:35
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-28 16:45:49
 */
export default {
  filters: {
    typeFilter(type) {
      let colorType = ''
      switch (type) {
        case 0: colorType = 'warning'
          break
        case 1: colorType = 'primary'
          break
        case 2: colorType = 'success'
          break
        case 3: colorType = 'danger'
          break
        case 4: colorType = 'warning'
          break
        case 5: colorType = 'info'
          break
        default: colorType = 'warning'
      }
      return colorType
    },
    chainTypeFilter(val) {
      let colorType = ''
      switch (val) {
        case 'EOS': colorType = 'primary'
          break
        case 'BOS': colorType = 'success'
          break
        case 'ETH': colorType = 'warning'
          break
        case 'MEETONE': colorType = 'danger'
          break
        case 'USDT': colorType = 'info'
          break
        default: colorType = 'warning'
      }
      return colorType
    }
  },

  data() {
    return {
      // 列表请求数据
      queryList: {
        orderBy: 'create_time DESC' // 默认以创建时间倒序排列
      },
      // 租用类型
      rentTypeOptions: [
        { label: 'CPU', value: 1 },
        { label: 'NET', value: 2 },
        { label: 'RAM', value: 3 }
      ]
    }
  },
  computed: {
    chainTypeOptions() {
      return this.$store.state.wallet.chainTypeOptions
    }
  },
  methods: {
    // 头像加载失败返回值
    errorHandler() {
      return true
    },

    // 排序功能
    changeTableSort(payload) {
      // 排序后台不接收驼峰格式
      let rule = ''
      switch (payload.order) {
        case 'descending':
          rule = `${payload.column.sortable} DESC`
          break
        case 'ascending':
          rule = `${payload.column.sortable} ASC`
          break
        default:
          rule = ''
      }
      this.queryList.orderBy = rule
    },

    // 编辑判断需要
    checkNumberHandler(v, fieldName) {
      if (v) {
        const result = this.checkNumberThanZero(v)
        if (!result) {
          this.$message({
            type: 'warning',
            message: '必须是一个大于等于0的数'
          })
          if (this.form)
            this.form[fieldName] = '0'
        }
      }
    },

    // 正整数检查
    checkNumberThanZero(v) {
      const Rex = /^([0-9]\d*(\.\d*[1-9])?)|(0\.\d*[1-9])$/
      if (!Rex.test(v)) {
        return false
      } else {
        return true
      }
    },

    // 给sessionStorage存值
    $_setContextData(key, value) {
      if (typeof value === 'string') {
        window.sessionStorage.setItem(key, value)
      } else {
        window.sessionStorage.setItem(key, JSON.stringify(value))
      }
    },

    // 从sessionStorage取值
    $_getContextData(key) {
      const str = window.sessionStorage.getItem(key)
      if (typeof str === 'string') {
        try {
          return JSON.parse(str)
        } catch (e) {
          return str
        }
      }
      return
    },

    // 处理时间戳
    formatTime(time, fmt) {
      // yyyy-MM-dd hh:mm:ss
      if (time == null) {
        return
      }

      var fmt = fmt || 'yyyy-MM-dd'
      var time = new Date(time)
      var z = {
        M: time.getMonth() + 1,
        d: time.getDate(),
        h: time.getHours(),
        m: time.getMinutes(),
        s: time.getSeconds()
      }

      fmt = fmt.replace(/(M+|d+|h+|m+|s+)/g, function (v) {
        return ((v.length > 1 ? '0' : '') + eval('z.' + v.slice(-1))).slice(-2)
      })
      return fmt.replace(/(y+)/g, function (v) {
        return time.getFullYear().toString().slice(-v.length)
      })
    }
  }
}
