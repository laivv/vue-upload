const path = require("path");
const webpack = require('webpack');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const basePath = path.join (__dirname,'../');
module.exports = {
   
    output: {
        filename: "[name]/[name].min.js",
        path: path.join(basePath, "dist"),
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
                test: /\.(gif|png|jpg|woff|svg|eot|ttf)$/,
                loader: ['url-loader']
            }
        ]
    },
    plugins: [
        new VueLoaderPlugin(),
       
    ],
}