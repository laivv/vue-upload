const path = require("path");
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    entry: {
        vendor: ['vue'],
        app: __dirname + '/src/main.js',
        'uk-upload': __dirname + "/src/uk-upload/index.js",
        'uk-previewer': __dirname + "/src/uk-previewer/index.js",
    },
    output: {
        filename: "[name].min.js",
        path: path.join(__dirname, "dist"),
        // library:"UkPreviewer"
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            /* 'vue$': 'vue/dist/vue.esm.js'*/
            'vue$': 'vue/dist/vue.js'
            // 'vue$': 'vue/dist/vue.common.js'
        }
    },
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        open: true, // 自动打开浏览器
        index: 'index.html', // 与HtmlWebpackPlugin中配置filename一样
        inline: true, // 默认为true, 意思是，在打包时会注入一段代码到最后的js文件中，用来监视页面的改动而自动刷新页面,当为false时，网页自动刷新的模式是iframe，也就是将模板页放在一个frame中
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.css$/,
                loader: ['style-loader', 'css-loader']
            },
            {
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)$/,
                loader: ['url-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
        new htmlWebpackPlugin({
            filename: 'index.html',
            template: __dirname + '/index.html',
            inject: 'body',
            chunksSortMode: 'dependency'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
}