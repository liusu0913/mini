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
          <span class="icon icon-card" />
          名片信息
        </p>
        <p
          :class="{active: choseTab === 'address'}"
          @click="changeTab('address')"
        >
          <span class="icon icon-address" />名片位置
        </p>
        <p
          :class="{active: choseTab === 'edit'}"
          @click="goEditPage"
        >
          <span class="icon icon-edit" />名片编辑
        </p>
        <p
          :class="{active: choseTab === 'delete'}"
          @click="deleteCard('delete')"
        >
          <span class="icon icon-banned" />去除名片
        </p>
        <button
          class="save"
          type="default"
          @click="saveBtn"
        >
          保存
        </button>
      </view>
    </view>
  </view>
</template>

<script>

import { getSharePoster } from '@/libs/utils/QS-SharePoster/QS-SharePoster.js'
import { mapGetters } from 'vuex'

export default {
  data () {
    return {
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
        y: 0
      }
    }
  },
  computed: {
    ...mapGetters({
      info: 'user/info'
    })
  },
  watch: {
    choseTab(value) {
      const isDelete = value === 'delete'
      const that = this
      const query = wx.createSelectorQuery()
      // 选择class id
      query.select('.content').boundingClientRect(function (rect) {
        that.$set(that.bgConfig, 'width', rect.width)
        that.$set(that.bgConfig, 'height', isDelete ? rect.height : (rect.height / 10) * 9)
        that.$set(that.bgConfig, 'all', rect.height)
        if (isDelete) {
          that.$set(that.bgConfig, 'y', 0)
        }
      }).exec()
    },
    bgConfig() {
      this.initPage(this.changeCardRendaer())
    },
    defaultMessageChose() {
      this.initPage(this.changeCardRendaer())
    },
    defaultPosition() {
      this.initPage(this.changeCardRendaer())
    }
  },
  mounted() {
    const that = this
    const query = wx.createSelectorQuery()
    // 选择class id
    query.select('.content').boundingClientRect(function (rect) {
      that.$set(that.bgConfig, 'width', rect.width)
      that.$set(that.bgConfig, 'height', (rect.height / 10) * 9)
      that.$set(that.bgConfig, 'all', rect.height)
    }).exec()
  },
  methods: {
    goEditPage() {
      uni.navigateTo({
        url: '/pages/edit/index'
      })
    },
    saveBtn() {
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
                    // 如果用户拒绝过或没有授权，则再次打开授权窗口
                    // （ps：微信api又改了现在只能通过button才能打开授权设置，以前通过openSet就可打开，下面有打开授权的button弹窗代码）
                    wx.showToast({
                      title: '请授权才能保存图片到本地'
                    })
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
      const that = this
      const query = wx.createSelectorQuery()
      // 选择class id
      query.select('.content').boundingClientRect(function (rect) {
        that.$set(that.bgConfig, 'width', rect.width)
        that.$set(that.bgConfig, 'height', rect.height)
        that.$set(that.bgConfig, 'all', rect.height)
      }).exec()
      this.initPage([])
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
        console.log(0)
        this.$set(this.bgConfig, 'y', uni.upx2px(0))
      } else {
        console.log(120)
        this.$set(this.bgConfig, 'y', uni.upx2px(120))
      }
    },
    changeTab(key) {
      this.choseTab = key
    },
    changeCardRendaer() {
      const that = this
      const { bgConfig } = that
      const renderData = []
      const isTop = this.defaultPosition !== '下边'
      const noHasImg = this.defaultMessageChose.indexOf(0) === -1
      const txtLen = noHasImg ? this.defaultMessageChose.length : this.defaultMessageChose.length - 1
      let txtSpace = (100 / (txtLen + 1)) - 10
      if (isTop) { txtSpace = txtSpace + 10 }
      const cardMap = {
        0: () => {
          return {
            type: 'image', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            url: '/static/logo.png',
            dx: uni.upx2px(20),
            dy: isTop ? uni.upx2px(10) : bgConfig.height,
            dWidth: uni.upx2px(100),
            dHeight: uni.upx2px(100),
            circleSet: true
          }
        },
        1: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: that.info.name,
            size: uni.upx2px(36),
            color: '#1c1c1c',
            dx: noHasImg ? uni.upx2px(20) : uni.upx2px(150),
            dy: isTop ? uni.upx2px(txtSpace + (30 * index)) : bgConfig.height + uni.upx2px(txtSpace + (30 * index))
          }
        },
        2: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: that.info.title,
            size: uni.upx2px(30),
            color: '#969696',
            dx: noHasImg ? uni.upx2px(20) : uni.upx2px(150),
            dy: isTop ? uni.upx2px(txtSpace + (30 * index)) : bgConfig.height + uni.upx2px(txtSpace + (30 * index))
          }
        },
        3: (index) => {
          return {
            type: 'text', // 绘制类型, 详见上方 绘制类型大纲
            // ...对应type的属性, 详见下方
            text: that.info.phone,
            size: uni.upx2px(30),
            color: '#969696',
            dx: noHasImg ? uni.upx2px(20) : uni.upx2px(150),
            dy: isTop ? uni.upx2px(txtSpace + (30 * index)) : bgConfig.height + uni.upx2px(txtSpace + (30 * index))
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
    changeBgRender() {

    },
    initPage(cardData) {
      const that = this
      const { bgConfig } = that
      getSharePoster({
        that,
        posterCanvasId: 'canvasId', // canvasId
        backgroundImage: '/static/bg.png', // 背景图片路径, 画布会跟随图片的实际像素, 并绘制为背景, 请不要使背景图片的像素太大
        bgConfig,
        qrCodeArray: () => {
          return [{
            text: 'https://www.baidu.com',
            size: bgConfig.width * 0.16,
            dx: bgConfig.width - bgConfig.width * 0.16 - uni.upx2px(20),
            dy: bgConfig.height - bgConfig.width * 0.16 - uni.upx2px(40) + (bgConfig.y || 0)
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
    padding: 20rpx;
    background-color: #eff2fa;
    height: 100vh;
  }
  .content {
    height: 80vh;
  }
  .tabs {
    background-color: #fff;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    margin-top: 30rpx;
    padding: 20rpx 0 calc(constant(safe-area-inset-bottom));    /*兼容 IOS<11.2*/
    padding: 20rpx 0 calc(env(safe-area-inset-bottom));
    .nav {
      font-size: 0;
      padding-bottom: 20rpx;
      span {
        display: inline-block;
        font-size: 26rpx;
        line-height: 50rpx;
        padding: 0 30rpx;
        color: #4a73ec;
        background-color: #e7edfc;
        margin-left: 20rpx;
        border-radius: 20rpx;
      }
      .no-choose {
        color: #a1addc;
      }
    }
    .tab {
      padding: 20rpx;
      display: flex;
      border-top: 1px solid #eff2fa;
      .active {
        color: #4a73ec;
        .icon {
          color: #4a73ec;
        }
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
        background-color: #4a72ea;
        margin-top: 25rpx;
        border-radius: 20rpx;
        color: #fff;
      }
    }
  }
</style>
