const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const path = require('path')
const { AutoZipWebpackPlugin } = require('./webpackPlugin/auto-zip-webpack-plugin')

module.exports = {
  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      HTTP_ENV: JSON.stringify('production'),
    }),
    new CleanWebpackPlugin(),
    new AutoZipWebpackPlugin({
      filename: 'dist',
      entry: path.join(__dirname, '../dist'),
      outputPath: path.join(__dirname, '../'),
    }),
  ],
}
