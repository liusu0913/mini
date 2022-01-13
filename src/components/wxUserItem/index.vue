<template>
  <div
    class="card"
    @click="goUserInfoPage(item)"
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
      </div>
      <img
        v-if="item.phone"
        class="phone"
        @click.stop="callPhone(item)"
        src="../../static/img/phone.png">
    </div>
      <p class="bottom" v-if="item.record && item.record.length">
      <span>{{ getHour(item.record[0].updatedAt) }}小时前</span>访问了 {{ item.record[0].active.title }}
    </p>
  </div>
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
      getHour(time) {
        const spaceTime = new Date().getTime() - new Date(time).getTime()
        return Math.floor( spaceTime / 1000 / 60 / 60)
      },
      goUserInfoPage(item) {
        uni.navigateTo({
          url: `/pages/user/info?id=${item.openId}`
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
      line-height: 108rpx;
      margin-left: 40rpx;
      p {
        margin: 0;
        padding: 0;
      }
      .name {
        display: inline-block;
        font-size: 32rpx;
        font-weight: bold;
        color: #494949;
        line-height: 40rpx;
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