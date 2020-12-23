const webpack = require('webpack')
const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { AutoZipWebpackPlugin } = require('./webpackPlugin')

module.exports = (env, argv) => {
  let config = {
    optimization: {
      minimize: true,
    },
    plugins: [
      new webpack.DefinePlugin({
        HTTP_ENV: JSON.stringify('production'),
      }),
      new AutoZipWebpackPlugin({
        filename: 'dist',
        entry: path.join(__dirname, '../dist'),
        outputPath: path.join(__dirname, '../'),
      }),
      new CleanWebpackPlugin(),
    ],
  }

  return config
}
