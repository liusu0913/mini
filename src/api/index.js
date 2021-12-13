const apis = {
}
const apiFiles = require.context('.', false, /\.js$/)
apiFiles.keys().forEach((fileName) => {
  if (fileName !== './index.js') {
    const modleName = fileName.slice(2).split('.')[0]
    apis[modleName] = require(`${fileName}`).default
  }
})
module.exports = apis
