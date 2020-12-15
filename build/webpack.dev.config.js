const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const { version } = require('../package.json')

let proxies = []
let proxy = {}
// let proxiesPath = path.join(__dirname, '../src/utils/proxies')
// fs.readdirSync(proxiesPath).forEach(file => file !== 'enums.js' && proxies.push(require(`${proxiesPath}/${file}`)))
// proxies.forEach(p => Object.keys(p).forEach(k => proxy[k] = p[k]))

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, '../dist'),
    historyApiFallback: true,
    compress: true,
    host: '127.0.0.1',
    port: 9000,
    hot: true,
    // proxy,
    publicPath: `/${version}/`,
    writeToDisk: true,
  },

  devtool: 'cheap-module-eval-source-map',

  optimization: {
    minimize: false,
  },

  plugins: [
    new webpack.DefinePlugin({
      HTTP_ENV: JSON.stringify('development'),
    }),
  ],
}
