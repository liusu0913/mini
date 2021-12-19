<template>
  <div class="edit-page">
    <ul class="usr">
      <li>
        <span>头像<i>*</i></span>
        <img
        class="headerPic"
          src="../../static/img/header.png"
        >
        <i class="arrowIcon"></i>
      </li>
      <li>
        <span>姓名<i>*</i></span>
        <input
          v-model="userInfo.name"
          type="text"
          placeholder="请输入姓名"
        >
      </li>
      <li>
        <span>手机号</span>
        <input
          v-model="userInfo.phone"
          type="text"
          placeholder="请输入手机号"
        >
      </li>
    </ul>
    <button
      class="saveBtn"
      @click="editUserMsg"
    >
      保存
    </button>
  </div>
</template>

<script>
import {
  mapGetters, mapMutations
} from 'vuex'

export default {
  data() {
    return {
      userInfo: {
        name: '',
        img: '',
        company: '',
        city: '',
        intr: '',
        wChat: 'wx',
        selfChatCode: 'https://rocket-dev.woa.com/images/rocket.png',
        companyChatCode: '',
        title: '前端开发工程师',
        phone: '15811240124'
      },
      items: [{
        value: 'cwx',
        name: '企业微信'
      }, {
        value: 'wx',
        name: '个人微信'
      }]
    }
  },
  computed: {
    ...mapGetters({
      info: 'user/info'
    })
  },
  mounted() {
    this.userInfo = {
      ...this.userInfo,
      ...this.info
    }
  },
  methods: {
    ...mapMutations({
      setUser: 'user/setUserInfo'
    }),
    editUserMsg() {
      if (this.userInfo.name) {
        this.setUser(this.userInfo)
        wx.showToast({
          icon: 'none',
          title: '保存成功'
        })
        uni.navigateBack()
      }
    },
    radioChange(key) {
      console.log(key)
      this.userInfo.wChat = key
    }
  }
}
</script>

<style lang="scss">
.edit-page {
  padding-top: 50rpx;
  height: 100vh;
  background: url('../../static/img/bg.png') no-repeat;
  background-size: 100% 100%;
  background-color: #fff;
  background-position-y: -240rpx;
  .headerPic {
    margin-right: 20rpx;
  }
  .arrowIcon {
    display: inline-block;
    position: absolute;
    right: 0rpx;
    top: 50%;
    margin-top: -12rpx;
    width: 14rpx;
    height: 23rpx;
    background: url('../../static/img/go.png') no-repeat;
  background-size: 100% 100%;
  }
  .saveBtn {
    margin: 0 50rpx;
    line-height: 80rpx;
    font-size: 30rpx;
    text-align: center;
    background-color: #4a73ec;
    border-radius: 40rpx;
    width: 470rpx;
    height: 84rpx;
    color: #fff;
    margin: 0 auto;
    position: absolute;
    bottom: 60rpx;
    left: 50%;
    margin-left: -235rpx;
    background: url('../../static/img/btnBg.png') no-repeat;
    background-size: 100% 100%;
  }
  ul, li {
    margin: 0;
    padding: 0;
    font-size: 26rpx;
    list-style: none;
    background-color: #fff;
    padding:  0 20rpx;
  }
  ul {
    margin-bottom: 20rpx;
  }
  .usr {
    background-color: #fff;
    margin: 0 30rpx 30rpx;
    border-radius: 10rpx;
    box-shadow: 0px 0px 20rpx 6rpx rgb(0 0 0 / 5%);
    li:first-child {
      img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
      span {
        flex: 1;
        vertical-align: top;
        line-height: 80rpx;
      }
    }
  }
  .wx {
    .wchat-code{
      flex: 1;
      text-align: right;
      img {
        width: 80rpx;
        height: 80rpx;
        border-radius: 50%;
      }
      span {
        flex: 1;
        vertical-align: top;
        font-size: 36rpx;
        line-height: 80rpx;
      }
    }
  }
  li {
    display: flex;
    padding: 20rpx;
    position: relative;
    border-bottom: 2rpx solid #eff2fa;
    span {
      display: inline-block;
      line-height: 60rpx;
      margin-right: 10rpx;
      i {
        display: inline-block;
        font-style: normal;
        color: red;
      }
    }
    input {
      margin-left: 30rpx;
      flex: 1;
      display: inline-block;
      line-height: 60rpx;
      height: 60rpx;
      color: #7e7a7a!important;
    }
    .radio {
      flex: 1;
      text-align: right;
      margin-left: 20rpx;
      line-height: 60rpx;
    }
    .upload {
      flex: 1;
      text-align: right;
    }
  }
}

</style>
