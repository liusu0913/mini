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
              <span
                class="icon icon-edit"
                @click="editUser"
              />
            </p>
            <p class="title">
              {{ info.title }}
            </p>
          </div>
          <div class="handle">
            <span
              class="icon icon-scan"
              @click="scanCode"
            />
            <span class="icon icon-qrcode" />
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
        <span class="icon icon-wenhao search" />
      </div>
      <ul class="nav">
        <li @click="goWinCustomer('儿童')">
          <span class="icon icon-schroll" />
          <p>儿童</p>
        </li>
        <li @click="goWinCustomer('青少年')">
          <span class="icon icon-gift" />
          <p>青少年</p>
        </li>
        <li @click="goWinCustomer('中青年')">
          <span class="icon icon-shopping" />
          <p>中青年</p>
        </li>
        <li @click="goWinCustomer('老年')">
          <span class="icon icon-account" />
          <p>老年</p>
        </li>
        <li @click="goFodderPage(1)">
          <span class="icon icon-firendCircle" />
          <p>朋友圈</p>
        </li>
        <li @click="goFodderPage(2)">
          <span class="icon icon-dialogue" />
          <p>营销话术</p>
        </li>
      </ul>
      <div class="tips">
        <p class="title">
          最新提醒
          <span class="icon icon-wenhao search" />
        </p>
        <div class="content">
          <div
            class="item"
            @click="goSendMorePage(0)"
          >
            <img src="../../static/icons/client.png">
            <div class="data">
              <p><i>{{ sopTips.unreadCount }}</i>/{{ sopTips.allCount }}<span class="icon icon-triangle" /></p>
              <p>群SOP提醒</p>
            </div>
          </div>
          <div
            class="item"
            @click="goSendMorePage(1)"
          >
            <img src="../../static/icons/friend.png">
            <div class="data">
              <p><i>{{ friendTips.unreadCount }}</i>/{{ friendTips.allCount }}<span class="icon icon-triangle" /></p>
              <p>朋友圈发送提醒</p>
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
  background-color: #efeff9;
  height: 100vh;
}
.user {
  background-color: #2f63ef;
  padding: 50rpx 30rpx;
  .intr {
    display: inline-block;
    margin-left: 20rpx;
    p {
      line-height: 40rpx;
      margin: 0;
      padding: 0;
      font-size: 30rpx;
      color: #fff;
      .icon {
        margin-left: 20rpx;
        font-size: 30rpx;
        line-height: 40rpx;
      }
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
    width: 80rpx;
    height: 80rpx;
    background-color: #fff;
    border-radius: 10rpx;
  }
}
.board {
  position: relative;
  border-radius: 10rpx;
  margin: 20rpx 0;
  background-color: #fff;
  padding: 30rpx;
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
      font-size: 40rpx;
      color: #b2b2b5;
    }
    span {
      color: #000;
      font-size: 80rpx;
      font-weight: bold;
    }
    .data {
      margin-left: 30rpx;
      display: inline-block;
      i {
        position: relative;
        line-height: 40rpx;
        font-size: 20rpx;
        display: block;
        font-style: normal;
        color: #b2b2b2;
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
        border: 12rpx solid transparent;
        border-top-color: #35baa0;
      }
      .up::after {
        content: '';
        position: absolute;
        top: 40%;
        right: -30rpx;
        transform: translateY(-50%);
        border: 12rpx solid transparent;
        border-bottom-color: #35baa0;
      }
    }

  }
  .ranking::after {
    content: '';
    position: absolute;
    width: 2rpx;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #ccc;
  }
}
.nav {
  margin: 0;
  padding: 30rpx 0;
  list-style: none;
  font-size: 0;
  background-color: #fff;
  border-radius: 10rpx;
  li {
    display: inline-block;
    font-size: 30rpx;
    margin: 0;
    padding: 0;
    width: 25%;
    text-align: center;
    margin-bottom: 60rpx;
    .icon {
      font-size: 80rpx;
      color: #404040;
    }
    p {
      color: #535353;
      margin-top: 20rpx;
    }
  }
}
.tips {
  border-radius: 10rpx;
  margin: 20rpx 0;
  background-color: #fff;
  padding: 30rpx;
  .title {
    position: relative;
    width: 100%;
    height: 40rpx;
    line-height: 40rpx;
    font-size: 30rpx;
    .search {
      line-height: 50rpx;
      position: absolute;
      top: 0rpx;
      right: -30rpx;
      width: 50rpx;
      text-align: center;
      font-weight: bold;
      color: #3d64d9;
      border-radius: 25rpx 0 0 25rpx;
      background-color: #dee8fd;
    }
  }
  .content {
    position: relative;
    display: flex;
    padding: 20rpx 0 20rpx;
    margin-top: 30rpx;
    .item {
      flex: 1;
      padding: 0 20rpx;
      display: flex;
      img {
        width: 100rpx;
        height: 100rpx;
        margin-right: 20rpx;
      }
      .data {
        line-height: 50rpx;
        font-size: 26rpx;
        i {
          display: inline-block;
          font-style: normal;
          color: #406ace;
          line-height: 50rpx;
        }
        .icon {
          margin-left: 10rpx;
          font-size: 26rpx;
          line-height: 50rpx;
        }
      }

    }
  }
  .content::after {
    content: "";
    position: absolute;
    left: 50%;
    margin-left: -1rpx;
    height: 100rpx;
    width: 2rpx;
    background-color: #ccc;
  }

}
</style>
