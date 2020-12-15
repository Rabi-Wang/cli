const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const threadLoader = require('thread-loader')
const { version } = require('../package.json')

const themeVars = (() => {
  const themePath = path.join(__dirname, '../src/themes/default.less')
  return lessToJs(fs.readFileSync(themePath, 'utf8'))
})()

// thread-loader预热
threadLoader.warmup({}, [
  'babel-loader',
  'less-loader',
  'ts-loader',
])

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, `../dist/${version}`),
    publicPath: `/${version}/`,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.less'],
    alias: {
      '@src': path.join(__dirname, '../src'),
      '@components': path.join(__dirname, '../src/components'),
      '@utils': path.join(__dirname, '../src/utils'),
      // '@routes': path.join(__dirname, '../src/routes'),
      // '@services': path.join(__dirname, '../src/services'),
      '@public': path.join(__dirname, '../src/public'),
      '@themes': path.join(__dirname, '../src/themes'),
      // '@hooks': path.join(__dirname, '../src/hooks'),
      '@stores': path.join(__dirname, '../src/stores'),
    },
  },

  module: {
    rules: [
      // {
      //   test: /\.(js|jsx)$/,
      //   use: [
      //     'thread-loader', // 多进程打包
      //     {
      //       loader: 'babel-loader',
      //       options: {
      //         cacheDirectory: true,
      //         presets: [
      //           [
      //             '@babel/preset-env',
      //             {
      //               useBuiltIns: 'usage',
      //               corejs: 3,
      //             },
      //           ],
      //           '@babel/preset-react',
      //         ],
      //         plugins: [
      //           '@babel/plugin-proposal-export-default-from', // 支持export xxx from 'xxx' 语法
      //           '@babel/plugin-proposal-class-properties', // 支持class语法
      //           '@babel/plugin-transform-runtime',
      //           '@babel/plugin-proposal-object-rest-spread', // 支持对象解构语法
      //           ['import', { libraryName: 'antd', style: true, libraryDirectory: 'es' }, 'antd'], // 支持antd样式按需引入
      //           // ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'], // 支持lodash按需引入
      //         ],
      //       },
      //     },
      //   ],
      //   exclude: /node_modules/,
      // },
      {
        test: /\.tsx?$/,
        use: [
          'thread-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true,
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'thread-loader',
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                auto: true,
                localIdentName: '[hash:base64:6]',
              },
              importLoaders: 1,
            },
          },
          // 'postcss-loader',
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                modifyVars: themeVars,
                javascriptEnabled: true,
              },
            },
          },
        ],
        include: [
          path.resolve(__dirname, '../src/'),
          path.resolve(__dirname, '../node_modules/antd/'),
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [
          // path.resolve(__dirname, '../src/svg/'),
          require.resolve('antd').replace(/index\.js$/, ''),
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/index.html'),
      filename: path.resolve(__dirname, '../dist/index.html'),
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../src/public'),
      to: path.join(__dirname, '../dist'),
    }]),
    new CleanWebpackPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),
  ],
}
