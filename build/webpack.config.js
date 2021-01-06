const { merge } = require('webpack-merge')
const webpack = require('webpack')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const baseConfig = require('./webpack.base.config')
const devConfig = require('./webpack.dev.config')
const proConfig = require('./webpack.pro.config')()

const smp = new SpeedMeasurePlugin()

module.exports = (env, argv) => {
  const config = !argv.isAnalyze ? (() => {
    switch (argv.mode) {
      case 'development': return (() => devConfig)()
      case 'production': return proConfig
      // 定义测试环境全局变量
      case 'none': return (() => {
        proConfig.plugins[0] = new webpack.DefinePlugin({
          HTTP_ENV: JSON.stringify('test'),
        })
        return () => proConfig
      })()
      default: return () => proConfig
    }
  })() : (() => {
    proConfig.plugins.push(new BundleAnalyzerPlugin())
    return () => proConfig
  })()

  return argv.isAnalyze ? smp.wrap(merge(baseConfig(env, argv), config(env, argv))) : merge(baseConfig(env, argv), config(env, argv))
}
