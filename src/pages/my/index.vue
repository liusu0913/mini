<template>
  <view class="container">
    <view class="client">
      <e-tab
        :active-tab="currentTab"
        :tab-list="tabList"
        @change="chanegTab"
      />
      <view class="content">
        <ul
          v-if="currentTab === 0"
          class="nav"
        >
          <li @click="goUserListPage(0)">
            <img class="icon" src="../../static/img/client3.png" alt="">
            <span class="txt">推荐跟进用户</span>
            <img class="go" src="../../static/img/go.png" alt="">
          </li>
          <li @click="goUserListPage(1)">
            <img class="icon" src="../../static/img/client2.png" alt="">
            <span class="txt">留资用户</span>
            <img class="go" src="../../static/img/go.png" alt="">
          </li>
          <li @click="goUserListPage(2)">
            <img class="icon" src="../../static/img/client1.png" alt="">
            <span class="txt">高传播力用户</span>
            <img class="go" src="../../static/img/go.png" alt="">
          </li>
        </ul>
        <view
          v-if="currentTab === 1"
          class="list"
        >
          <div class="search">
            <div class="input">
              <img
                src="../../static/img/search.png"
                @click="beginSearch"
              />
              <input
                v-model="filterRules"
                confirm-type="search"
                placeholder="请输入用户名称"
              >
            </div>
          </div>
          <div class="head">
            <p @click="clickChoseTime">
              {{ timeChooseMap[currentChooseTime] }}
              <span
                class="icon icon-down-arrows"
              />
            </p>
            <ul v-if="timeChooseShow">
              <li
                v-for="(item, index) in timeChooseMap"
                :key="index"
                @click="chooseFilterTime(index)"
              >
                {{ item }}
              </li>
            </ul>
          </div>
          <mescroll-body
            ref="mescrollRef"
            :down="downOption"
            @init="mescrollInit"
            @up="getUserList"
          >
            <div
              v-for="(item, i) in userList"
              :key="i"
              class="card"
              @click="goUserInfoPage(item)"
            >
              <wxUser :item="item"></wxUser>
            </div>
          </mescroll-body>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import eTab from '../../components/tab/index'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import wxUser from '../../components/wxUserItem/index'
import { getUser } from '@/api'

