<template>
  <view class="box">
    <view class="user">
      <img :src="userInfo.img">
      <view class="intr">
        <p class="name">
          {{ userInfo.name }}
          <span v-if="userInfo.hasStay">未留资</span>
        </p>
        <p class="source">
          最初来源
          <span>{{ userInfo.source }}</span>
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
            {{ item.time }}
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
        <view class="last-time">
          最后访问时间：{{ item.time }}
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
  background-color: #efeff9;
  min-height: 100vh;
}
.user {
  background-color: #fff;
  padding: 40rpx 20rpx;
  display: flex;
  img {
    width: 110rpx;
    height: 110rpx;
    border-radius: 50%;
    margin-right: 30rpx;
  }
  .intr {
    flex: 1;
    .name {
      font-size: 30rpx;
      margin-bottom: 30rpx;
      span {
        position: relative;
        padding: 10rpx 20rpx;
        background-color: #dadada;
        color: #7d7d7d;
        border-radius: 10rpx;
        margin-left: 30rpx;
      }
      span::after {
        content: '';
        position: absolute;
        top: 50%;
        left: -20rpx;
        transform: translateY(-50%);
        border: 10rpx solid transparent;
        border-left-color: #c4c4c4;
      }
    }
    .source {
      font-size: 24rpx;
      color: #a7a7a4;
    }
  }
}
.board {
  display: flex;
  margin: 20rpx 20rpx;
  background-color: #fff;
  text-align: center;
  border-radius: 10rpx;
  p {
    flex: 1;
    font-size: 50rpx;
    font-weight: bold;
    color: #000;
    padding: 30rpx 0;
    span {
      display: block;
      font-size: 24rpx;
      color: #8f8f8f;
    }
  }
}
.list {
  background-color: #fff;
  padding: 20rpx 20rpx;
  .tag {
    font-size: 0;
    span {
      display: inline-block;
      padding: 10rpx 20rpx;
      font-size: 30rpx;
      color: #fff;
      background-color:#00a327;
      border-radius: 10rpx;
      margin-right: 10rpx;
    }
  }
  .item {
    padding: 30rpx 20rpx;
    border-bottom: 1px solid #c4cec4;
    .head {
      font-size: 26rpx;
      display: flex;
      color: #8e8e8e;
      .source {
        flex: 1;
      }
    }
    .title {
      font-size: 30rpx;
      line-height: 60rpx;
    }
    .tags {
      font-size: 0;
      span {
        display: inline-block;
        font-size: 24rpx;
        padding: 10rpx 20rpx;
        background-color: #dadada;
        color: #7d7d7d;
        border-radius: 10rpx;
        margin-right: 20rpx;
        margin-bottom: 20rpx;
      }
    }
    .last-time {
      font-size: 26rpx;
      color: #8e8e8e;
    }
  }
}
</style>
