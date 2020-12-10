const compressing = require('compressing')

class AutoZipWebpackPlugin {
  constructor (options) {
    const { entry, outputPath, filename } = options
    this.entry = entry
    this.outputPath = outputPath
    this.filename = filename
  }

  apply (compiler) {
    // compiler.plugin('done', (stats) => { // webpack3
    compiler.hooks.done.tapAsync('AutoZipWebpackPlugin', (compilation, callback) => { // webpack4
      compressing.zip.compressDir(this.entry, `${this.outputPath}/${this.filename}.zip`).then(callback())
    })
  }
}

module.exports = {
  AutoZipWebpackPlugin,
}
