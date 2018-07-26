const path = require("path");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const htmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: {
       vendor:['vue'],
       app:__dirname + '/src/main.js',
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
    module:{
        rules:[
            {
                test:/\.js$/,
                loader:'babel-loader',
                exclude:/node_modules/,
               
                
            },
            {
                test:/\.vue$/,
                loader:'vue-loader'
            },
            {
                test:/\.css$/,
                loader:['style-loader','css-loader']
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
            chunksSortMode:'dependency'
        })
    ],
}