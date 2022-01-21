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
        <div class="time">{{ currentFodder.updatedAt | date_format }}</div>
        <div class="content">
          <div class="txt">
            {{ currentFodder.content }}
          </div>
          <!-- <div class="source">
            他人引荐
          </div> -->
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
    <div class="head">
      <div class="search">
        <div class="input">
          <img
            src="../../static/img/search.png"
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
        <multTabs 
          v-if="!isSearch" 
          @tagChange="renderList" 
        />
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
          <view class="content">
            <view class="card-head">
              <span class="title">{{ item.title }}</span>
              <span class="time">{{ item.updatedAt | date_format }}</span>
            </view>
            <view class="txt">{{ item.content }}</view>
          </view>
          <view
            class="foot"
            @click="openDialog(item)"
          >
            <img src="../../static/img/go.png" alt="">
          </view>
        </view>
      </mescroll-body>
    </div>
  </div>
</template>

<script>
import multTabs from '../../components/multTabs/index'
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getFodder } from '@/api'

export default {
  components: {
    multTabs,
    mescrollBody
  },
  mixins: [MescrollMixin],
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.type
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
      pageType: 0,
      pagesize: 20,
      offset: 0,
      isSearch: false,
      filterRules: '',
      currentTagId: 0,
      fodderList: [],
    }
  },
  watch: {
    filterRules(value) {
      if (value === '') {
        this.isSearch = false
        this.offset = 0
        this.fodderList = []
        this.getFodderList()
      }
    },
    currentTagId() {
      this.initPage()
    }
  },
  methods: {
    renderList(tagId) {
      this.currentTagId = tagId
    },
    openDialog(item) {
      this.dialogIsShow = true
      this.currentFodder = item
    },
    saveText() {
      const that = this
      uni.setClipboardData({
        data: this.currentFodder.content,
        success (res) {
          wx.getClipboardData({
            success (res) {
              wx.showToast({
                title: '复制成功',
                icon: 'none'
              })
              that.dialogIsShow = false
            }
          })
        },
        complete(res) {
          wx.showToast({
            title: res.errMsg,
            icon: 'none'
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
      console.log(this.fodderList.length === this.listCount , this.isLoading ,(this.currentTagId === 0 ))
      if (this.fodderList.length === this.listCount || this.isLoading ||(this.currentTagId === 0 )) return
      this.isLoading = true
      const sendData = {
        count: this.pagesize,
        offset: this.offset,
        type: Number(this.pageType),
      }
      if (this.isSearch) {
        sendData.search = this.filterRules
      } else {
        sendData.tagId = this.currentTagId
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
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
  background-size: 100% 100%;
  height: 100vh;
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
    left: 68rpx;
    right: 68rpx;
    top: 50%;
    padding: 38rpx 0;
    transform: translateY(-50%);
    background-color: #fff;
    padding-bottom: 30rpx;
    border-radius: 10rpx;
    .time {
      padding: 20rpx 45rpx;
      color: #99999d;
      font-size: 20rpx;
      border-bottom: 2rpx  solid #ccc;
    }
    .tit {
      width: 500rpx;
      box-sizing: border-box;
      padding: 0 45rpx;
      font-size: 30rpx;
      color: #111110;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      span {
        position: absolute;
        top: 38rpx;
        right: 45rpx;
      }
    }
    .content {
      padding: 34rpx 45rpx;
      .txt {
        font-size: 22rpx;
        line-height: 30rpx;
        color: #606060;
      }
      .source {
        color: #606060;
        font-size: 22rpx;
        line-height: 80rpx;
      }
    }
    .foot {
      text-align: center;
      button {
        display: inline-block;
        background-color: #71cb95;
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
  margin-top: 24rpx;
  background-color: #fff;
  .card {
    display: flex;
    border-radius: 20rpx;
    padding: 36rpx 49rpx;
    background-color: #f7f9fd;
    margin-bottom: 15rpx;
    .content {
      width: 453rpx;
      flex: 1;
      .txt {
        color: #606060;
        font-size: 22rpx;
        line-height: 50rpx;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
      }
      .card-head {
        display: flex;
        line-height: 80rpx;
        .title {
          font-size: 28rpx;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #111110;
        }
        .time {
          margin-left: 30rpx;
          font-size: 20rpx;
          color: #969696;
        }
      }
    }
    .foot {
      width: 22px;
      padding: 0 16px;
      position: relative;
      img {
        width: 22rpx;
        height: 37rpx;
        vertical-align: top;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
}
.head {
  background-color: #fff;
  padding: 34rpx 15rpx 0rpx;
  border-radius: 10rpx;
}
.items {
  background-color: #fff;
  border-radius: 10rpx;
  overflow: hidden;

}
.search {
  background-color: #f7f9fd;
  border-radius: 10rpx;
  margin: 0 25rpx 26rpx;
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
</style>
