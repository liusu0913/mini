<template>
  <view class="box">
    <div class="lists">
      <mescroll-body
        ref="mescrollRef"
        :down="downOption"
        @init="mescrollInit"
        @up="getUserList"
      >
        <div
          v-for="(item, i) in userList"
          :key="i"
          class="card"
          @click="goUserInfoPage(item)"
        >
          <wxUser :item="item"></wxUser>
        </div>
      </mescroll-body>
    </div>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import wxUser from '../../components/wxUserItem/index'
import { getUser } from '@/api'

const getUserListFunMap = {
  0: getUser.recommend,
  1: getUser.regular,
  2: getUser.share
}
export default {
  components: {
    mescrollBody,
    wxUser
  },
  onShow() {
    const pagearr = getCurrentPages()// 获取应用页面栈
    const currentPage = pagearr[pagearr.length - 1]// 获取当前页面信息
    this.pageType = currentPage.options.type
    this.source = currentPage.options.source
  },
  mixins: [MescrollMixin],
  data() {
    return {
      // 判断是不是拉去客户影响的客户
      source: '',
      timeChooseShow: false,
      timeChooseMap: ['最后访问时间', '最早访问时间'],
      currentChooseTime: 0,
      currentSpell: 7,
      pageType: 0,
      pageTypeMap: {
        0: '推荐跟进用户',
        1: '留资用户',
        2: '高传播用户'
      },
      isLoading: false,
      downOption: {
        use: false,
        auto: false,
        textNoMore: '--- 到底了 ---'
      },
      userList: [],
      listCount: 20,
      pagesize: 20,
      offset: 0
    }
  },
  watch: {
    currentChooseTime() {
      this.filterUserList()
    },
    currentSpell() {
      this.offset = 0
      this.userList = []
      this.getUserList()
    }
  },
  methods: {
    getHour(time) {
      const spaceTime = new Date().getTime() - new Date(time).getTime()
      return Math.floor( spaceTime / 1000 / 60 / 60)
    },
    goUserInfoPage(item) {
      uni.navigateTo({
        url: `/pages/user/info?id=${item.openId}`
      })
    },
    filterUserList() {
      if (!this.currentChooseTime) {
        this.userList.sort((a, b) => {
          return a.time - b.time
        })
      } else {
        this.userList.sort((a, b) => {
          return b.time - a.time
        })
      }
    },
    chooseSpell(num) {
      this.currentSpell = num
    },
    clickChoseTime() {
      this.timeChooseShow = !this.timeChooseShow
    },
    chooseFilterTime(index) {
      this.currentChooseTime = index
      this.timeChooseShow = false
    },
    async getUserList() {
      if (this.isLoading || this.userList.length === this.listCount) return
      this.isLoading = true
      let data = {}
      if (this.source) {
        data = await getUser.list({
          count: this.pagesize,
          limit: this.pagesize,
          offset: this.offset,
          sourceOpenId: this.source
        })
        if (data.list) {
          data.users = data.list
        }
      } else {
        data = await getUserListFunMap[this.pageType]({
          count: this.pagesize,
          limit: this.pagesize,
          offset: this.offset
        })
      }
      if (data.users) {
        if (this.offset) {
          this.userList = this.userList.concat(data.users)
        } else {
          this.userList = data.users
        }
        // this.filterUserList()
        this.listCount = data.total
        this.offset += this.pagesize
        this.isLoading = false
        this.mescroll.endSuccess(this.userList.length, this.userList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
      }
    }
  }
}
</script>

<style lang="scss" scope>
.box {
  box-sizing: border-box;
  height: 100vh;
  padding: 0 20rpx;
  background: url('https://baike-med-1256891581.file.myqcloud.com/mini_lite/production/static/test/bg.png') no-repeat;
  background-size: 100% 100%;
}
.date {
  background-color: #fff;
  padding: 28rpx 50rpx;
  display: flex;
  .choose-date {
    flex: 1;
    p {
      vertical-align: middle;
      display: inline-block;
      border-radius: 30rpx;
      span {
        display: inline-block;
        padding: 10rpx 40rpx;
        border-radius: 30rpx;
        font-size: 22rpx;
        font-family: Source Han Sans CN, Source Han Sans CN-Regular;
        font-weight: 400;
        text-align: center;
        color: #606060;
        background-color: #f0f2f6;
      }
      .active {
        background-color: #74cd95;
        color: #fff;
      }
    }

  }
  span {
    font-size: 24rpx;
    color: #b2b2b2;
    text-align: left;
  }
}
.head {
  position: relative;
  padding: 0 50rpx;
  background-color: #fff;
  border-radius: 10rpx 10rpx 0 0 ;
  overflow: hidden;
  ul, li {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  p {
    font-size: 28rpx;
    font-family: Source Han Sans CN, Source Han Sans CN-Regular;
    font-weight: 400;
    color: #606060;
    line-height: 90rpx;
    .icon {
      margin-left: 20rpx;
    }
  }
  ul {
    position: absolute;
    background-color: rgba(0,0,0,.6);
    border-radius: 10rpx;
    li {
      color: #fff;
      padding: 0 20rpx;
      height: 50rpx;
      line-height: 50rpx;
      font-size: 30rpx;
      border-radius: 10rpx;
      border-bottom: 1rpx solid #ccc;
    }
  }
}
.lists {
  padding: 20rpx 10rpx 0;
  background-color: #fff;
}
</style>
