const path = require("path");
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.config.base.js');
const basePath = path.resolve (__dirname,'../');
const htmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(base,{
    entry: {
        'uk-upload':path.join( basePath ,"./src/uk-upload/index.js"),
        'uk-previewer': path.join(basePath , "./src/uk-previewer/index.js"),
        'uk-video-player': path.join(basePath , "./src/uk-video-player/index.js")
    },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                  })
            }
        ]
    },  
    plugins:[
        new htmlWebpackPlugin({
            title:'文件上传 - uk-upload',
            chunks:['uk-upload'],
            filename: 'index.html',
            template: path.join(basePath,'./index.html'),
            inject: 'head',
            chunksSortMode: 'dependency',
            isProd:true
        }),
        new ExtractTextPlugin('[name].min.css'),
        new OptimizeCssAssetsPlugin(),
    ]
})