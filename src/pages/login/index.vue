<template>
  <div class="login">
    <img class="banner" src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/login-banner.png" alt="">
    <div class="login-area">
      <div class="job-number item">
        <p>员工工号</p>
        <input
          v-model="jobId"
          class="uni-input"
          placeholder="请输入员工工号"
        >
      </div>
      <div class="phone item">
        <p>手机号</p>
        <input
          v-model="phone"
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
      open-type="getUserInfo"
      class="login-btn"
      type="primary"
      @click="userLogin"
    >
      登录
    </button>
  </div>
</template>

<script>
import { login, common, user } from '@/api'
import { mapMutations } from 'vuex'
export default {
  name: 'Index',
  data () {
    return {
      jobId: '',
      phone: '',
      code: '',
      codeBtnTxt: '获取验证码',
      timeNum: 60,
      beginCountDown: false,
      timer: null,
      time: '2020-11-08T16:00:00.000Z'
    }
  },
  methods: {
    getUserInfo(cb) {
      uni.login({
        lang: 'zh_CN',
        success(data) {
          common.getUnionid(data).then(res => {
            cb && cb(res)
          })
        }
      })
    },
    ...mapMutations({
      setUserLogin: 'user/setUserLogin'
    }),
    userLogin() {
      if (!this.code) {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 1500
        })
        return 

      }
      if (this.jobId && this.phone) {
        login.login({
          code: this.code,
          jobId: this.jobId,
          phone: this.phone
        }).then(data => {
          uni.setStorageSync('mini_token', data.token);
          this.getUserInfo((info) => {
            if (info.unionid) {
              user.update({
                unionid: info.unionid,
              }).then(res => {
                if (res.count) {
                  this.setUserLogin(true)
                } else {
                  uni.removeStorageSync('mini_token');
                  wx.showToast({
                    icon: 'none',
                    title: '更新用户信息失败，请重新登录'
                  })
                }
              })
            } else {
              uni.removeStorageSync('mini_token');
              wx.showToast({
                icon: 'none',
                title: '获取用户openId失败，请重新登录'
              })
            }
          })
        })
      } else {
        wx.showToast({
          title: '请输入工号和手机号',
          icon: 'none',
          duration: 1500
        })
      }
    },
    getCode() {
      this.timer = setInterval(() => {
        if (this.timeNum) {
          this.timeNum --
        } else {
          clearInterval(this.timer)
          this.beginCountDown = false
          this.timeNum = 60
        }
      }, 1000)
      login.sendSms({
        jobId: this.jobId,
        phone: this.phone
      }).then(() => {
        this.beginCountDown = true
        wx.showToast({
          title: '获取验证码成功',
          icon: 'none',
          duration: 1500
        })
      })
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
