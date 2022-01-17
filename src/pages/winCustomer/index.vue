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
          {{ parseInt(activeData.share) || 0 }}
        </div>
        <div class="item">
          <p>浏览人数</p>
          {{ parseInt(activeData.pv) || 0 }}
        </div>
        <div class="item">
          <p>分享量</p>
          {{ parseInt(activeData.shareActiveCount) || 0 }}
        </div>
      </div>
    </div>
    <div class="search">
      <div class="input">
        <img
          src="../../static/img/search.png"
          @click="beginSearch"
        />
        <input
          v-model="filterRules"
          confirm-type="search"
          placeholder="请输入内容的标题"
        >
      </div>
    </div>
    <multTabs 
      :defaultNavId="currentTabId"
      @tagChange="renderList" 
      v-if="!isSearch && currentTabId"
    >
    </multTabs>
    <div class="items">
      <mescroll-body
        ref="mescrollRef"
        :down="downOption"
        @init="mescrollInit"
        @up="getActiveList"
        class="list"
      >
        <div
          class="item"
          v-for="(item, index) in activeList"
          :key="index"
        >
          <div
            @click="goActivePage(item)"
            class="content"
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
                <span>{{ parseInt(item.share) || 0 }}人分享</span>
                <span>{{ parseInt(item.uv) || 0 }}人浏览</span>
                <span>获客{{ parseInt(item.stayMsg) || 0 }}人</span>
              </p>
              <p class="tag">
                <span
                  v-for="(tag) in item.tags"
                  :key="tag.id"
                >{{ tag.name }}</span>
              </p>
            </div>
            <p v-if="item.diffuseTypeId !== 1" class="share-icon" @click.stop="sharePeople">
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
import multTabs from '../../components/multTabs/index'
import { getClient } from '@/api'

export default {
  components: {
    multTabs,
    mescrollBody
  },
  mixins: [MescrollMixin],
  onLoad(options) {
    this.currentTabId = Number(options.tab)
  },
  data() {
    return {
      activeData: {
        pv: 0,
        share: 0,
        shareActiveCount: 0
      },
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
      currentChooseTime: 1,
      currentTabId: 0,
      currentTagId: 0,
      isFilterCollect: false,
      activeList: [],
      
      timeArr: [{
        key: 1,
        text: '24小时'
      }, {
        key: 2,
        text: '48小时'
      }, {
        key: 7,
        text: '近7日'
      }, {
        key: 0,
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
    renderList(tagId) {
      this.currentTagId = tagId
      this.offset = 0
      this.activeList = []
      this.getActiveList()
    },
    sharePeople() {
      uni.showToast({
        title: '吊起后端服务，发送公众号通知',
        icon: 'none'
      })
    },
    goActivePage(active) {
      if (active.diffuseTypeId === 1) {
        uni.navigateTo({
          url: '/pages/active/index?activeId=' + active.activeId
        })
      }
      
    },
    initPage() {
      this.getActiveData()
    },
    getActiveData() {
      const _ = this
      getClient.getActiveData({
        day: _.currentChooseTime
      }).then(res => {
        _.activeData = res
      })
    },
    changeOneTag(tag) {
      this.currentOneTag = tag.id
      this.offset = 0
      this.activeList = []
      this.getActiveList()
    },
    changeTwoTag(tag) {
      this.currentTwoTag = tag.id
      this.offset = 0
      this.activeList = []
      this.getActiveList()
    },
    chanegTab(index) {
      
    },
    changeTime(item) {
      this.currentChooseTime = item.key
      this.getActiveData()
    },
    beginSearch() {
      if (this.filterRules) {
        this.isSearch = true
        this.offset = 0
        this.activeList = []
        this.getActiveList()
      }
      
    },
    getActiveList() {
      if (!this.currentTagId) return
      if (this.isLoading || this.activeList.length === this.listCount) return
      this.isLoading = true
      const sendData = {
        count: this.pagesize,
        offset: this.offset
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      } else {
        sendData.tagId = this.currentTagId
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
    }
  }
}
</script>

<style lang="scss">
.customer-box {
  box-sizing: border-box;
  height: 100vh;
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
  background-size: 100% 100%;
  padding-top: 30rpx;
  background-position-y: -132px;
  background-color: #fff;
}
.items {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
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
