<template>
  <navigator :url="`/pages/user/info?id=${item.openId}`">
    <div
      class="card"
    >
      <div class="top">
        <img
          :src="item.avatar"
          alt=""
        >
        <div class="user">
          <p class="name">
            {{ item.name }}
          </p>
          <p class="source">
            {{ item.sourceOpenId ? '转介绍客户' : '直接客户' }}
          </p>
        </div>
        <img
          v-if="item.phone"
          class="phone"
          @click.stop="callPhone(item)"
          src="../../static/img/phone.png">
      </div>
        <p class="bottom" v-if="item.record && item.record.length">
          <span>{{ getTime(item.record[0].createdAt || item.record[0].updatedAt) }}</span>访问了 {{ item.record[0].active.title }}
        </p>
    </div>
  </navigator>
  
</template>

<script>
  export default {
    name: 'wxUser',
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    methods: {
      getTime(time) {
        const spaceTime = new Date().getTime() - new Date(time).getTime()
        const h = Math.floor( spaceTime / 1000 / 60 / 60)
        if (!h) {
          return '1小时内'
        }
        if (h > 24) {
          return `${parseInt(h / 24, 10)}天前`
        } else {
          return `${h}小时前`
        }
      },
      goUserInfoPage(item) {
        uni.redirectTo({
          url: `/pages/user/info?id=${item.openId}`
        })
      },
      callPhone(item) {
        uni.makePhoneCall({
          phoneNumber: `${item.phone}` // 仅为示例
        })
      },
    }
  }
</script>

<style  lang="scss">
.card {
  padding: 24rpx 20rpx;
  border-radius:20rpx;
  margin-bottom: 20rpx;
  background-color: #f7f9fd;
  .top {
    padding: 20rpx 0;
    display: flex;
    img {
      width: 108rpx;
      height: 108rpx;
      border-radius: 50%;
    }
    .user {
      flex: 1;
      // line-height: 108rpx;
      margin-left: 40rpx;
      p {
        margin: 0;
        padding: 0;
      }
      .name {
        display: block;
        margin-top: 20rpx;
        font-size: 32rpx;
        font-weight: bold;
        color: #494949;
        line-height: 40rpx;
      }
      .source {
        display: inline-block;
        padding: 10rpx;
        margin-top: 10rpx;
        font-size: 20rpx;
        color: #ccc;
        color: #fff;
        background-color: #49bb8a;
        border-radius: 20rpx;
      }
      .tag {
        margin-left: 18rpx;
        vertical-align: middle;
        display: inline-block;
        padding: 0rpx 22rpx;
        font-size: 20rpx;
        color: #fff;
        border-radius: 20rpx;
        line-height: 34rpx;
        background-color: #76ce96;
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
    .phone {
      width: 80rpx;
      height: 80rpx;
      vertical-align: middle;
    }
  }
  .bottom {
    font-size: 18rpx;
    padding: 18rpx 0;
    span {
      color: #969696;
      margin-right: 16rpx;
    }
  }
}

</style>