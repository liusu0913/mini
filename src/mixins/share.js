// #ifdef H5
import webApi from '@/api/web'
import scriptjs from 'scriptjs'

export default {
  data() {
    return {
      share: {

      }
    }
  },
  mounted() {
    scriptjs('https://res.wx.qq.com/open/js/jweixin-1.6.0.js', () => {
      this.loadTicket()
    })
  },
  methods: {
    async loadTicket() {
      try {
        const url = location.href.split('#')[0]
        const data = await webApi.getTicket({
          url: encodeURIComponent(url)
        })
        wx.config(data)
        wx.ready(() => {
          const share_title = '麦凯盈营销云'
          const share_desc = '麦凯盈麦凯盈营销云小程序'
          const share_link = url
          const share_img = 'https://img-1307195053.cos.ap-nanjing.myqcloud.com/maikaiying.jpg'
          wx.showOptionMenu()
          wx.onMenuShareTimeline({
            title: share_title,
            link: share_link,
            imgUrl: share_img
          })
          wx.onMenuShareAppMessage({
            title: share_title,
            desc: share_desc,
            link: share_link,
            imgUrl: share_img
          })
        })
      } catch (ex) {
        uni.showToast({
          title: ex.message,
          duration: 2000,
          icon: 'none'
        })
      }
    }
  }
}
// #endif
// #ifdef MP-WEIXIN
// export default {}
// #endif
