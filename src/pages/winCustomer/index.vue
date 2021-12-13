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
      <div
        class="collect"
        @click="filterMyCollect"
      >
        <span class="icon icon-filter" />
        <span>{{ !isFilterCollect ? '仅看收藏' : '查看全部' }}</span>
      </div>
    </div>
    <div class="items">
      <eTab
        v-if="!isSearch"
        :active-tab="tabList.indexOf(currentTab)"
        :tab-list="tabList"
        @change="chanegTab"
      />
      <div
        v-if="!isSearch"
        class="tags"
      >
        <span
          v-for="tag in tags"
          :key="tag.id"
          :class="{
            'tag': true,
            'active': tag.id === currenstChooseTag
          }"
          @click="changeTag(tag)"
        >{{ tag.text }}</span>
      </div>
      <ul class="list">
        <li
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
          </div>
          <div class="foote">
            <p
              :class="{ active: item.collect}"
              @click="collectItem(item)"
            >
              <span :class="{icon: true, 'icon-collect': true, }" />
              {{ !item.collect ? '收藏' : '取消收藏' }}
            </p>
            <p>
              <span class="icon icon-account" />
              数据
            </p>
            <p @click="sharePeople">
              <span class="icon icon-share" />
              分享
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import eTab from '../../components/tab/index'
import { getClient } from '@/api'

export default {
  components: {
    eTab
  },
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.currentTab = currentPage.options.tab
  },
  data() {
    return {
      pagesize: 20,
      offset: 0,
      isSearch: false,
      filterRules: '',
      currentChooseTime: '0',
      currenstChooseTag: 'all',
      currentTab: '青少年',
      isFilterCollect: false,
      tags: [],
      activeList: [],
      tabList: [
        '儿童',
        '青少年',
        '中青年',
        '老年'
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
      getClient.getTags({
        tab: this.currentTab
      }).then(data => {
        this.tags = data.list
        this.tags.unshift({
          id: 'all', text: '全部'
        })
      })
      this.getActiveData()
      this.getActiveList()
    },
    getActiveData() {
      getClient.getActiveData({
        day: this.currentChooseTime === 'all' ? '' : this.currentChooseTime
      }).then(data => {
        this.activeData = data
      })
    },
    changeTag(tag) {
      this.currenstChooseTag = tag.id
      this.getActiveList()
    },
    chanegTab(index) {
      this.currentTab = this.tabList[index]
      this.currenstChooseTag = 'all'
      this.getActiveList()
    },
    changeTime(item) {
      this.currentChooseTime = item.key
      this.getActiveData()
    },
    beginSearch() {
      if (this.filterRules) {
        this.isSearch = true
        this.getActiveList()
      }
    },
    filterMyCollect() {
      // 处理数据或者收藏的文章
      if (this.isFilterCollect) {
        this.getActiveList()
      } else {
        const arr = this.activeList.filter((item) => { return item.collect })
        this.activeList = arr
      }
      this.isFilterCollect = !this.isFilterCollect
    },
    getActiveList() {
      const sendData = {
        pagesize: this.pagesize,
        offset: this.offset
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      } else {
        sendData.tab = this.currentTab
        sendData.tag = this.currenstChooseTag
      }
      getClient.getActiveList(sendData).then(data => {
        if (data.list) {
          this.activeList = data.list
        }
      })
      console.log(sendData)
    },
    collectItem(item) {
      item.collect = !item.collect
    }
  }
}
</script>

<style lang="scss">
.customer-box {
  padding: 20rpx 20rpx 0;
  background-color: #efeff9;
  height: 100vh;
}
.items {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;
  .tags {
    padding: 20rpx 0;
    font-size: 0;
    .tag {
      display: inline-block;
      font-size: 20rpx;
      line-height: 30rpx;
      padding: 10rpx 30rpx;
      background-color: #efeff9;
      color: #000;
      margin:0 0 20rpx 20rpx;
      border-radius: 10rpx;
    }
    .active {
      background-color: #008dce;
      color: #fff;
    }
  }
  .list {
    margin: 0;
    padding: 0;
    list-style: none;
    li {
      margin: 0;
      padding: 0;
      padding: 20rpx;
      .content {
        display: flex;
        img {
          width: 140rpx;
          height: 140rpx;
          margin-right: 40rpx;
        }
        .intr {
          p {
            margin: 0;
            padding: 0;
            color: #c4c5c7;
            line-height: 30rpx;
            font-size: 20rpx;
          }
          .title {
            font-size: 30rpx;
            font-weight: bold;
            line-height: 40rpx;
            color: #000;
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
              margin-top: 15rpx;
              padding: 0rpx 10rpx;
              margin-right: 20rpx;
              border-radius: 10rpx;
              color: #fff;
              display: inline-block;
              background-color: #f27583;
            }
          }
        }
      }
      .foote {
        margin-top: 20rpx;
        padding-top: 20rpx;
        border-top: 2rpx solid #efeff9;
        display: flex;
        .active {
          color: #008dce;
        }
        p {
          flex: 1;
          text-align: center;
          font-size: 30rpx;

          .icon {
            margin-right: 10rpx;
          }
        }
      }
    }
  }

}
.search {
  background-color: #fff;
  padding: 20rpx;
  margin-bottom: 30rpx;
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
.board {
  color: #5c616a;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
  .content {
    margin-top: 40rpx;
    display: flex;
    .item {
      flex: 1;
      text-align: center;
      font-size: 50rpx;
      font-weight: bold;
      p {
        font-weight: normal;
        font-size: 20rpx;
        line-height: 30rpx;
      }
    }
  }
  ul {
    display: inline-block;
    list-style: none;
    margin: 0;
    padding: 0;
    font-size: 0;
    background-color: #edf0fa;
    border-radius: 25rpx;
    margin-top: 30rpx;
    li {
      border-radius: 25rpx;
      line-height: 30rpx;
      font-size: 20rpx;
      display: inline-block;
      color: #2e63ef;
      padding: 10rpx 30rpx;
    }
    li.active {
      color: #fff;
      background-color: #2e63ef;
    }
  }
  .title {
    line-height: 30rpx;
    font-size: 24rpx;
    span {
      float: right;
      font-size: 20rpx;
    }

  }
}
</style>
