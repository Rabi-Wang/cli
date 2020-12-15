const { merge } = require('webpack-merge')
const webpack = require('webpack')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const proConfig = require('./webpack.pro.config')
const { AutoZipWebpackPlugin } = require('./webpackPlugin/auto-zip-webpack-plugin')

const smp = new SpeedMeasurePlugin()

module.exports = (env, argv) => {
  const config = !argv.isAnalyze ? (() => {
    switch (argv.mode) {
      case 'development': return (() => {
        !argv.isDevServer && devConfig.plugins.push(
          new AutoZipWebpackPlugin({
            filename: 'dist',
            entry: path.join(__dirname, '../dist'),
            outputPath: path.join(__dirname, '../'),
          })
        )
        return devConfig
      })()
      case 'production': return proConfig
      // 定义测试环境全局变量
      case 'none': return (() => {
        console.log(proConfig.plugins)
        proConfig.plugins[0] = new webpack.DefinePlugin({
          HTTP_ENV: JSON.stringify('test'),
        })
        return proConfig
      })()
      default: return proConfig
    }
  })() : (() => {
    proConfig.plugins.push(new BundleAnalyzerPlugin())
    return proConfig
  })()

  return argv.isAnalyze ? smp.wrap(merge(baseConfig, config)) : merge(baseConfig, config)
}
