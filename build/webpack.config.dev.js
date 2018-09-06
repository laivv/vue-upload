const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base.js')
const basePath = path.join(__dirname, '../')
const htmlWebpackPlugin = require('html-webpack-plugin')

module.exports = merge(base, {
  entry: {
    vendor: ['vue'],
    app: path.join(basePath, './src/main.js')
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.css$/,
        loader: ['style-loader', 'css-loader']
      }
    ]
  },
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    contentBase: path.join(basePath, './dist'),
    open: true, // 自动打开浏览器
    index: 'index.html', // 与HtmlWebpackPlugin中配置filename一样
    inline: true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
    hot: true,
    proxy: {
      '/api': {
        target: 'http://op-local.uoko.com',
        secure: false,
        changeOrigin: true
      },
      '/HouseImages': {
        target: 'http://op-local.uoko.com',
        secure: false,
        changeOrigin: true
      }
    }
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new htmlWebpackPlugin({
      title: '文件上传 - uk-upload',
      chunks: ['vendor', 'app'],
      filename: 'index.html',
      template: path.join(basePath, './index.html'),
      inject: 'body',
      chunksSortMode: 'dependency'
    })
  ]
})
