<template>
  <div class="login">
    <h2>齿科获客助手</h2>
    <div class="login-area">
      <input
        v-model="jobNumber"
        class="uni-input"
        placeholder="请输入员工工号"
      >
      <input
        v-model="iphone"
        class="uni-input"
        placeholder="请输入手机号"
      >
      <div class="code">
        <input
          v-model="code"
          class="uni-input"
          placeholder="请输入短信验证码"
        >
        <span
          v-if="!beginCountDown"
          @click="getCode"
        >
          {{ codeBtnTxt }}
        </span>
        <span v-else>
          {{ timeNum }}s
        </span>
      </div>
    </div>
    <button
      type="primary"
      @click="userLogin"
    >
      登录
    </button>
  </div>
</template>

<script>
import { login } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'Index',
  data () {
    return {
      jobNumber: '',
      iphone: '',
      code: '',
      codeBtnTxt: '获取验证码',
      timeNum: 60,
      beginCountDown: false,
      timer: null,
      time: '2020-11-08T16:00:00.000Z'
    }
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'user/setUserInfo'
    }),
    userLogin() {
      if (this.code && this.jobNumber && this.iphone) {
        login.login({
          code: this.code,
          jobNumber: this.jobNumber,
          iphone: this.iphone
        }).then(data => {
          this.setUserInfo(data)
        })
      } else {
        wx.showToast({
          title: '请填写以上全部的信息',
          icon: 'none',
          duration: 1500
        })
      }
    },
    getCode() {
      this.beginCountDown = true
      this.timer = setInterval(() => {
        if (!this.timeNum) {
          this.beginCountDown = false
          this.timeNum = 60
          clearInterval(this.timer)
        }
        this.timeNum--
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
  .login {
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    transform: translateY(-70%);
    width: 100%;
    padding: 0 40rpx;
  }
  h2 {
    font-size: 40rpx;
    text-align: center;
    margin-bottom: 200rpx;
  }
  .uni-input {
    border-bottom: 1px solid #ccc;
    margin-bottom: 40rpx;
  }
  .code {
    display: flex;
    border-bottom: 1px solid #ccc;
    margin-bottom: 90rpx;
    span {
      text-align: center;
      display: inline-block;
      width: 180rpx;
      color: #000;
      font-size: 32rpx;
    }
    .uni-input {
      line-height: 40rpx;
      flex: 1;
      border: none;
      margin: 0;
    }
  }
</style>
