<template>
  <view class="box">
    <view class="user">
      <img :src="userInfo.img">
      <view class="intr">
        <p class="name">
          {{ userInfo.name }}
          <span v-if="userInfo.hasStay">未留资</span>
          <span>未留资</span>
        </p>
        <p class="data">
          <span class="recommend">推荐度{{ parseInt(userInfo.recommend) }}%</span>
          <span>活跃度{{ parseInt(userInfo.active) }}%</span>
          <span>影响人数{{ parseInt(userInfo.affect) }}</span>
        </p>
      </view>
    </view>
    <view class="board">
      <p>
        <span>活跃度</span>
        {{ parseInt(userInfo.active) }}
      </p>
      <p>
        <span>近30天活跃</span>
        {{ parseInt(userInfo.monthActive) }}
      </p>
      <p class="people">
        <span>TA的人脉</span>
        {{ parseInt(userInfo.people) }}
      </p>
    </view>
    <view class="list">
      <view class="tag">
        <span
          v-for="(tag, index) in userInfo.tags"
          :key="index"
        >{{ tag }}</span>
      </view>
      <view
        v-for="(item, index) in userInfo.list"
        :key="index"
        class="item"
      >
        <view class="head">
          <view class="source">
            来自{{ item.source }}
          </view>
          <view class="time">
            最后访问{{ item.time }}
          </view>
        </view>
        <view class="title">
          {{ item.title }}
        </view>
        <view class="tags">
          <span
            v-for="(tag, i) in item.tags"
            :key="i"
          >{{ tag }}</span>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { getUser } from '@/api'

export default {
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.userId = currentPage.options.id
  },
  data() {
    return {
      userId: 0,
      userInfo: {
      }
    }
  },
  mounted() {
    getUser.info({
      id: this.userId
    }).then(data => {
      console.log(data)
      this.userInfo = data
    })
  },
  methods: {

  }
}
</script>

<style lang="scss" scope>
.box {
  box-sizing: border-box;
  height: 100vh;
  background: url('../../static/img/bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 20rpx;
  padding-top: 30rpx;
}
.user {
  border-radius: 10rpx 10rpx 0 0;
  background-color: #fff;
  padding: 30rpx 20rpx;
  display: flex;
  img {
    width: 148rpx;
    height: 148rpx;
    border-radius: 50%;
    margin-right: 30rpx;
  }
  .intr {
    margin-top: 20rpx;
    flex: 1;
    .name {
      font-size: 40rpx;
      font-weight: 500;
      color: #111110;
      span {
        display: inline-block;
        vertical-align: top;
        width: 80rpx;
        height: 32rpx;
        line-height: 32rpx;
        margin-left: 30rpx;
        margin-top: 10rpx;
        color: #fff;
        background-color: #e4bda5;
        border-radius: 16rpx;
        font-size: 20rpx;
        text-align: center;
      }
    }
    .data {
      margin-top: 17rpx;
      font-size: 20rpx;
      line-height: 30rpx;
      color: #969696;
      span {
        margin-right: 30rpx;
      }
      .recommend {
        color: #606060;
      }
    }
  }
}
.board {
  display: flex;
  background-color: #fff;
  text-align: center;
  p {
    flex: 1;
    font-size: 74rpx;
    font-weight: 700;
    text-align: center;
    color: #5dc096;
    span {
      display: block;
      font-size: 24rpx;
      font-weight: 400;
      text-align: center;
      color: #606060;
    }
  }
}
.list {
  background-color: #fff;
  padding: 20rpx 20rpx;
  .tag {
    font-size: 0;
    padding: 32rpx 0;
    white-space: nowrap;
    overflow: auto;
    span {
      height: 54rpx;
      line-height: 54rpx;
      padding: 0 36rpx;
      display: inline-block;
      color: #fff;
      font-size: 22rpx;
      font-weight: 400;
      text-align: center;
      background-color:#5dc096;
      border-radius: 30rpx;
      margin-right: 15rpx;
    }
  }
  .item {
    padding: 30rpx 40rpx;
    background-color: #f7f9fd;
    margin-bottom: 15rpx;
    border-radius: 10rpx;
    .head {
      display: flex;
      font-size: 20rpx;
      color: #969696;
      .source {
        flex: 1;
      }
    }
    .title {
      margin: 20rpx 0;
      font-size: 28rpx;
      font-family: Source Han Sans CN, Source Han Sans CN-Regular;
      font-weight: 400;
      text-align: left;
      color: #111110;
    }
    .tags {
      font-size: 0;
      span {
        display: inline-block;
        font-size: 20rpx;
        line-height: 40rpx;
        text-align: center;
        color: #969696;
        padding: 0rpx 23rpx;
        background-color: #ffeedc;
        border-radius: 20rpx;
        margin-right: 20rpx;
        margin-bottom: 10rpx;
      }
    }
  }
}
</style>