export default {
  components: {
    eTab,
    mescrollBody,
    wxUser
  },
  mixins: [MescrollMixin],
  data() {
    return {
      isSearch: false,
      userList: [],
      listCount: 20,
      pagesize: 20,
      offset: 0,
      isLoading: false,
      downOption: {
        use: false,
        auto: false,
        textNoMore: '--- 到底了 ---'
      },
      timeChooseShow: false,
      timeChooseMap: ['最后访问时间', '最早访问时间'],
      currentChooseTime: 0,
      filterRules: '',
      currentTab: 0,
      tabList: ['智能推荐', '全部用户']
    }
  },
  watch: {
    currentChooseTime() {
      this.filterUserList()
    },
    filterRules() {
      if (!this.filterRules) {
        this.isSearch = false
        this.offset = 0
        this.userList = []
        this.getUserList()
      }
    }
  },
  methods: {
    getHour(time) {
      const spaceTime = new Date().getTime() - new Date(time).getTime()
      return Math.floor( spaceTime / 1000 / 60 / 60)
    },
    callPhone(item) {
      uni.makePhoneCall({
        phoneNumber: `${item.phone}` // 仅为示例
      })
    },
    goUserInfoPage(item) {
      uni.navigateTo({
        url: `/pages/user/info?id=${item.openId}`
      })
    },
    filterUserList() {
      if (!this.currentChooseTime) {
        this.userList.sort((a, b) => {
          return a.time - b.time
        })
      } else {
        this.userList.sort((a, b) => {
          return b.time - a.time
        })
      }
    },
    getUserList() {
      if (this.isLoading || this.userList.length === this.listCount) return
      this.isLoading = true
      const sendData = {
        count: this.pagesize,
        offset: this.offset
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      }
      getUser.list(sendData).then(data => {
        if (data.list) {
          if (this.offset) {
            this.userList = this.userList.concat(data.list)
          } else {
            this.userList = data.list
          }
          this.filterUserList()
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          this.mescroll.endSuccess(this.userList.length, this.userList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
    },
    chooseFilterTime(index) {
      this.currentChooseTime = index
      this.timeChooseShow = false
    },
    clickChoseTime() {
      this.timeChooseShow = !this.timeChooseShow
    },
    chanegTab(index) {
      this.currentTab = index
    },
    goUserListPage(index) {
      uni.navigateTo({
        url: `/pages/user/list?type=${index}`
      })
    },
    beginSearch() {
      if (this.filterRules) {
        this.isSearch = true
        this.offset = 0
        this.userList = []
        this.getUserList()
      }
      
    }
  }
}
</script>

<style lang="scss" scope>
.container {
  box-sizing: border-box;
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
  background-size: 100% 100%;
  padding: 0 15rpx;
  height: 100vh;
}
.client {
  box-sizing: border-box;
  height: 100%;
  background-color: #fff;
  border-radius: 10rpx;
  padding: 0 10rpx;
  .nav {
    list-style: none;
    margin: 0;
    padding: 0;
    margin-top: 40rpx;
    li {
      display: flex;
      margin: 0;
      padding: 0;
      background-color: #f7f9fd;
      line-height: 74rpx;
      padding: 42rpx 54rpx;
      margin-bottom: 20rpx;
      border-radius: 10rpx;
      .icon {
        width: 74rpx;
        height: 74rpx;
        vertical-align: top;
        margin-right: 33rpx;
      }
      .go {
        vertical-align: top;
        width: 22rpx;
        height: 37rpx;
        margin-top: 18rpx;
      }
      .txt {
        flex: 1;
        font-size: 28rpx;
        font-weight: 400;
        text-align: left;
        color: #606060;
      }
      .flag {
        text-align: center;
        width: 100rpx;
        height: 100rpx;
        border-radius: 50%;
        font-size: 30rpx;
        font-weight: bold;
        color: #fff;
        margin-right: 20rpx;
      }
      .one {
        background-color: #ec5381;
      }
      .two {
        background-color: #f4af4c;
      }
      .three {
        background-color: #5fd1c7;
      }
    }
  }
}
.head {
  position: relative;
  padding: 0 20rpx;
  line-height: 80rpx;
  background-color: #fff;
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  p {
    font-size: 28rpx;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #606060;
    .icon {
      margin-left: 20rpx;
    }
  }
  ul {
    position: absolute;
    background-color: rgba(0,0,0,.6);
    border-radius: 10rpx;
    z-index: 9999;
    li {
      color: #fff;
      padding: 0 20rpx;
      height: 50rpx;
      line-height: 50rpx;
      font-size: 30rpx;
      border-radius: 10rpx;
      border-bottom: 1rpx solid #ccc;
    }
  }
}
.search {
  margin: 40rpx;
  background-color: #f7f9fd;
  border-radius: 10rpx;
  display: flex;
  overflow: hidden;
  .input {
    flex: 1;
    position: relative;
    img {
      position: absolute;
      top: 50%;
      left: 20rpx;
      margin-top: -22rpx;
      width: 44rpx;
      height: 44rpx;
    }
    input {
      height: 94rpx;
      line-height: 94rpx;
      font-size: 28rpx;
      padding-left: 80rpx;
      background-color: #efeff9;
    }
  }
  .collect {
    margin-left: 20rpx;
    line-height: 70rpx;
    font-size: 26rpx;
    color: #2e63ef;
    .icon {
      color: #000;
      font-size: 30rpx;
      margin-right: 10rpx;
    }
  }

}
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
      margin-left: 40rpx;
      p {
        margin: 0;
        padding: 0;
      }
      .name {
        display: inline-block;
        font-size: 30rpx;
        color: #494949;
        line-height: 108rpx;
        font-weight: bold;
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
