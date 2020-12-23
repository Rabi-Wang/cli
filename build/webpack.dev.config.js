const path = require('path')
const webpack = require('webpack')
const { version } = require('../package.json')
const { AutoRoutesWebpackPlugin, AutoZipWebpackPlugin } = require('./webpackPlugin')

let proxies = []
let proxy = {}
// let proxiesPath = path.join(__dirname, '../src/utils/proxies')
// fs.readdirSync(proxiesPath).forEach(file => file !== 'enums.js' && proxies.push(require(`${proxiesPath}/${file}`)))
// proxies.forEach(p => Object.keys(p).forEach(k => proxy[k] = p[k]))

module.exports = (env, argv) => {
  let config = {
    devServer: {
      // contentBase: path.join(__dirname, '../dist'),
      historyApiFallback: {
        index: `/${version}/`
      },
      compress: true,
      host: '127.0.0.1',
      port: 9001,
      hot: true,
      // proxy,
      publicPath: `/${version}/`,
      // writeToDisk: true,
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

  if (argv.isDevServer) {
    config.plugins.push(new AutoRoutesWebpackPlugin({
      routesPath: path.resolve(__dirname, '../src/config/routes.ts'),
      pagesPath: path.resolve(__dirname, '../src/pages'),
    }))
  } else {
    config.plugins.push(new AutoZipWebpackPlugin({
      filename: 'dist',
      entry: path.join(__dirname, '../dist'),
      outputPath: path.join(__dirname, '../'),
    }))
  }

  return config
}
