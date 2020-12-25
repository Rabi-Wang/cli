const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const lessToJs = require('less-vars-to-js')
const fs = require('fs')
const threadLoader = require('thread-loader')
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin')
const {
  srcDir,
  distDir,
  publicPath,
  version,
  resourceFrom,
  nodeModulesDir,
} = require('./paths')

const themeVars = (() => {
  const themePath = path.join(srcDir, '/themes/index.global.less')
  return lessToJs(fs.readFileSync(themePath, 'utf8'))
})()

// thread-loader预热
threadLoader.warmup({}, [
  'babel-loader',
  'less-loader',
])

module.exports = (env, argv) => {
  return {
    entry: `${srcDir}/index.tsx`,

    output: {
      filename: '[name].[hash].js',
      path:  `${distDir}/${version}`,
      publicPath: publicPath,
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.less'],
      alias: {
        '@src': srcDir,
        '@components': path.join(srcDir, '/components'),
        '@utils': path.join(srcDir, '/utils'),
        '@pages': path.join(srcDir, '/pages'),
        '@services': path.join(srcDir, '/services'),
        '@public': path.join(srcDir, '/public'),
        '@themes': path.join(srcDir, '/themes'),
        '@hooks': path.join(srcDir, '/hooks'),
        '@stores': path.join(srcDir, '/stores'),
        '@config': path.join(srcDir, '/config'),
      },
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          use: [
            'thread-loader', // 多进程打包
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true,
                presets: [
                  // [
                  //   '@babel/preset-env',
                  //   {
                  //     useBuiltIns: 'usage',
                  //     corejs: 3,
                  //   },
                  // ],
                  '@babel/preset-env',
                  '@babel/preset-react',
                  '@babel/preset-typescript',
                ],
                plugins: [
                  '@babel/plugin-transform-runtime', // polyfill 按需引入
                  '@babel/plugin-proposal-export-default-from', // 支持export xxx from 'xxx' 语法
                  ['@babel/plugin-proposal-decorators', { legacy: true }], // 支持装饰器语法, class和装饰器顺序不能反
                  ["@babel/plugin-proposal-class-properties", { "loose": true }], // 支持class语法
                  '@babel/plugin-proposal-object-rest-spread', // 支持对象解构语法
                  '@babel/plugin-syntax-dynamic-import', // () => import('xxx')
                  ['import', { libraryName: 'antd', style: true, libraryDirectory: 'es' }, 'antd'], // 支持antd样式按需引入
                  // ['import', { libraryName: 'lodash', libraryDirectory: '', camel2DashComponentName: false }, 'lodash'], // 支持lodash按需引入
                ],
              },
            },
          ],
          exclude: /node_modules/,
        },
        {
          test: /\.less$/,
          use: [
            // 'thread-loader',
            `${argv.mode === 'development' ? MiniCssExtractPlugin.loader : 'style-loader'}`,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  auto: true,
                  localIdentName: '[name]-[hash:base64:5]',
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
          include: [srcDir],
          exclude: /\.module\.less$/,
        },
        // css module 支持
        {
          test: /\.module\.less$/,
          use: [
            // 'thread-loader',
            `${argv.mode === 'development' ? MiniCssExtractPlugin.loader : 'style-loader'}`,
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1,
              },
            },
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
          exclude: /node_modules/,
        },
        // antd 样式
        {
          test: /\.less$/,
          use: [
            'thread-loader',
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: true,
              },
            },
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
            path.join(nodeModulesDir, '/antd/'),
          ],
          exclude: /src/
        },
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [{ loader: 'url-loader' }],
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
        template: `${srcDir}/index.html`,
        filename: argv.isDevServer ? 'index.html' : `${distDir}/index.html`,
      }),
      new CopyWebpackPlugin([{
        from: resourceFrom,
        to: distDir,
      }]),
      new MiniCssExtractPlugin({
        filename: '[name].css',
      }),
      new HardSourceWebpackPlugin(),
    ],
  }
}
