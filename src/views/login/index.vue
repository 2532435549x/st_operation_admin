<!--
 * @Description: login
 * @Author: wangyun
 * @Date: 2019-07-27 21:27:36
 * @LastEditors: wangyun
 * @LastEditTime: 2019-12-12 12:05:29
 -->

<template>
  <div class="login-container">
    <!-- <vue-particles
      :particle-opacity="0.7"
      :particles-number="100"
      :particle-size="4"
      :lines-width="1"
      :line-linked="true"
      :line-opacity="0.4"
      :lines-distance="150"
      :move-speed="2"
      :hover-effect="true"
      :click-effect="true"
      color="#fff"
      shape-type="circle"
      lines-color="#fff"
      hover-mode="grab"
      click-mode="push"
      class="lizi"
    />-->
    <matrix text-color="#409EFF" />
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      :class="checkCode?'filter':''"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <h3 class="title">Starteos运营系统强势整合版</h3>
      <el-form-item prop="username">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          v-model="loginForm.username"
          name="username"
          type="text"
          auto-complete="on"
          placeholder="用户名"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <el-input
          :type="pwdType"
          v-model="loginForm.password"
          name="password"
          auto-complete="on"
          placeholder="密码"
          @keyup.enter.native="handleLogin"
        />
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          :loading="loading"
          type="primary"
          style="width:100%;"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>

    <!-- googleCodeImg -->
    <div v-if="checkCode" class="googleCodeImg">
      <i class="el-icon-close close" title="关闭" @click="checkCode=false" />
      <img :src="user.avatar" alt srcset class="userIcon" />
      <div class="userName">{{ user.name }}</div>
      <img v-if="codeImg" :src="'data:img/jpg;base64,'+codeImg" alt class="codeImg" />
      <div class="inputBox">
        <input v-model="secondaryCode" type="text" placeholder="请输入Google验证中的动态验证码" />
        <i class="el-icon-arrow-right codeSubmit" @click="secondaryLogin" />
      </div>
      <h2>请使用Google身份验证器扫码验证身份</h2>
    </div>
    <!-- googleCodeImg -->
  </div>
</template>

<script>
import Matrix from '@/components/special/matrix'
import { isvalidUsername } from '@/utils/validate'
import { creatCode, secondaryLogin, getQuanXian } from '@/api/login'
import { setTokenAuth } from '@/utils/auth' // 验权
import { mapState } from 'vuex'
export default {
  name: 'Login',
  components: {
    Matrix
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error('填用户名啊，大哥！'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 1) {
        callback(new Error('填密码啊，大哥耶！'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [
          { required: true, trigger: 'blur', validator: validateUsername }
        ],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password',
      redirect: undefined,
      queryOld: '',
      codeImg: null, // 绑定验证码二维码
      secondaryCode: null, // 二次验证码
      checkCode: false // 是否二次验证
    }
  },
  computed: {
    ...mapState(['user'])
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() { },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    checkStatue(v) {
      // 检查状态
      const { isLoginSuccess, enableTwoFactorAuth, twoFactorAuth } = v
      console.log('账号信息', v)
      if (isLoginSuccess) {
        setTokenAuth()
        const query = this.$route.query
        if (query.redirect) {
          delete query.redirect
        }
        this.$router.push({ path: this.redirect || '/', query })
      } else if (!twoFactorAuth) {
        // 生成二维码绑定
        creatCode().then(v => {
          // console.log(v)
          this.$message.warning('请绑定Google身份验证')
          this.checkCode = true
          if (v) {
            this.codeImg = v.data.qrcodeBase64
          }
        })
      } else if (enableTwoFactorAuth) {
        // 已绑定输入验证码双重验证
        this.$message.warning('请进行双重验证')
        this.checkCode = true
        this.secondaryLogin()
      }
    }, // checkStatue
    secondaryLogin() {
      // 二次验证登录
      if (!this.secondaryCode) {
        this.$message.warning('请输入动态验证码')
        return
      }
      const params = {
        code: this.secondaryCode
      }
      secondaryLogin(params).then(v => {
        console.log('二次登录成功')
        console.log(v)
        this.checkStatue(v.data)
      })
    }, // secondaryLogin
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('Login', this.loginForm)
            .then(v => {
              this.loading = false
              this.fetchChainsList()
              this.checkStatue(v)
              this.$store.dispatch('GetInfo').then(v => {
                console.log('用户模块及权限: ', v)
              })
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    // fetchChainsList
     fetchChainsList() {
      this.$store.dispatch('setChains')
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #283443;
$light_gray: #fff;
$cursor: #fff;
.googleCodeImg {
  text-align: center;
  position: fixed;
  background: rgba(0, 0, 0, 0.8);
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  color: white;
  box-sizing: border-box;
  padding: 50px;
  h2 {
    display: block;
    margin: 40px auto;
    font-size: 13px;
    font-weight: normal;
    opacity: 0.5;
  }
  .codeImg {
    width: 200px;
    height: 200px;
    border: 2px solid white;
    display: block;
    margin: 20px auto;
  }
  .userIcon {
    display: block;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin: 20px auto;
  }
  .userName {
    font-weight: bold;
    font-size: 20px;
  }
  .inputBox {
    position: relative;
    width: 500px;
    margin: 40px auto;
    input {
      display: block;
      width: 100%;
      text-align: center;
      border: none;
      padding: 25px 20px;
      border-bottom: 2px solid white;
      color: white;
      background: none;
      outline: none;
      font-size: 21px;
      font-weight: bold;
      padding-right: 80px;
    }
    i {
      display: block;
      width: 50px;
      height: 50px;
      position: absolute;
      right: 0;
      top: 0;
      background: white;
      color: black;
      line-height: 50px;
      border-radius: 50%;
      top: 50%;
      margin-top: -25px;
      cursor: pointer;
    }
  }
  a {
    display: inline-block;
    margin: 0 20px;
    opacity: 0.5;
    font-size: 11px;
  }
  .close {
    display: block;
    width: 50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    position: fixed;
    right: 50px;
    top: 50px;
    border: 2px solid white;
    color: white;
    cursor: pointer;
  }
}
/* reset element-ui css */
.login-container {
  position: relative;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.2);
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.2);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
// $bg: linear-gradient(-90deg, #29bdd9 0%, #276ace 100%);
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #fff;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background: $bg;
  .login-form {
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 35px 35px 15px;
    width: 520px;
    max-width: 100%;
    border-radius: 6px;
    // border: 1px solid rgba(255, 255, 255, 0.2);
    background: rgba(20, 20, 20, 0.7);
    box-shadow: 0px 0px 4px 1px rgba(138, 138, 138, 0.3);
    &.filter {
      filter: blur(10px);
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
