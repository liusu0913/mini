<script>
export default {
  onLaunch () {
    uni.setStorageSync('mini_token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqb2JJZCI6IjEwMDAxIiwibmFtZSI6IueOi-S6lCIsInBob25lIjoiMTg4ODg4ODg4ODgiLCJjb21wYW55SWQiOiI4NiIsInJvbGUiOjMsImJlbG9uZ0NvbXBhbnkiOjEsImlhdCI6MTY0MTcxNDQ2NCwiZXhwIjoxNjQyMzE5MjY0fQ.8ogT_LXpkmk5rCZ9DKrGTXQJmI-ZHHrgQjHDfJk14D0');
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
  // @import "./common/uni.scss";
</style>

<style lang="less">
body {
  color: #333;
}
</style>
