<template>
  <view class="box">
    <mescroll-body
      ref="mescrollRef"
      :down="downOption"
      @init="mescrollInit"
      @up="getMsgList"
    >
      <div
        @click="skipPage(item)"
        v-for="(item, i) in messageList"
        :key="i"
        class="card"
      >
        <img
          :src="item.active.banner"
          alt=""
        >
        <div class="bottom">
          <div
            v-if="item.active.title"
            class="content"
          >
            <div class="title">
              {{ item.active.title }}
            </div>
            <span
              v-if="item.active.startTime"
              class="time"
            >
              活动时间：{{ item.active.startTime | date_format }}
            </span>
            <p
              v-if="item.active.tags.length"
              class="use"
            >
              活动使用：{{ item.use }}
            </p>
          </div>
          <div class="foot">
            <span>查看详情</span>
            <img src="../../static/img/go.png" alt="">
          </div>
        </div>
      </div>
    </mescroll-body>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getSendMore, getClient } from '@/api'
import {mapGetters} from 'vuex'

export default {
  components: {
    mescrollBody
  },
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.type
    const titleMap = {
      1: '群发助手',
      2: '朋友圈助手'
    }
    uni.setNavigationBarTitle({
      title: titleMap[this.pageType]
    })
  },
  mixins: [MescrollMixin],
  computed: {
    ...mapGetters({
      info: 'user/info',
    })
  },
  data() {
    return {
      pageType: 0,
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
  methods: {
    getMsgList() {
      if (this.isLoading || this.messageList.length === this.listCount) return
      this.isLoading = true
      getSendMore.getSendMoreMsg({
        count: this.pagesize,
        offset: this.offset,
        type: Number(this.pageType)
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
      if (item.active.diffuseTypeId !== 1) {
        this.sharePeople(item)
      } else {
        uni.navigateTo({
          url: `/pages/active/index?activeId=${item.active.activeId}`
        })
      }
    },
    sharePeople(item) {
      const that = this
      const sendData = {
        title: '这是您的营销内容，请查收',
        keyword1: item.active.title,
        remark: item.active.endTime
          ? `任务时间：${this.$options.filters.date_format(item.active.startTime)}至${this.$options.filters.date_format(item.active.endTime)}` 
          : `任务开始时间：${this.$options.filters.date_format(item.active.startTime)}`

      }
      getClient.sendMsg({
        openID: that.info.openId,
        url: `${item.url}?jobId=${that.info.jobId}&belongCompnay=${that.info.belongCompany}&activeId=${item.activeId}`,
        ...sendData
      }).then((data) => {
        if (!data) {
          that.mpShow = true
        } else {
          uni.showToast({
            title: '发送消息成功，请查看微信消息',
            icon: 'none'
          })
        }
      })
      
    },
  }
}
</script>

<style lang="scss">
  .box {
    background-color: #f1f2f7;
    background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
    background-size: 100% 100%;
    height: 100vh;
    padding: 0 30rpx;
  }
 
  .card {
    flex: 1;
    margin: 0 auto;
    margin-top: 30rpx;
    background-color: #f7f9fd;
    padding: 20rpx;
    border-radius: 10rpx;
    img {
      vertical-align: top;
      width: 100%;
      height: 284rpx;
      margin-bottom: 36rpx;
    }
    .bottom {
      display: flex;
    }
    .content {
      flex: 1;
      padding: 0 20rpx;
      .title {
        font-size: 30rpx;
        font-weight: 400;
        text-align: left;
        color: #111110;
      }
      .time, .use {
        font-size: 24rpx;
        color: #969696;
      }
      span {
        margin-right: 32rpx;
      }
    }
    .foot {
      margin-top: 20rpx;
      span {
        vertical-align: top;
        display: inline-block;
        font-size: 24rpx;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: left;
        color: #606060;
        line-height: 37rpx;
        margin-right: 18rpx;
      }
      img {
        vertical-align: top;
        width: 21rpx;
        height: 37rpx;
        margin: 0;
      }
    }
    
  }
</style>
