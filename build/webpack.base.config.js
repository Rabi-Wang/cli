const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const webpack = require('webpack')
const threadLoader = require('thread-loader')
const { version } = require('../package.json')
const themeVars = require('../theme.config')()

// thread-loader预热
threadLoader.warmup({}, [
  'babel-loader',
  'less-loader',
])

// less变量
const layoutLess = lessToJs(fs.readFileSync('./src/themes/layout.less', 'utf8'), { resolveVariables: true, stripPrefix: true })
const layoutVars = Object.entries(layoutLess).reduce((vars, entry) => {
  let [key, value] = entry
  key = key.replace(/\-(\w)/g, (all, letter) => letter.toUpperCase())
  return { ...vars, [key]: parseInt(value) }
}, {})

module.exports = {
  entry: path.join(__dirname, '../src/index.js'),

  output: {
    filename: '[name].[hash].js',
    path: path.resolve(__dirname, `../dist/${version}`),
    publicPath: `/${version}/`,
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.less'],
    alias: {
      src: path.join(__dirname, '../src'),
      components: path.join(__dirname, '../src/components'),
      utils: path.join(__dirname, '../src/utils'),
      models: path.join(__dirname, '../src/models'),
      routes: path.join(__dirname, '../src/routes'),
      services: path.join(__dirname, '../src/services'),
      public: path.join(__dirname, '../src/public'),
      svg: path.join(__dirname, '../src/svg'),
      themes: path.join(__dirname, '../src/themes'),
      config: path.join(__dirname, '../src/utils/config'),
      '@hooks': path.join(__dirname, '../src/hooks'),
    },
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: [
          'thread-loader', // 多进程打包
          {
            loader: 'babel-loader',
            options: {
              cacheDirectory: true,
              presets: [
                [
                  '@babel/preset-env',
                  {
                    // debug: true,
                    // targets: {
                    //   esmodules: true,
                    // },
                    useBuiltIns: 'usage',
                    corejs: 3,
                  },
                ],
                '@babel/preset-react',
              ],
              plugins: [
                '@babel/plugin-proposal-export-default-from', // 支持export xxx from 'xxx' 语法
                '@babel/plugin-proposal-class-properties', // 支持class语法
                '@babel/plugin-transform-runtime',
                '@babel/plugin-proposal-object-rest-spread', // 支持对象解构语法
                '@babel/plugin-transform-modules-commonjs', // 转换成commonJs规范,应对订单中心混用规范的措施
                ['import', { libraryName: 'antd', style: true, libraryDirectory: 'es' }, 'antd'], // 支持antd样式按需引入
                ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'], // 支持lodash按需引入
              ],
            },
          },
          // 'ts-loader',
          // {
          //   loader: 'eslint-loader',
          // },
        ],
        // include: [
        //   path.resolve(__dirname, '../src/'),
        //   path.resolve(__dirname, '../node_modules/antd/'),
        //   path.resolve(__dirname, '../node_modules/lodash/'),
        // ],
        exclude: /node_modules/,
      },
      {
        test: /\.less$/,
        use: [
          'thread-loader',
          'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     modules: {
          //       namedExport: true,
          //     },
          //   },
          // },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: true,
              // modules: {
              //   compileType: 'module',
              //   mode: 'local',
              //   auto: true,
              //   localIdentName: '[name]-[hash:base64:5]',
              //   namedExport: true,
              // },
              importLoaders: 2,
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
          // path.resolve(__dirname, '../node_modules/antd/'),
        ],
      },
      // antd样式处理
      {
        test: /\.less$/,
        use: [
          'thread-loader',
          'style-loader',
          // {
          //   loader: MiniCssExtractPlugin.loader,
          //   options: {
          //     modules: {
          //       namedExport: true,
          //     },
          //   },
          // },
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              // modules: true,
              modules: {
                compileType: 'module',
                mode: 'local',
                auto: true,
                localIdentName: '[name]-[hash:base64:5]',
                namedExport: true,
              },
              importLoaders: 2,
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
          path.resolve(__dirname, '../node_modules/antd/'),
        ],
      },
      // react-draft-wysiwyg样式处理
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              esModule: true,
              modules: true,
              // modules: {
              //   compileType: 'module',
              //   mode: 'local',
              //   auto: true,
              //   localIdentName: '[name]-[hash:base64:5]',
              //   namedExport: true,
              // },
              importLoaders: 1,
            },
          },
          // 'postcss-loader',
        ],
        include: [path.resolve(__dirname, '../node_modules/react-draft-wysiwyg/')],
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
          path.resolve(__dirname, '../src/svg/'),
          require.resolve('antd').replace(/index\.js$/, ''),
        ],
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, '../src/entry.ejs'),
      filename: path.resolve(__dirname, '../dist/index.html'),
    }),
    new webpack.DefinePlugin({
      LAYOUT_VARS: layoutVars,
    }),
    new CopyWebpackPlugin([{
      from: path.join(__dirname, '../src/public'),
      to: path.join(__dirname, '../dist'),
    }]),
    // new MiniCssExtractPlugin({
    //   filename: '[name].css',
    //   chunkFilename: '[id].css',
    // }),
  ],
}
