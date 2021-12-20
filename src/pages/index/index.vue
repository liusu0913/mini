<template>
  <div>
    <LoginPage v-if="!isLogin" />
    <div
      v-else
      class="index-box"
    >
      <header class="header">
        <div class="user">
          <img :src="info.img">
          <div class="intr">
            <p class="name">
              {{ info.name }}
            </p>
            <p class="title">
              {{ info.title }}
            </p>
          </div>
        </div>
      </header>
      <div class="board">
        <div class="user-number item">
          <p>用户数</p>
          <span>{{ boardData.newAddNum }}</span>
          <div class="data">
            <i :class="[`${boardData.todayUp ? 'up' : 'down'}`]">今日 {{ boardData.todayCount }}</i>
            <i :class="[`${boardData.yesterdayUp ? 'up' : 'down'}`]">昨日 {{ boardData.yesterdayCount }}</i>
          </div>
        </div>
        <div class="ranking item">
          <p>今日排名</p>
          <span>{{ boardData.rank }}</span>
        </div>
      </div>
      <ul class="nav">
        <li @click="goWinCustomer(0)">
          <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/nav-1.png" alt="">
          <p>儿童</p>
        </li>
        <li @click="goWinCustomer(1)">
          <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/nav-2.png" alt="">
          <p>青少年</p>
        </li>
        <li @click="goWinCustomer(2)">
          <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/nav-3.png" alt="">
          <p>中青年</p>
        </li>
        <li @click="goWinCustomer(3)">
          <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/nav-4.png" alt="">
          <p>老年</p>
        </li>
      </ul>
      <div class="fodder">
        <img @click="goFodderPage(2)" src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/fodder-1.png" alt="">
        <img @click="goFodderPage(1)" src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/fodder-2.png" alt="">
      </div>
      <div class="tips">
        <p class="title">
          最新提醒
        </p>
        <div class="content">
          <div
            class="item"
            @click="goSendMorePage(0)"
          >
            <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/tips-1.png">
            <div class="data">
              <p>群发提醒</p>
              <p class="num"><i>{{ sopTips.unreadCount }}</i>/{{ sopTips.allCount }}</p>
            </div>
          </div>
          <div
            class="item"
            @click="goSendMorePage(1)"
          >
            <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/tips-2.png">
            <div class="data">
              <p>朋友圈发送提醒</p>
              <p class="num"><i>{{ friendTips.unreadCount }}</i>/{{ friendTips.allCount }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import LoginPage from '../login/index'
import { home as homeApi } from '@/api'
export default {
  name: 'Index',
  components: {
    LoginPage
  },
  data () {
    return {
      boardData: {
        rank: 0,
        newAddNum: 10,
        todayCount: 0,
        yesterdayCount: 0,
        todayUp: true,
        yesterdayUp: true
      },
      sopTips: {
        allCount: 0,
        unreadCount: 0
      },
      friendTips: {
        allCount: 0,
        unreadCount: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      info: 'user/info',
      isLogin: 'user/isLogin'
    })
  },
  watch: {
    isLogin() {
      this.initTabBar()
    }
  },
  mounted () {
    this.initTabBar()
  },
  methods: {
    goSendMorePage(type) {
      uni.navigateTo({
        url: `/pages/moreSend/index?type=${type}`
      })
    },
    goFodderPage(id) {
      uni.navigateTo({
        url: `/pages/fodder/index?id=${id}`
      })
    },
    initTabBar() {
      // 初始化数据
      if (this.isLogin) {
        uni.showTabBar()
        uni.setNavigationBarTitle({
          title: '首页'
        })
        this.initHomeData()
      } else {
        uni.hideTabBar()
        uni.setNavigationBarTitle({
          title: '员工绑定'
        })
      }
    },
    initHomeData() {
      // 初始化主页的数据
      homeApi.getRank().then(({ rank }) => {
        if (rank) {
          this.boardData.rank = rank
        }
      })
      homeApi.getNewAdd(({
        newAddCount,
        todayCount,
        todayUp,
        yesterdayCount,
        yesterdayUp
      }) => {
        if (newAddCount) {
          this.boardData.newAddNum = parseInt(newAddCount)
          this.boardData.todayCount = parseInt(todayCount)
          this.boardData.yesterdayCount = parseInt(yesterdayCount)
          this.boardData.yesterdayUp = yesterdayUp
          this.boardData.todayUp = todayUp
        }
      })
      homeApi.getSopTips().then(({ allCount, unreadCount }) => {
        if (allCount) {
          this.sopTips.allCount = parseInt(allCount)
          this.sopTips.unreadCount = parseInt(unreadCount)
        }
      })

      homeApi.getFriendTips().then(({ allCount, unreadCount }) => {
        if (allCount) {
          this.friendTips.allCount = parseInt(allCount)
          this.friendTips.unreadCount = parseInt(unreadCount)
        }
      })
    },
    editUser() {
      uni.navigateTo({
        url: '/pages/edit/index'
      })
    },
    scanCode() {
      uni.scanCode({
        onlyFromCamera: false,
        scanType: ['barCode', 'qrCode', 'datamatrix', 'pdf417'],
        success(result) {
          uni.showToast({
            title: JSON.stringify(result),
            icon: 'none'
          })
        }
      })
    },
    goQRCodePage() {
      uni.showToast({
        title: '跳转二维码页面',
        icon: 'none'
      })
    },
    goWinCustomer(key) {
      uni.navigateTo({
        url: `/pages/winCustomer/index?tab=${key}`
      })
    }
  }
}
</script>

<style lang="scss">
.index-box {
  height: 100vh;
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/home-bg.png') no-repeat;
  background-size: 100% 100%;
}
.user {
  padding: 60rpx 39rpx;
  .intr {
    display: inline-block;
    margin-left: 30rpx;
    margin-top: 34rpx;
    p {
      font-size: 44rpx;
      font-weight: 500;
      color: #fff;
      line-height: 50rpx;
    }
    .title {
      font-size: 24rpx;
      line-height: 30rpx;
    }
  }
  .handle {
    float: right;
    .icon {
      margin-left: 20rpx;
      font-size: 60rpx;
      color: #fff;
      line-height: 80rpx;
    }
  }
  img {
    vertical-align: top;
    width: 148rpx;
    height: 148rpx;
    border-radius: 50%;
  }
}
.board {
  position: relative;
  border-radius: 10rpx;
  margin: 0 20rpx;
  background-color: #fff;
  padding: 56rpx 0 90rpx;
  display: flex;
  .search {
    line-height: 50rpx;
    position: absolute;
    top: 20rpx;
    right: 0;
    width: 50rpx;
    text-align: center;
    font-weight: bold;
    color: #3d64d9;
    border-radius: 25rpx 0 0 25rpx;
    background-color: #dee8fd;
  }
  .item {
    position: relative;
    flex: 1;
    text-align: center;
    p {
      font-size: 24rpx;
      color: #5f5f5f;
      margin-bottom: 22rpx;
    }
    span {
      color: #000;
      font-size: 74rpx;
      font-weight: bold;
      color: #5dc096;
    }
    .data {
      margin-left: 30rpx;
      display: inline-block;
      i {
        position: relative;
        line-height: 24rpx;
        font-size: 18rpx;
        display: block;
        font-style: normal;
        color: #969696;
        span {
          display: inline-block;
        }
      }
      .down::after {
        content: '';
        position: absolute;
        top: 60%;
        right: -30rpx;
        transform: translateY(-50%);
        border: 10rpx solid transparent;
        border-top-color: #35baa0;
      }
      .up::after {
        content: '';
        position: absolute;
        top: 25%;
        right: -30rpx;
        transform: translateY(-50%);
        border: 10rpx solid transparent;
        border-bottom-color: #35baa0;
      }
    }
  }
}
.nav {
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 0;
  background-color: #fff;
  border-radius: 10rpx;
  text-align: center;
  margin-bottom: 72rpx;
  li {
    vertical-align: top;
    display: inline-block;
    font-size: 26rpx;
    width: 25%;
    margin-bottom: 60rpx;
    img {
      height: 80rpx;
      width: 80rpx;
    }
    p {
      color: #5f5f5f;
      margin-top: 27rpx;
    }
  }
}
.fodder {
  padding: 0 38rpx;
  display: flex;
  justify-content: space-between;
  margin-bottom: 59rpx;
  img {
    width: 329rpx;
    height: 163rpx;
  }
}
.tips {
  padding: 0 30rpx;
  .title {
    position: relative;
    width: 100%;
    line-height: 40rpx;
    font-size: 30rpx;
    text-align: left;
    color: #10110f;
    margin-bottom: 60rpx;
  }
  .content {
    position: relative;
    display: flex;
    .item {
      flex: 1;
      padding: 0 20rpx;
      display: flex;
      img {
        width: 84rpx;
        height: 84rpx;
        margin-right: 20rpx;
      }
      .data {
        font-size: 26rpx;
        text-align: left;
        color: #5f5f5f;
        .num {
          font-size: 48rpx;
          color: #8b919b;
          font-weight: bold;
        }
        i {
          display: inline-block;
          font-style: normal;
          color: #6eb998;;
        }
      }

    }
  }
}
</style>
