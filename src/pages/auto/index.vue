<template>
  <div>
    <web-view
      :src="`${src}#wechat_redirect`"
    />
  </div>
</template>

<script>

export default {
  data() {
    return {
      src: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa740aa4cf482d798&redirect_uri=https%3A%2F%2Fmarketing-tech.cn%2Fh5%2FautoH5.html%3Ftoken%3D${encodeURIComponent(uni.getStorageSync('mini_token'))}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
      // src: `https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa740aa4cf482d798&redirect_uri=http%3A%2F%2Fmarketing-tech.cn%2FautoH5%3Ftoken%3D${encodeURIComponent(uni.getStorageSync('mini_token'))}&response_type=code&scope=snsapi_userinfo#wechat_redirect`
    }
  },
  mounted(){
    console.log(this.src)
  }
}
</script>
