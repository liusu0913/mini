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
          const share_title = 'Rocket-UniApp'
          const share_desc = 'Rocket-UniApp更懂开发者的多端同构框架，你值得拥有'
          const share_link = url
          const share_img = 'https://eyao.qq.com/node-docs/rocket.png'
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
