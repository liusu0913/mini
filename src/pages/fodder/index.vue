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
            @confirm="beginSearch"
            placeholder="请输入内容的标题"
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
            <view 
              v-if="item.imgs"
              :class="{
                img : true,
                one: JSON.parse(item.imgs).length === 1,
                more: JSON.parse(item.imgs).length > 1
              }"
            >
              <img 
                v-for="(img, i) in JSON.parse(item.imgs)"
                :key="i"
                :src="img"
                alt=""
              />
            </view>
          </view>
          <view class="foot">
            <button 
              v-if="!item.imgs || (item.imgs && hasAutoSaveImg)"
              @click="openDialog(item)"
            >
              保存全部素材
            </button>

            <button
              v-else
              class="save"
              type="default"
              open-type="openSetting"
            >
              授权保存图片
            </button>
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
    const that = this
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.type
    wx.getSetting({
      success(res) {
        that.hasAutoSaveImg = res.authSetting['scope.writePhotosAlbum'] === false ? false : true;
      }
    })
  },
  data() {
    return {
      hasAutoSaveImg: false,
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
    async openDialog(item) {
      this.currentFodder = item
      if (item.imgs && JSON.parse(item.imgs).length) {
        wx.showToast({
          title: '图片正在保存...',
          icon: 'loading',
          duration: 1000000
        })
        const imgs = JSON.parse(item.imgs)
        for (let i = 0; i < imgs.length; i++) {
          const tempFilePath = await this.downloadImg(imgs[i])
          await this.saveImg(tempFilePath)
        }
        wx.hideToast()
      }
      wx.showToast({
        title: '开始复制文案',
        icon: 'loading',
      })
      setTimeout(() => {
        this.saveText(item)
      }, 800);
      
    },
    downloadImg(img) {
      return new Promise(reslove => {
        uni.downloadFile({
          url: img,
          success: (res) => {
            const {tempFilePath} = res
            reslove(tempFilePath)
          }
        })
      })
    },
    saveImg(tempFilePath) {
      const that = this
      return new Promise(resolve => {
        wx.getSetting({
          success(res) {
            // 如果没有则获取授权
            if (!res.authSetting['scope.writePhotosAlbum']) {
              wx.authorize({
                scope: 'scope.writePhotosAlbum',
                success() {
                  wx.saveImageToPhotosAlbum({
                    filePath: tempFilePath,
                    success() {
                      resolve()
                    },
                    fail() {
                      wx.showToast({
                        title: '保存失败',
                        icon: 'none'
                      })
                    }
                  })
                },
                fail() {
                  wx.showToast({
                    title: '请授权才能保存图片到本地'
                  })
                  that.hasAutoSaveImg = false
                }
              })
            } else {
              // 有则直接保存
              wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success() {
                  resolve()
                },
                fail() {
                  wx.showToast({
                    title: '保存失败',
                    icon: 'none'
                  })
                }
              })
            }
          }
        })
      })
      
    },
    saveText(item) {
      const that = this
      wx.setClipboardData({
        data: item.content,
        success () {
          wx.getClipboardData({
            success () {
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
      if (!this.currentTagId) return
      if ((this.fodderList.length === this.listCount && this.fodderList.length) || this.isLoading) return
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
    border-radius: 20rpx;
    padding: 20rpx 49rpx;
    background-color: #f7f9fd;
    margin-bottom: 15rpx;
    .content {
      width: 100%;
      flex: 1;
      border-bottom: 1rpx solid #d7dbe3;
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
        border-bottom: 1rpx solid #d7dbe3;
        margin: 0 0 20rpx;;
        .title {
          font-size: 28rpx;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #111110;
        }
        .time {
          text-align: right;
          flex: 1;
          margin-left: 30rpx;
          font-size: 20rpx;
          color: #969696;
        }
      }
      .img {
        margin: 20rpx;
        img {
          display: inline-block;
          vertical-align: top;
          margin: 5rpx;
        }
      }
      .one {
        img {
          width: 320rpx;
          height: 510rpx;
        }
      }
      .more {
        img {
          width: 160rpx;
          height: 160rpx;
        }
      }
    }
    .foot {
      padding: 20rpx 0 0;
      text-align: center;
      button {
        display: inline-block;
        vertical-align: top;
        height: 60rpx;
        width: 290rpx;
        line-height: 60rpx;
        font-size: 24rpx;
        color: #fff;
        background-color: #7dd296;
        border-radius: 30rpx;
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
