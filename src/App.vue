<script>
export default {
  onLaunch () {
    // console.log('App Launch')
    /* #ifdef MP-WEIXIN */
    console.log('wx')
    /* #endif */
  },
  onShow () {
    // console.log('App Show')
  },
  onHide () {
    // console.log('App Hide')
  },
  globalData: {
  },
  onError(error) {
    console.error(error)
  }
}
</script>

<style lang="scss">
  @import "./common/uni.scss";
</style>

<style lang="less">
body {
  color: #333;
}
</style>
