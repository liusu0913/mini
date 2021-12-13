<template>
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
          <div class="flag one">
            推荐
          </div>
          <span class="txt">推荐跟进用户</span>
          <span class="icon"> ></span>
        </li>
        <li @click="goUserListPage(1)">
          <div class="flag two">
            推荐
          </div>
          <span class="txt">推荐跟进用户</span>
          <span class="icon"> ></span>
        </li>
        <li @click="goUserListPage(2)">
          <div class="flag three">
            推荐
          </div>
          <span class="txt">推荐跟进用户</span>
          <span class="icon"> ></span>
        </li>
      </ul>
      <view
        v-if="currentTab === 1"
        class="list"
      >
        <div class="search">
          <div class="input">
            <span
              class="icon icon-search"
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
          <view
            v-for="item in userList"
            :key="item.id"
            class="card"
            @click="goUserInfoPage(item)"
          >
            <img :src="item.img">
            <view class="user">
              <p class="name">
                {{ item.name }}
                <span>{{ item.tag }}</span>
              </p>
              <p class="last-time">
                最后访问时间：{{ item.lastTime }}
              </p>
            </view>
          </view>
        </mescroll-body>
      </view>
    </view>
  </view>
</template>

<script>
import eTab from '../../components/tab/index'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getUser } from '@/api'

export default {
  components: {
    eTab,
    mescrollBody
  },
  mixins: [MescrollMixin],
  data() {
    return {
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
        this.beginSearch()
      }
    }
  },
  methods: {
    goUserInfoPage(item) {
      uni.navigateTo({
        url: `/pages/user/info?id=${item.id}`
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
        pagesize: this.pagesize,
        offset: this.offset
      }
      if (this.filterRules) {
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
      this.offset = 0
      this.userList = []
      this.getUserList()
    }
  }
}
</script>

<style lang="scss" scope>
.client {
  min-height: 100vh;
  background-color: #efeff9;
  .nav {
    list-style: none;
    margin: 0;
    padding: 0;
    padding: 0 20rpx;
    .txt {
      flex: 1;
    }
    li {
      display: flex;
      margin: 0;
      padding: 0;
      margin-top: 30rpx;
      padding: 50rpx;
      background-color: #fff;
      line-height: 100rpx;
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
  border-bottom: 2rpx solid #ccc;
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  p {
    color: #2e63ee;
    font-size: 30rpx;
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
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  display: flex;
  .input {
    flex: 1;
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 20rpx;
      font-size: 40rpx;
      font-weight: bold;
      line-height: 70rpx;
    }
    input {
      font-size: 30rpx;
      padding-left: 70rpx;
      height: 70rpx;
      background-color: #efeff9;
      border-radius: 40rpx;
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
  padding: 30rpx 20rpx;
  display: flex;
  background-color: #fff;
  border-bottom: 2rpx solid #efeff9;
  img {
    width: 100rpx;
    height: 100rpx;
    border-radius: 50%;
    margin-right: 20rpx;
  }
  .user {
    flex: 1;
    .name {
      width: 100%;
      font-size: 40rpx;
      color: #000;
      overflow:hidden; //超出的文本隐藏
      text-overflow:ellipsis; //溢出用省略号显示
      white-space:nowrap;
      span {
        margin-left: 20rpx;
        font-size: 26rpx;
        padding: 6rpx 10rpx;
        background-color: #f0f0f0;
        color: #a3a3a3;
        border-radius: 10rpx;
      }
    }
    .last-time {
      font-size: 30rpx;
      color: #a9a9a9;
    }
  }
}

</style>
