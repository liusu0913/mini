<template>
  <div class="customer-box">
    <div class="board">
      <p class="title">
        数据概览
        <span>每小时更新数据</span>
      </p>
      <ul class="time">
        <li
          v-for="item in timeArr"
          :key="item.key"
          :class="{
            'active': currentChooseTime === item.key
          }"
          @click="changeTime(item)"
        >
          {{ item.text }}
        </li>
      </ul>
      <div class="content">
        <div class="item">
          <p>分享内容数</p>
          {{ parseInt(activeData.shareNum) }}
        </div>
        <div class="item">
          <p>分享内容数</p>
          {{ parseInt(activeData.visitNum) }}
        </div>
        <div class="item">
          <p>分享内容数</p>
          {{ parseInt(activeData.allNum) }}
        </div>
      </div>
    </div>
    <div class="search">
      <div class="input">
        <span
          class="icon icon-search"
          @click="beginSearch"
        />
        <input
          v-model="filterRules"
          confirm-type="search"
          placeholder="请输入内容的标题或者分享文案"
        >
      </div>
    </div>
    <div class="items">
      <eTab
        v-if="!isSearch"
        :active-tab="currentTab"
        :tab-list="tabList"
        @change="chanegTab"
      />
      <div
        v-if="!isSearch"
        class="one-tags"
      >
        <span
          v-for="tag in oneTags"
          :key="tag.id"
          :class="{
            'tag': true,
            'active': tag.id === currentOneTag
          }"
          @click="changeOneTag(tag)"
        >{{ tag.title }}</span>
      </div>
      <div
        v-if="!isSearch"
        class="two-tags"
      >
        <span
          v-for="tag in twoTags"
          :key="tag.id"
          :class="{
            'tag': true,
            'active': tag.id === currentTwoTag
          }"
          @click="changeTwoTag(tag)"
        >{{ tag.title }}</span>
      </div>
      <mescroll-body
        ref="mescrollRef"
        :down="downOption"
        @init="mescrollInit"
        @up="getActiveList"
        class="list"
      >
        <div
          class="item"
          v-for="item in activeList"
          :key="item.id"
        >
          <div
            class="content"
            @click="goActivePage"
          >
            <img
              :src="item.img"
              alt=""
            >
            <div class="intr">
              <p class="title">
                {{ item.title }}
              </p>
              <p class="time">
                {{ item.time }}
              </p>
              <p class="share">
                <span>{{ parseInt(item.shareCount) }}人分享</span>
                <span>{{ parseInt(item.visitCount) }}人浏览</span>
                <span>获客{{ parseInt(item.getClient) }}人</span>
              </p>
              <p class="tag">
                <span
                  v-for="(tag, index) in item.tags"
                  :key="index"
                >{{ tag }}</span>
              </p>
            </div>
            <p class="share-icon" @click.stop="sharePeople">
              <img src="../../static/img/share.png" alt="">
              <span>分享</span>
            </p>
          </div>
        </div>
      </mescroll-body>
    </div>
  </div>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import eTab from '../../components/tab/index'
import { getClient } from '@/api'

