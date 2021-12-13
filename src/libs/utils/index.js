const utils = {
}
const utilFiles = require.context('.', false, /\.js$/)
utilFiles.keys().forEach((fileName) => {
  if (fileName !== './index.js') {
    const util = require(`${fileName}`)
    if (util.default) {
      const modleName = fileName.slice(2).split('.')[0]
      utils[modleName] = require(`${fileName}`).default
    } else {
      Object.keys(util).forEach((key) => {
        utils[key] = util[key]
      })
    }
  }
})

module.exports = utils
