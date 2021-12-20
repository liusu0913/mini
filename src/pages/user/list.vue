<template>
  <view class="box">
    <div class="head">
      <p @click="clickChoseTime">
        {{ timeChooseMap[currentChooseTime] }}
        <span
          class="icon icon-down-arrows"
        />
      </p>
      <ul v-if="timeChooseShow">
        <li
          v-for="(item, index) in timeChooseMap"
          :key="index"
          @click="chooseFilterTime(index)"
        >
          {{ item }}
        </li>
      </ul>
    </div>
    <div class="date">
      <div class="choose-date">
        <p>
          <span
            :class="{active: currentSpell === 7}"
            @click="chooseSpell(7)"
          >7天</span>
          <span
            :class="{active: currentSpell === 30}"
            @click="chooseSpell(30)"
          >30天</span>
        </p>
      </div>
      <span>数据更新至：<br>12-06</span>
    </div>
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
          <div class="top">
            <img
              :src="item.img"
              alt=""
            >
            <div class="user">
              <p class="name">
                {{ item.name }}
              </p>
              <p class="tag">
                {{ item.tag }}
              </p>
              <p class="data">
                <span class="recommend">推荐度{{ parseInt(item.recommend) }}%</span>
                <span>活跃度{{ parseInt(item.active) }}%</span>
                <span>影响人数{{ parseInt(item.affect) }}</span>
              </p>
            </div>
            <img 
              class="phone"
              @click.stop="callPhone(item)"
              src="../../static/img/phone.png">
          </div>
          <p class="bottom">
            <span>{{ item.time }}小时前</span>访问了 {{ item.histroy.join(' ') }}
          </p>
        </div>
      </mescroll-body>
    </div>
  </view>
</template>

<script>
import MescrollMixin from '@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js'
import mescrollBody from '@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body'
import { getUser } from '@/api'
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
    goUserInfoPage(item) {
      uni.navigateTo({
        url: `/pages/user/info?id=${item.id}`
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
    callPhone(item) {
      uni.makePhoneCall({
        phoneNumber: `${item.phone}` // 仅为示例
      })
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
    getUserList() {
      if (this.isLoading || this.userList.length === this.listCount) return
      this.isLoading = true
      getUser.list({
        pagesize: this.pagesize,
        offset: this.offset,
        type: this.pageType,
        spell: this.currentSpell
      }).then(data => {
        if (data.list) {
          if (this.offset) {
            this.userList = this.userList.concat(data.list)
          } else {
            this.userList = data.list
          }
          this.filterUserList()
          this.listCount = data.count
          this.offset += this.pagesize
          this.isLoading = false
          this.mescroll.endSuccess(this.userList.length, this.userList.length !== this.listCount) // 必传参数(当前页的数据个数, 是否有下一页true/false)
        }
      })
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
  .card {
    padding: 24rpx 20rpx;
    border-radius:20rpx;
    margin-bottom: 20rpx;
    background-color: #f7f9fd;
    .top {
      padding: 20rpx 0;
      display: flex;
      img {
        width: 108rpx;
        height: 108rpx;
        border-radius: 50%;
      }
      .user {
        flex: 1;
        margin-left: 20rpx;
        p {
          margin: 0;
          padding: 0;
        }
        .name {
          display: inline-block;
          font-size: 30rpx;
          color: #494949;
          line-height: 40rpx;
        }
        .tag {
          margin-left: 18rpx;
          vertical-align: middle;
          display: inline-block;
          padding: 0rpx 22rpx;
          font-size: 20rpx;
          color: #fff;
          border-radius: 20rpx;
          line-height: 34rpx;
          background-color: #76ce96;
        }
        .data {
          margin-top: 17rpx;
          font-size: 20rpx;
          line-height: 30rpx;
          color: #969696;
          span {
            margin-right: 30rpx;
          }
          .recommend {
            color: #606060;
          }
        }
      }
      .phone {
        width: 80rpx;
        height: 80rpx;
        vertical-align: middle;
      }
    }
    .bottom {
      font-size: 18rpx;
      padding: 18rpx 0;
      span {
        color: #969696;
        margin-right: 16rpx;
      }
    }
  }
}
</style>
