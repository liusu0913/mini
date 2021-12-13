// vue.config.js
const { envUrlMap } = require('./src/libs/request/envConfig')
const { NODE_ENV } = process.env
console.log(envUrlMap.mock.url, envUrlMap.development.url, envUrlMap.production.url)
module.exports = {
  devServer: {
    proxy: {
      '/eyaomock': {
        /* 目标代理服务器地址 */
        target: envUrlMap.mock.url,
        /* 允许跨域 */
        changeOrigin: true,
        pathRewrite: {
          '^/eyaomock': ''
        }
      },
      '/eyaodevelopment': {
        /* 目标代理服务器地址 */
        target: envUrlMap.development.url,
        /* 允许跨域 */
        changeOrigin: true,
        pathRewrite: {
          '^/eyaodevelopment': ''
        }
      },
      '/eyaoproduction': {
        /* 目标代理服务器地址 */
        target: envUrlMap.production.url,
        /* 允许跨域 */
        changeOrigin: true,
        pathRewrite: {
          '^/eyaoproduction': ''
        }
      }
    }
  },
  transpileDependencies: ['luch-request'],
  css: {
    loaderOptions: {
      // 给 sass-loader 传递选项
      sass: {
        // @/ 是 src/ 的别名
        // 所以这里假设你有 `src/variables.sass` 这个文件
        // 注意：在 sass-loader v8 中，这个选项名是 "prependData"
        additionalData: '@import "~@/uni.sass"'
      },
      // 默认情况下 `sass` 选项会同时对 `sass` 和 `scss` 语法同时生效
      // 因为 `scss` 语法在内部也是由 sass-loader 处理的
      // 但是在配置 `prependData` 选项的时候
      // `scss` 语法会要求语句结尾必须有分号，`sass` 则要求必须没有分号
      // 在这种情况下，我们可以使用 `scss` 选项，对 `scss` 语法进行单独配置

      less: {
      }
    }
  },
  // --report 唤起
  chainWebpack: config => {
    if (NODE_ENV === 'report') {
      config
        .plugin('webpack-bundle-analyzer')
        .use(require('webpack-bundle-analyzer')
          .BundleAnalyzerPlugin)
    }
  }
}
