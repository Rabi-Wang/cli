const webpack = require('webpack')
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
    new AutoZipWebpackPlugin({
      filename: 'dist',
      entry: path.join(__dirname, '../dist'),
      outputPath: path.join(__dirname, '../'),
    }),
  ],
}
