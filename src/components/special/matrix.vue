<!--
 * @Description: matrix
 * @Author: wangyun
 * @Date: 2019-09-05 10:43:42
 * @LastEditors: wangyun
 * @LastEditTime: 2019-11-13 16:16:42
 -->
<template>
  <canvas id="vue-matrix" ref="matrix"></canvas>
</template>
<script>
export default {
  name: 'vue-matrix',
  props: {
    // canvasWidth: {
    //   type: Number,
    //   default: 1920
    // },
    // canvasHeight: {
    //   type: Number,
    //   default: 1800
    // },
    fontSize: {
      type: Number,
      default: 18
    },
    fontWeight: {
      type: String,
      default: '500'
    },
    fontFamily: {
      type: String,
      default: 'Microsoft YaHei'
    },
    textContent: {
      type: String,
      default: 'Starteos is NO.1'
    },
    textColor: {
      type: String,
      default: '#00cc33',
      validator: function(value) {
        var colorReg = /^#([0-9a-fA-F]{6})|([0-9a-fA-F]{3})$/g
        return colorReg.test(value)
      }
    },
    bgColor: {
      type: String,
      default: 'rgba(0,0,0,0.1)',
      validator: function(value) {
        var reg = /^[rR][gG][Bb][Aa][\(]((2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?(0\.\d{1,2}|1|0)?[\)]{1}$/
        return reg.test(value)
      }
    }
    // speed: {
    //   type: Number,
    //   default: 3,
    //   validator: function(value) {
    //     return value % 1 === 0
    //   }
    // }
  },
  data() {
    return {
      initClock: null,
      // speedCnt: 0,
      canvas: null, // 画布对象
      canvasCtx: null, // 画布上下文
      columns: 0, // 计算 列
      rainPositionY: [] // 记录每列文字的y轴坐标
    }
  },
  mounted() {
    this.initCanvas()
  },
  methods: {
    initCanvas() {
      this.canvas = this.$refs.matrix
      // console.log('this.canvas: ', this.canvas)
      this.canvas.tagName.toLowerCase() !== 'canvas' &&
        console.log("Error! Invaild canvas! Please check the canvas's id!")

      //获取浏览器屏幕的高度和宽度
      this.canvas.width = window.innerWidth
      this.canvas.height = window.innerHeight
      this.canvasCtx = this.canvas.getContext('2d')
      this.columns = Math.floor(this.canvas.width / this.fontSize)

      // 初始化文字下落位置
      for (let i = 0; i < this.columns; i++) {
        this.rainPositionY.push(0)
      }

      let initClock = setInterval(() => {
        this.animationDraw()
        console.log('代码雨特效启动')
      }, 1000 / 30)

      this.$once('hook:destroyed', () => {
        window.clearInterval(initClock)
        console.log('代码雨特效关闭')
      })

      // //绘制随机颜色
      // function randomColor() {
      //   let r = Math.floor(Math.random() * 256)
      //   let g = Math.floor(Math.randow() * 256)
      //   let b = Math.floor(Math.randow() * 256)
      //   return "rgb('+r+','+g+','+b+')"
      // }
    },

    animationDraw() {
      // this.speedCnt++
      // if (this.speedCnt === this.speed) {
      //   this.speedCnt = 0
      // }

      // 绘制背景
      this.canvasCtx.fillStyle = this.bgColor //指定填充样式
      this.canvasCtx.fillRect(0, 0, this.canvas.width, this.canvas.height) //绘制填充矩形

      // 绘制文字
      this.canvasCtx.font = `${this.fontWeight} ${this.fontSize}px ${this.fontFamily}` // 给字体设置样式
      this.canvasCtx.fillStyle = this.textColor // 给字体添加颜色

      // 遍历数字雨 写入画布
      for (let i = 0, len = this.rainPositionY.length; i < len; i++) {
        this.rainPositionY[i]++

        let randomTextIndex = Math.floor(
          Math.random() * this.textContent.length
        )

        let randomText = this.textContent[randomTextIndex]

        let x = i * this.fontSize
        let y = this.rainPositionY[i] * this.fontSize

        this.canvasCtx.fillText(randomText, x, y)

        if (y >= this.canvas.height && Math.random() > 0.99) {
          this.rainPositionY[i] = 0
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
#vue-matrix {
  position: fixed;
  z-index: -100;
  width: 100vw;
  height: 100vh;
  // background: #000;
}
</style>