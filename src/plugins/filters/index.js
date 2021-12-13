
let filters = {
}
const filterFiles = require.context('.', false, /\.js$/)
filterFiles.keys().forEach((fileName) => {
  if (fileName !== './index.js') {
    filters = Object.assign(require(`${fileName}`).default, filters)
  }
})

/**
 * 注意：命名尽量以模块名称为前缀，如status_、date_，避免命名冲突
 */
module.exports = filters
