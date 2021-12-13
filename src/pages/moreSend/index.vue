<template>
  <view class="box">
    <mescroll-body
      ref="mescrollRef"
      :down="downOption"
      @init="mescrollInit"
      @up="getMsgList"
    >
      <div
        v-for="item in messageList"
        :key="item.id"
        class="card"
      >
        <img
          :src="item.img"
          alt=""
        >
        <div
          v-if="item.title"
          class="content"
        >
          <div class="title">
            {{ item.title }}
          </div>
          <div
            v-if="item.time"
            class="time"
          >
            活动时间：{{ item.time }}
          </div>
          <div
            v-if="item.use"
            class="use"
          >
            活动使用{{ useMap[item.use] }}
          </div>
        </div>
        <div class="foot">
          <span @click="skipPage(item)">查看详情</span>
          <span>···</span>
        </div>
      </div>
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getSendMore } from '@/api'
export default {
  components: {
    mescrollBody
  },
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.type
  },
  mixins: [MescrollMixin],
  data() {
    return {
      pageType: 0,
      useMap: {
        0: '获客',
        1: '拉新'
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
      messageList: []
    }
  },
  mounted() {
    this.initPage()
  },
  methods: {
    getMsgList() {
      if (this.isLoading || this.messageList.length === this.listCount) return
      this.isLoading = true
      getSendMore.getSendMoreMsg({
        pagesize: this.pagesize,
        offset: this.offset,
        type: this.pageType
      }).then(data => {
        if (data.list) {
          if (this.offset) {
            this.messageList = this.messageList.concat(data.list)
          } else {
            this.messageList = data.list
          }
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          this.mescroll.endSuccess(this.messageList.length, this.messageList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
    },
    skipPage(item) {
      const pageMap = {
        0: '/pages/active/index',
        1: '/pages/fodder/index'
      }
      uni.navigateTo({
        url: `${pageMap[this.pageType]}?id=${item.id}`
      })
    }
  }
}
</script>

<style lang="scss">
  .box {
    background-color: #f1f2f7;
    min-height: 100vh;
  }
  .card {
    width: 80%;
    margin: 0 auto;
    margin-top: 30rpx;
    background-color: #fff;
    padding: 20rpx;
    border-radius: 10rpx;
    img {
      vertical-align: top;
      width: 100%;
      height: 270rpx;
    }
    .content {
      padding: 40rpx 0 0;
      padding-bottom: 80rpx;
      .title {
        font-size: 40rpx;
        font-weight: bold;
        color: #8c8c8c;
        margin-bottom: 20rpx;
      }
      .time, .use {
        font-size: 30rpx;
        color: #8c8c8c;
      }
    }
    .foot {
      padding: 0 20rpx;
      display: flex;
      line-height: 50rpx;
      span:first-child {
        flex: 1;
        color: #459ad0;
        font-size: 34rpx;
      }
      span:last-child {
        color: black;
        font-weight: bold;
      }
    }
  }
</style>
