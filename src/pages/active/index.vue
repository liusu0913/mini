<template>
  <view class="box">
    <view class="content">
      <canvas
        canvas-id="canvasId"
        :style="{width: (poster.width||'0rpx'), height: (poster.height||'0rpx')}"
      />
    </view>
    <view class="tabs">
      <view class="nav">
        <div v-if="choseTab === 'msg'">
          <span
            v-for="(item, index) in messageArr"
            :key="index"
            :class="{
              'no-choose': defaultMessageChose.indexOf(index) === -1
            }"
            @click="changeMsgOptions(index)"
          >{{ item }}</span>
        </div>
        <div v-if="choseTab === 'address'">
          <span
            v-for="(item, index) in addressArr"
            :key="index"
            :class="{
              'no-choose': defaultPosition !== item
            }"
            @click="changePosition(item)"
          >{{ item }}</span>
        </div>
      </view>
      <view class="tab">
        <p
          :class="{active: choseTab === 'msg'}"
          @click="changeTab('msg')"
        >
          <img src="../../static/img/active1.png" alt="">
          名片信息
        </p>
        <p
          :class="{active: choseTab === 'address'}"
          @click="changeTab('address')"
        >
          <img src="../../static/img/active2.png" alt="">
          名片位置
        </p>
        <p
          :class="{active: choseTab === 'edit'}"
          @click="goEditPage"
        >
          <img src="../../static/img/active3.png" alt="">
          名片编辑
        </p>
        <p
          :class="{active: choseTab === 'delete'}"
          @click="deleteCard('delete')"
        >
          <img src="../../static/img/active4.png" alt="">
          去除名片
        </p>
        <button
          v-if="hasAutoSaveImg"
          class="save"
          type="default"
          @click="saveBtn"
        >
          保存
        </button>
        <button
          v-else
          class="save"
          type="default"
          open-type="openSetting"
        >
          授权
        </button>
      </view>
    </view>
  </view>
</template>

<script>

