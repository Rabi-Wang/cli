const { version } = require('../package.json')
const path = require('path')

module.exports = {
  publicPath: `/${version}/`,
  distName: 'dist',
  distDir: path.resolve(__dirname, '../dist/'),
  srcDir: path.resolve(__dirname, `../src/`),
  htmlName: 'index.html',
  zipName: 'dist',
  zipOutputPath: path.resolve(__dirname, '../'),
  resourceFrom: path.resolve(__dirname, '../src/public/'),
  version,
}
