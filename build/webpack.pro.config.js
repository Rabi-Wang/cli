const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { AutoZipWebpackPlugin } = require('./webpackPlugin')
const { zipOutputPath, zipName, distDir } = require('./paths')

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
        filename: zipName,
        entry: distDir,
        outputPath: zipOutputPath,
      }),
      new CleanWebpackPlugin(),
    ],
  }

  return config
}