import {getClient} from '@/api'
import { getSharePoster } from '@/libs/utils/QS-SharePoster/QS-SharePoster.js'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      hasAutoSaveImg: false,
      active: {},
      messageArr: ['头像', '姓名', '职位', '手机号'],
      defaultMessageChose: [0, 1, 2, 3],
      addressArr: ['上边', '下边'],
      defaultPosition: '下边',
      navList: [],
      choseTab: 'msg',
      poster: {
      },
      loadImagePath: '',
      bgConfig: {
        y: 0,
        width: uni.upx2px(668),
      }
    }
  },
  computed: {
    ...mapGetters({
      info: 'user/info'
    })
  },
  watch: {
    bgConfig() {
      this.initPage(this.changeCardRendaer())
    },
    choseTab(value) {
      if (value === 'delete') {
        this.initPage([])
      } else {
        this.initPage(this.changeCardRendaer())
      }
    },
    defaultMessageChose() {
      this.initPage(this.changeCardRendaer())
    },
    defaultPosition() {
      this.initPage(this.changeCardRendaer())
    }
  },
  onShow() {
    const that = this

    wx.getSetting({
      success(res) {
        that.hasAutoSaveImg = res.authSetting['scope.writePhotosAlbum'] === false ? false : true;
      }
    })
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    getClient.getActiveInfo({
      activeId: currentPage.options.activeId
    }).then(data => {
      that.active = data
      const query = uni.createSelectorQuery()
      // 选择class id
      query.select('.content').boundingClientRect(function (rect) {
        that.$set(that.bgConfig, 'height', rect.height - uni.upx2px(220))
        that.$set(that.bgConfig, 'all', rect.height - uni.upx2px(20))
        that.initPage(that.changeCardRendaer())
      }).exec()
    })
    
  },
  methods: {
    goEditPage() {
      uni.navigateTo({
        url: '/pages/edit/index'
      })
    },
    saveBtn() {
      const that = this
      uni.canvasToTempFilePath({
        canvasId: 'canvasId',
        success(res) {
          const { tempFilePath } = res
          // 获取用户是否开启用户授权相册
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
                        wx.showToast({
                          title: '保存成功'
                        })
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
                    wx.showToast({
                      title: '保存成功'
                    })
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
        },
        fail(res) {
          console.log(res)
        }
      })
    },
    deleteCard(key) {
      this.choseTab = key
    },
    changeMsgOptions(item) {
      const index = this.defaultMessageChose.indexOf(item)
      if (index === -1) {
        this.defaultMessageChose.push(item)
      } else {
        this.defaultMessageChose.splice(index, 1)
      }
      this.defaultMessageChose.sort((a, b) => {
        return a - b
      })
    },
    changePosition(position) {
      this.defaultPosition = position
      if (position === '下边') {
        this.$set(this.bgConfig, 'y', uni.upx2px(0))
      } else {
        this.$set(this.bgConfig, 'y', uni.upx2px(127 + 20))
      }
    },
    changeTab(key) {
      this.choseTab = key
    },
    changeCardRendaer() {
      const that = this
      const {bgConfig} = that
      const renderData = []
      const isTop = this.defaultPosition !== '下边'
      const noHasImg = this.defaultMessageChose.indexOf(0) === -1
      const cardMap = {
        0: () => {
          return {
            type: 'image', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            url: that.info.avatar,
            dx: uni.upx2px(10),
            dy: isTop ? uni.upx2px(0) : 10 + bgConfig.height,
            dWidth: uni.upx2px(127),
            dHeight: uni.upx2px(127),
            circleSet: true
          }
        },
        1: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: that.info.name,
            size: uni.upx2px(38),
            color: '#111110',
            dx: noHasImg ? uni.upx2px(0) : uni.upx2px(127 + 28),
            dy: isTop ? uni.upx2px(29) : bgConfig.height + uni.upx2px(58)
          }
        },
        2: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: `/${that.info.title}`,
            size: uni.upx2px(24),
            color: '#606060',
            dx: noHasImg ? uni.upx2px(28 + that.info.name.length * 38) : uni.upx2px(127 + 28 + that.info.name.length * 38),
            dy: isTop ? uni.upx2px(41) : bgConfig.height + uni.upx2px(70)
          }
        },
        3: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: that.info.phone,
            size: uni.upx2px(24),
            color: '#606060',
            dx: noHasImg ? uni.upx2px(0) : uni.upx2px(127 + 30),
            dy: isTop ? uni.upx2px(79) : bgConfig.height +  uni.upx2px(108)
          }
        }
      }
      this.defaultMessageChose.forEach((item, index) => {
        if (!noHasImg) {
          index--
        }
        renderData.push(cardMap[item](index))
      })
      return renderData
    },
    initPage(cardData) {
      uni.showToast({
        title: '海报绘制中',
        icon: 'loading',
        duration: 10000
      });
      const that = this
      const { bgConfig } = that
      console.log(`${that.active.url}?activeId=${that.active.activeId}&jobId=${that.info.jobId}&belongCompany=${that.info.belongCompany}`, 11111)

      getSharePoster({
        that,
        cb: () => {
          uni.hideToast()
        },
        posterCanvasId: 'canvasId', // canvasId
        backgroundImage: that.active.img, // 背景图片路径, 画布会跟随图片的实际像素, 并绘制为背景, 请不要使背景图片的像素太大
        bgConfig,
        qrCodeArray: () => {
          return [{
            text: `${that.active.url}?activeId=${that.active.activeId}&jobId=${that.info.jobId}&belongCompany=${that.info.belongCompany}`,
            size: uni.upx2px(150),
            backgroung: '#fff',
            dx: uni.upx2px(510),
            dy: bgConfig.y ? uni.upx2px(0) : bgConfig.height + 10
          }]
        },
        setCanvasWH() {
          that.poster = {
            width: '100%',
            height: '100%'
          }
        },
        drawArray() {
          return cardData
        }
      })
    }
  }
}

</script>

<style lang="scss">
  .box {
    position: relative;
    box-sizing: border-box;
    height: 100vh;
    padding: 20rpx;
    background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    background-position-y: -132px;
    background-color: #fff;
  }
  .content {
    flex: 1;
    box-sizing: border-box;
    padding: 20rpx;
    background-color: #fff;
    height: 897rpx;
  }
  .tabs {
    background-color: #fff;
    height: 270rpx;
    width: 100%;
    .nav {
      font-size: 0;
      padding: 20rpx 0;
      span {
        box-sizing: border-box;
        height: 55rpx;
        padding: 0 48rpx;
        line-height: 55rpx;
        display: inline-block;
        font-size: 22rpx;
        font-weight: 400;
        text-align: center;
        color: #969696;
        margin-left: 10rpx;
        border-radius: 30rpx;
        border: 1px solid #f0f2f4;
      }
      .no-choose {
        background-color: #f0f2f4;

      }
    }
    .tab {
      padding: 20rpx;
      display: flex;
      border-top: 1px solid #eff2fa;
      text-align: center;
      img {
        margin: auto;
        vertical-align: top;
        width: 60rpx;
        height: 60rpx;
      }
      .active {
        color: #7fd397;
      }
      p {
        text-align: center;
        flex: 1;
        display: flex;
        flex-direction: column;
        line-height: 40rpx;
        font-size: 26rpx;
        line-height: 50rpx;
        .icon {
          color: #171717;
          font-size: 50rpx;
          line-height: 70rpx;
        }
      }
      .save {
        margin: 0;
        padding: 0;
        font-size: 24rpx;
        height: 90rpx;
        width: 90rpx;
        line-height: 90rpx;
        background-color: #7fd397;
        color: #fff;
        outline: none;
        border: none;
        border-radius: 50%;
      }
    }
  }
</style>
