/* eslint-disable standard/no-callback-literal */
import COS from 'cos-wx-sdk-v5'

const cos = new COS({
  // ForcePathStyle: true, // 如果使用了很多存储桶，可以通过打开后缀式，减少配置白名单域名数量，请求时会用地域域名
  getAuthorization (options, callback) {
    // 异步获取临时密钥
    wx.request({
      url: 'https://web.qinmudi.cn/third/test/qcloud/cos/get_ticket',
      method: 'post',
      data: {
        bucket: options.Bucket,
        region: options.Region
      },
      dataType: 'json',
      success (result) {
        const { data } = result.data
        const credentials = data && data.credentials
        if (!data || !credentials) return console.error('credentials invalid')
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          XCosSecurityToken: credentials.sessionToken,
          // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
          StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
          ExpiredTime: data.expiredTime // 时间戳，单位秒，如：1580000900
        })
      }
    })
  }
})

export default cos
