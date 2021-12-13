<template>
  <div class="customer-box">
    <div
      v-if="dialogIsShow"
      class="dialog"
    >
      <div class="box">
        <div class="tit">
          {{ currentFodder.title }}
          <span @click="closeDialog">X</span>
        </div>
        <div class="content">
          <div class="time">
            {{ currentFodder.time }}
          </div>
          <div class="txt">
            {{ currentFodder.text }}
          </div>
          <div class="source">
            他人引荐
          </div>
        </div>
        <div class="foot">
          <button
            type="default"
            @click="saveText"
          >
            复制文本
          </button>
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
        class="tags"
      >
        <span
          v-for="tag in tags"
          :key="tag.id"
          :class="{
            'tag': true,
            'active': tag.id === currentChooseTag
          }"
          @click="changeTag(tag)"
        >{{ tag.title }}</span>
      </div>
    </div>
    <div class="list">
      <mescroll-body
        ref="mescrollRef"
        :down="downOption"
        @init="mescrollInit"
        @up="getFodderList"
      >
        <view
          v-for="(item, index) in fodderList"
          :key="index"
          class="card"
        >
          <view class="head">
            <span class="title">{{ item.title }}</span>
            <span class="time">{{ item.time }}</span>
          </view>
          <view class="content">
            {{ item.text }}
          </view>
          <view
            class="foot"
            @click="openDialog(item)"
          >
            <span class="icon icon-save" />
            <p>保存全部资料</p>
          </view>
        </view>
      </mescroll-body>
    </div>
  </div>
</template>

<script>
import eTab from '../../components/tab/index'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getFodder } from '@/api'

export default {
  components: {
    eTab,
    mescrollBody
  },
  mixins: [MescrollMixin],
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.id
  },
  data() {
    return {
      currentFodder: {
      },
      dialogIsShow: false,
      listCount: 20,
      isLoading: false,
      downOption: {
        use: false,
        auto: false,
        textNoMore: '--- 到底了 ---'
      },
      pageType: 1,
      pagesize: 20,
      offset: 0,
      isSearch: false,
      filterRules: '',
      currentChooseTime: '0',
      currentChooseTag: 'all',
      currentTab: 0,
      isFilterCollect: false,
      tags: [],
      fodderList: [],
      tabList: [],
      activeData: {
        allNum: 0,
        shareNum: 0,
        visitNum: 0
      }
    }
  },
  watch: {
    filterRules(value) {
      if (value === '') {
        this.isSearch = false
        this.getFodderList()
      }
    }
  },
  mounted() {
    getFodder.getFodderTab({
      type: this.pageType
    }).then(data => {
      this.tabList = data.tabs
      this.initPage()
    })
  },
  methods: {
    openDialog(item) {
      this.dialogIsShow = true
      this.currentFodder = item
    },
    saveText() {
      const that = this
      wx.setClipboardData({
        data: this.currentFodder.text,
        success (res) {
          wx.getClipboardData({
            success (res) {
              wx.showToast({
                title: '复制成功'
              })
              that.dialogIsShow = false
            }
          })
        }
      })
    },
    closeDialog() {
      this.dialogIsShow = false
    },
    initPage() {
      this.offset = 0
      this.fodderList = []
      this.getTabTags()
      this.getFodderList()
    },
    getTabTags() {
      getFodder.getTabTags({
        id: this.tabList[this.currentTab].id
      }).then(data => {
        this.tags = data.tags
        this.tags.unshift({
          title: '全部',
          id: 'all'
        })
      })
    },
    chanegTab(index) {
      this.currentChooseTag = 'all'
      this.currentTab = index
      this.initPage()
    },
    changeTag(tag) {
      this.currentChooseTag = tag.id
      this.offset = 0
      this.fodderList = []
      this.getFodderList()
    },
    beginSearch() {
      if (this.filterRules) {
        this.isSearch = true
        this.offset = 0
        this.fodderList = []
        this.getFodderList()
      }
    },
    getFodderList() {
      if (!this.tabList.length || this.fodderList.length === this.listCount || this.isLoading) return
      this.isLoading = true
      const sendData = {
        pagesize: this.pagesize,
        offset: this.offset
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      } else {
        sendData.tab = this.tabList[this.currentTab].id
        if (this.currentChooseTag !== 'all') {
          sendData.tag = this.currentChooseTag
        }
      }
      getFodder.getFodderList(sendData).then(data => {
        if (data.list) {
          if (this.offset) {
            this.fodderList = this.fodderList.concat(data.list)
          } else {
            this.fodderList = data.list
          }
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          // 联网成功的回调,隐藏下拉刷新的状态
          this.mescroll.endSuccess(this.fodderList.length, this.fodderList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.customer-box {
  padding: 20rpx 20rpx 0;
  background-color: #efeff9;
}
.dialog {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0,0,0, .5);
  z-index: 9999;
  .box {
    position: absolute;
    left: 20rpx;
    right: 20rpx;
    top: 50%;
    transform: translateY(-50%);
    background-color: #fff;
    padding-bottom: 30rpx;
    border-radius: 10rpx;
    .tit {
      line-height: 80rpx;
      padding: 0 20rpx;
      font-size: 36rpx;
      color: black;
      border-bottom: 1rpx solid #ccc;
      span {
        float: right;
      }
    }
    .content {
      padding: 0 20rpx;
      .time {
        color: #99999d;
        font-size: 24rpx;
        line-height: 80rpx;
      }
      .txt {
        font-size: 30rpx;
        line-height: 40rpx;
      }
      .source {
        color: #99999d;
        font-size: 24rpx;
        line-height: 80rpx;
      }
    }
    .foot {
      text-align: center;
      button {
        display: inline-block;
        background-color: #4b72ec;
        border: none;
        padding:0 50rpx;
        font-size: 30rpx;
        color: #fff;
        height: 70rpx;
        line-height: 70rpx;
        border-radius: 35rpx;
      }
    }
  }
}
.list {
  margin-top: 30rpx;
  .card {
    background-color: #fff;
    border-radius: 20rpx;
    margin-bottom: 20rpx;
    padding: 0 20rpx;
    .head {
      display: flex;
      line-height: 80rpx;
      border-bottom: 1rpx solid #ccc;
      .title {
        flex: 1;
        font-size: 34rpx;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .time {
        margin-left: 30rpx;
        font-size: 20rpx;
      }
    }
    .content {
      margin: 30rpx 0;
      font-size: 40rpx;
      line-height: 50rpx;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 4;
      overflow: hidden;
    }
    .foot {
      border-top: 1px solid #ccc;
      padding: 0rpx 20rpx 20rpx;
      text-align: center;
      font-size: 24rpx;
      line-height: 30rpx;
      .icon {
        font-size: 40rpx;
        line-height: 70rpx;
      }
    }
  }
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
</style>