export default {
  components: {
    eTab,
    mescrollBody
  },
  mixins: [MescrollMixin],
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.currentTab = Number(currentPage.options.tab) 
  },
  data() {
    return {
      isLoading: false,
      downOption: {
        use: false,
        auto: false,
        textNoMore: '--- 到底了 ---'
      },
      listCount: 20,
      pagesize: 20,
      offset: 0,
      isSearch: false,
      filterRules: '',
      currentChooseTime: '0',
      currentOneTag: 0,
      currentTwoTag: -1,
      currentTab: 0,
      isFilterCollect: false,
      oneTags: [ {
        id: 0,
        title: '皮肤'
      }, {
        id: 1,
        title: '牙齿'
      }, {
        id: 2,
        title: '眼睛'
      }, {
        id: 3,
        title: '头发'
      }],
      twoTags: [],
      activeList: [],
      tabList: [
        {key: 0, title: '儿童'},
        {key: 1, title: '青少年'},
        {key: 2, title: '中青年'},
        {key: 3, title: '老年'}
      ],
      activeData: {
        allNum: 0,
        shareNum: 0,
        visitNum: 0
      },
      timeArr: [{
        key: '0',
        text: '今日'
      }, {
        key: '-1',
        text: '昨日'
      }, {
        key: '7',
        text: '近7日'
      }, {
        key: 'all',
        text: '累计'
      }]
    }
  },
  watch: {
    filterRules(value) {
      if (value === '') {
        this.isSearch = false
        this.getActiveList()
      }
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    sharePeople() {
      uni.showToast({
        title: '吊起后端服务，发送公众号通知',
        icon: 'none'
      })
    },
    goActivePage() {
      uni.navigateTo({
        url: '/pages/active/index'
      })
    },
    initPage() {
      this.getTwoTags()
      this.getActiveData()
    },
    getActiveData() {
      getClient.getActiveData({
        day: this.currentChooseTime === 'all' ? '' : this.currentChooseTime
      }).then(data => {
        this.activeData = data
      })
    },
    changeOneTag(tag) {
      this.currentOneTag = tag.id
      this.offset = 0
      this.activeList = []
      this.getTwoTags()
      this.getActiveList()
    },
    changeTwoTag(tag) {
      this.currentTwoTag = tag.id
      this.offset = 0
      this.activeList = []
      this.getActiveList()
    },
    chanegTab(index) {
      this.currentTab = index
      this.offset = 0
      this.activeList = []
      this.getTwoTags()
      this.getActiveList()
    },
    changeTime(item) {
      this.currentChooseTime = item.key
      this.getActiveData()
    },
    beginSearch() {
      this.isSearch = true
      this.offset = 0
      this.activeList = []
      this.getActiveList()
    },
    getActiveList() {
      if (this.isLoading || this.activeList.length === this.listCount) return
      this.isLoading = true
      const sendData = {
        pagesize: this.pagesize,
        offset: this.offset
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      } else {
        sendData.tab = this.tabList[this.currentTab].key 
        sendData.tag = this.currentOneTag
        if (this.currentTwoTag !== -1) {
          sendData.twoTag = this.currentTwoTag
        }
      }
      getClient.getActiveList(sendData).then(data => {
        if (data.list) {
          if (this.offset) {
            this.activeList = this.activeList.concat(data.list)
          } else {
            this.activeList = data.list
          }
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          this.mescroll.endSuccess(this.activeList.length, this.activeList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
    },
    getTwoTags() {
      // 先初始化在请求
      this.currentTwoTag = -1
      getClient.getTags({
        tabId: this.currentTab,
        tagId: this.currentOneTag
      }).then(data => {
        if (data.list) {
          this.twoTags = data.list
          this.twoTags.unshift({
            id: -1,
            title: '全部'
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.customer-box {
  box-sizing: border-box;
  height: 100vh;
  background: url('../../static/img/bg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 30rpx;
}
.items {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  .one-tags, .two-tags {
    min-height: 100%;
    padding: 32rpx 34rpx;
    font-size: 0;
    white-space: nowrap;
    overflow: auto;
    border-bottom: 1px solid #efeff9;
    .tag {
      vertical-align: top;
      box-sizing: border-box;
      display: inline-block;
      font-size: 22rpx;
      line-height: 54rpx;
      padding: 0 30rpx;
      min-width: 158rpx;
      text-align: center;
      color: #969696;
      margin-right: 17rpx;
      border-radius: 30rpx;
      background-color: #c5efe0;
    }
    .active {
      background-color: #6fca95;
      color: #fff;
    }
  }
  .two-tags {
    border: none;
    .tag {
      box-sizing: border-box;
      border: 1rpx solid #f0f2f4;
      color: #969696;
      background-color: #fff;
    }
    
    .active {
      background-color: #f0f2f4;
    }
  } 
  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    padding: 0 34rpx;
    .item {
      margin: 0;
      padding: 0;
      padding: 16rpx;
      background-color: #f7f9fd;
      margin-bottom: 16rpx;
      .content {
        display: flex;
        .share-icon {
          width: 90rpx;
          font-size: 0;
          height: 172rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            display: inline-block;
            font-size: 24rpx;
            line-height: 27rpx;
          }
          img {
            margin: 0;
            vertical-align: top;
            width: 27rpx;
            height: 27rpx;
            margin-right: 10rpx;
          }
        }
        img {
          width: 172rpx;
          height: 172rpx;
          margin-right: 22rpx;
        }
        .intr {
          flex: 1;
          p {
            max-width: 360rpx;
            margin: 0;
            padding: 0;
            color: #969696;
            line-height: 30rpx;
            font-size: 20rpx;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
          }
          .title {
            font-size: 30rpx;
            line-height: 28rpx;
            margin-bottom: 13rpx;
            font-weight: bold;
            line-height: 40rpx;
            color: #111110;
          }
          .share {
            span {
              position: relative;
              margin-right: 10px;
            }
            span:first-child::after {
              content: "";
              position: absolute;
              width: 0;
            }
            span::after {
              content: "";
              position: absolute;
              top: 5rpx;
              left: -10rpx;
              height: 20rpx;
              width: 2rpx;
              background-color: #ccc;
            }
          }
          .tag {
            span {
              box-sizing: border-box;
              text-align: center;
              min-width: 105rpx;
              height: 36rpx;
              margin-top: 15rpx;
              padding: 0rpx 10rpx;
              margin-right: 20rpx;
              color: #fff;
              display: inline-block;
              background-color: #6fca95;
              border-radius: 18rpx;
            }
          }
        }
      }
    }
  }

}
.search {
  background-color: #f7f9fd;
  margin: 0 45rpx 24rpx;
  border-radius: 10rpx;
  display: flex;
  overflow: hidden;
  .input {
    flex: 1;
    position: relative;
    .icon {
      position: absolute;
      top: 0;
      left: 20rpx;
      font-size: 50rpx;
      font-weight: bold;
      line-height: 94rpx;
      color: #6ec995;
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
.board {
  color: #5c616a;
  background-color: #fff;
  padding: 30rpx 10rpx 50rpx;
  overflow: hidden;
  margin: 20rpx 30rpx;
  border-radius: 10rpx;
  .title {
    padding: 0 30rpx;
    font-size: 30rpx;
    font-weight: 400;
    color: #111110;
    span {
      float: right;
      font-size: 24rpx;
      font-weight: 400;
      color: #606060;
    }
  }
  .content {
    display: flex;
    .item {
      flex: 1;
      text-align: center;
      font-weight: bold;
      color: #6ec995;
      font-size: 74rpx;
      line-height: 74rpx;
      p {
        line-height: 24rpx;
        font-size: 24rpx;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: center;
        color: #606060;
        margin-bottom: 13rpx;
      }
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0;
    border-radius: 25rpx;
    height: 80rpx;
    text-align: center;
    background-color: #f5f8fc;
    margin: 45rpx 0;
    li {
      display: inline-block;
      vertical-align: top;
      height: 100%;
      width: 25%;
      border-radius: 25rpx;
      line-height: 30rpx;
      font-size: 26rpx;
      line-height: 80rpx;
      color: #111110;
    }
    li.active {
      color: #fff;
      background-color: #6ec995;
    }
  }
}
</style>
