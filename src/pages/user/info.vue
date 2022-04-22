<template>
  <view class="box">
    <view class="user">
      <img :src="userInfo.avatar">
      <view class="intr">
        <p class="name">
          {{ userInfo.name }}
          <span v-if="!userInfo.phone">未留资</span>
        </p>
        <p class="data">
          <span class="recommend">{{ userInfo.finer ? `推荐度 ${userInfo.finer}%` : '不推荐' }}</span>
          <span>最初来源 {{ userInfo.sourceOpenId ? '客户转介绍' : '直接访问'}}</span>
        </p>
      </view>
    </view>
    <view class="board">
      <p>
        <span>活跃度</span>
        {{ userInfo.weekActive || 0 }}
      </p>
      <p>
        <span>近30天活跃</span>
        {{ (userInfo.monthActive) || 0 }}
      </p>
      <p class="people" @click="goUserList(userInfo)">
        <span>TA的人脉</span>
        {{ (userInfo.effectCount) || 0 }}
      </p>
    </view>
    
    <!-- 历史记录 -->
    <view class="list">
      <view class="tag">
        <span
          v-for="(tag, index) in userTags"
          :key="index"
        >{{ tag.tag }}</span>
      </view>
       <mescroll-body
        ref="mescrollRef"
        :down="downOption"
        @init="mescrollInit"
        @up="getActiveHistroy"
      >
        <view
          v-for="(item, index) in activeHistroy"
          :key="index"
          class="item"
        >
          <view class="head">
            <view class="source">
              来自{{ item.sourceUser ? `${item.sourceUser.name}用户分享` : '直接访问' }}
            </view>
            <view class="time">
              最后访问{{ item.updatedAt | date_format }}
            </view>
          </view>
          <view class="title">
            {{ item.active ? item.active.title : '-' }}
          </view>
          <view class="tags">
            <span
              v-for="(tag, i) in item.tags"
              :key="i"
            >{{ tag }}</span>
          </view>
        </view>
       </mescroll-body>
     
    </view>
  </view>
</template>

<script>
import { getUser } from '@/api'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'

export default {
  components: {
    mescrollBody
  },
  mixins: [MescrollMixin],
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.userId = currentPage.options.id
  },
  data() {
    return {
      userTags: [],
      downOption: {
        use: false,
        auto: false,
        textNoMore: '--- 到底了 ---'
      },
      userId: 0,
      userInfo: {
      },
      listCount: 20,
      pagesize: 20,
      offset: 0,
      isLoading: false,
      activeHistroy: []
    }
  },
  mounted() {
    getUser.info({
      openId: this.userId
    }).then(data => {
      this.userInfo = data
    })
    getUser.getUserTags({
      openId: this.userId
    }).then(data => {
      if (Array.isArray(data)) {
        this.userTags = data
      }
    })
  },
  methods: {
    goUserList(userinfo) {
      if (userinfo.effectCount && userinfo.openId) {
        uni.navigateTo({
          url: `/pages/user/list?source=${userinfo.openId}`
        })
      }
    },
    getActiveHistroy() {
      if (this.isLoading || this.activeHistroy.length === this.listCount) return
      this.isLoading = true
      getUser.activeHistroy({
        count: this.pagesize,
        offset: this.offset,
        openId: this.userId
      }).then(data => {
        if (data.list) {
          if (this.offset) {
            this.activeHistroy = this.activeHistroy.concat(data.list)
          } else {
            this.activeHistroy = data.list
          }
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          this.mescroll.endSuccess(this.activeHistroy.length, this.activeHistroy.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
    }
  }
}
</script>

<style lang="scss" scope>
.box {
  box-sizing: border-box;
  height: 100vh;
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
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
.list {
  background-color: #fff;
  padding: 20rpx 20rpx;
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
