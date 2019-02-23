const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const base = require('./webpack.config.base.js')
const basePath = path.resolve(__dirname, '../')
const htmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const glob = require('glob')

function getEntries() {
  var files = glob.sync('../src/*/index.js')
  var newEntries = {}
  files.forEach(function (file) {
    var name = /.*\/(.+)\/index\.js$/.exec(file)[1]
    newEntries[name] = path.join(__dirname, file)
  })
  return newEntries
}
getEntries()

module.exports = merge(base, {
  entry: getEntries(),
  externals: {
    vue: 'Vue'
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
					use: [{ loader: 'css-loader' }, { loader: 'postcss-loader' }],
        })
      }
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: '文件上传 - upload',
      chunks: ['upload'],
      filename: 'index.html',
      template: path.join(basePath, './index.html'),
      inject: 'head',
      chunksSortMode: 'dependency',
      isProd: true
    }),
    new ExtractTextPlugin('[name]/[name].min.css'),
    new OptimizeCssAssetsPlugin()
  ]
})
