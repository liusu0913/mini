<template>
  <div class="login">
    <img class="banner" src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/login-banner.png" alt="">
    <div class="login-area">
      <div class="job-number item">
        <p>员工工号</p>
        <input
          v-model="jobNumber"
          class="uni-input"
          placeholder="请输入员工工号"
        >
      </div>
      <div class="phone item">
        <p>手机号</p>
        <input
          v-model="iphone"
          class="uni-input"
          placeholder="请输入手机号"
        >
      </div>
      <div class="item">
        <p>短信验证码</p>
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
      
    </div>
    <button
      class="login-btn"
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
      setUserLogin: 'user/setUserLogin'
    }),
    userLogin() {
      if (this.code && this.jobNumber && this.iphone) {
        login.login({
          code: this.code,
          jobNumber: this.jobNumber,
          iphone: this.iphone
        }).then(data => {
          uni.setStorageSync('mini_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2JJZCI6IjEwMDAxIiwibmFtZSI6IueOi-S6lCIsInBob25lIjoiMTg4ODg4ODg4ODgiLCJjb21wYW55SWQiOiI4NiIsInJvbGUiOjMsImJlbG9uZ0NvbXBhbnkiOjEsImlhdCI6MTY0MTcxNDQ2NCwiZXhwIjoxNjQyMzE5MjY0fQ.8ogT_LXpkmk5rCZ9DKrGTXQJmI-ZHHrgQjHDfJk14D0');
          this.setUserLogin(true)
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
    height: 100vh;
    background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/login-bg.png') no-repeat;
    background-size: 100% 100%;
    .login-btn {
      margin-top: 73rpx;
      width: 470rpx;
      height: 83rpx;
      background-color: #6ec995;
      font-size: 30rpx;
      line-height: 83rpx;
      text-align: center;
      color: #fff;
      border-radius: 42rpx;
    }
  }
  .banner {
    vertical-align: top;
    width: 100%;
  }
  .item {
    padding: 0 100rpx;
    margin-top: 27rpx;
    margin-bottom: 35rpx;
    p {
      font-size: 26rpx;
      font-weight: 400;
      text-align: left;
      color: #5f5f5f;
      margin-bottom: 15rpx;
    }
    .uni-input {
      height: 90rpx;
      line-height: 90rpx;
      font-size: 34rpx;
      text-align: left;
      color: #111110;
      border-bottom: 1px solid #ccc;
    }
  }
  .code {
    display: flex;
    border-bottom: 1px solid #ccc;

    span {
      text-align: center;
      display: inline-block;
      width: 202rpx;
      height: 62rpx;
      margin-top: 14rpx;
      line-height: 62rpx;
      font-size: 26rpx;
      color: #fff;
      background-color: #6ec995;
      border-radius: 31rpx;
    }
    .uni-input {
      line-height: 40rpx;
      flex: 1;
      border: none;
      margin: 0;
    }
  }
</style>
