const { version } = require('../package.json')
const path = require('path')

const basePath = process.cwd()

module.exports = {
  publicPath: `/${version}/`,
  distName: 'dist',
  distDir: path.resolve(basePath, './dist/'),
  srcDir: path.resolve(basePath, './src/'),
  htmlName: 'index.html',
  zipName: 'dist',
  zipOutputPath: basePath,
  resourceFrom: path.resolve(basePath, './src/public/'),
  version,
  nodeModulesDir: path.resolve(basePath, './node_modules')
}
