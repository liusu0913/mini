<template>

  <div>
    <div
      class="index-box"
    >
      <header class="header">
        <div class="user">
          <img :src="info.avatar" @click="editUserMsg">
          <div class="intr">
            <p class="name">
              {{ info.name }}
            </p>
            <p class="title">
              {{ info.title }}
            </p>
          </div>
        </div>
        <img class="company-logo" :src="info.company.logo" alt="">
      </header>
      <div class="board">
        <div class="user-number item">
          <p>用户数</p>
          <span>{{ boardData.total }}</span>
          <div class="data">
            <i :class="[`${boardData.today ? 'up' : ''}`]">今日 {{ boardData.today }}</i>
            <i :class="[`${boardData.yesterday ? 'up' : ''}`]">昨日 {{ boardData.yesterday }}</i>
          </div>
        </div>
        <div class="ranking item">
          <p>今日排名</p>
          <span>{{ boardData.rank }}</span>
        </div>
      </div>
      <ul class="nav">
        <li v-for="nav in navList" @click="goWinCustomer(nav.id)" :key="nav.id">
          <img :src="nav.url" />
          <p>{{nav.nav}}</p>
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
            @click="goSendMorePage(1)"
          >
            <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/tips-1.png">
            <div class="data">
              <p>群发提醒</p>
              <p class="num"><i>{{ sopTips.moreSend.unread }}</i>/{{ sopTips.moreSend.all }}</p>
            </div>
          </div>
          <div
            class="item"
            @click="goSendMorePage(2)"
          >
            <img src="https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/tips-2.png">
            <div class="data">
              <p>朋友圈发送提醒</p>
              <p class="num"><i>{{ sopTips.friend.unread }}</i>/{{ sopTips.friend.all }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { home as homeApi, getTags, user } from '@/api'
import { mapMutations } from 'vuex'

export default {
  name: 'Index',
  data () {
    return {
      navList: [],
      boardData: {
        rank: '-',
        today: 0,
        yesterday: 0,
        total: 0
      },
      sopTips: {
        moreSend: {
          all: 0,
          unread: 0
        },
        friend: {
          all: 0,
          unread: 0
        }
      },
      openId: ''
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
  onShow () {
    if (!this.isLogin) {
      uni.navigateTo({
        url: '/pages/login/index'
      })
    }
    this.initTabBar()
  },
  methods: {
    ...mapMutations({
      setUserInfo: 'user/setUserInfo',
      setUserLogin: 'user/setUserLogin'
    }),
    editUserMsg() {
      uni.navigateTo({
        url: '/pages/edit/index'
      })
    },
    goSendMorePage(type) {
      homeApi.readSopTips({
        type
      }).then(() => {
        uni.navigateTo({
          url: `/pages/moreSend/index?type=${type}`
        })
      })
    },
    goFodderPage(type) {
      uni.navigateTo({
        url: `/pages/fodder/index?type=${type}`
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
      user.info().then((data) => {
        this.setUserInfo(data)
        if (!data.openId) {
          uni.navigateTo({
            url: '/pages/auto/index'
          })
        }
      })
      // 初始化导航
      getTags.list({
        count: 100,
        offset: 0,
        fatherId: 0,
        type: '1'
      }).then(res => {
        this.navList = []
        res.list.forEach(item => {
          this.navList.push({
            nav: item.name,
            id: item.id,
            url: item.icon
          })
        })
      })
      // 初始化主页的数据
      homeApi.getRank().then((res) => {
        if (res.rank && res.rank <= 100) {
          this.boardData.rank = res.rank
        } else {
          this.boardData.rank = '-'
        }
      })
      homeApi.getNewAdd().then(res => {
        this.boardData.today = res.today
        this.boardData.yesterday = res.yesterday
        this.boardData.total = res.total || 0
      })
      // 获取首页的提醒消息
      homeApi.getSopTips().then((res) => {
        this.sopTips = res
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
header {
  position: relative;
}
.user {
  padding: 60rpx 39rpx;
  .intr {
    display: inline-block;
    margin-left: 30rpx;
    margin-top: 34rpx;
    p {
      font-size: 36rpx;
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
.company-logo {
  position: absolute;
  top: 60rpx;
  right: 39rpx;
  width: 256rpx;
  display: inline-block;
  height: 148rpx;
  overflow: auto;
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
