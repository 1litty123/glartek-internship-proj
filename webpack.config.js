var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var config = {
    entry: "./app/index.jsx",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bundle.js",
        publicPath: "/"
    },
        devtool: "source-map",

    plugins: [
        new ExtractTextPlugin({
            filename: "styles.css",
            disable: false,
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin({}),
        new webpack.ProvidePlugin({
            "$": "jquery",
            "jQuery": "jquery",
            "window.jQuery": "jquery",
            "window.$": "jquery"

        }),
        new webpack.optimize.CommonsChunkPlugin({ name:"vendor", filename:"vendor.js", minChunks: Infinity}),
        new webpack.DefinePlugin({
            "require.specified": "require.resolve"
        })
    ],
    module: {
        rules: [
            {
                test: /\.js[x]?$/,
                use: [{
                    loader:"react-hot", 
                    loader:"babel-loader"
                }],
                exclude: "/node_modules/",
                include: path.resolve(__dirname, "app")
            },
            {
                test: /\.css$/,
                use:ExtractTextPlugin.extract({
                    fallback: "style-loader", 
                    use: "css-loader"
                })
            },
            {
                test: /\.(png|jpg|gif)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=100000"
            },
            {
                test: /\.(eot|com|json|ttf|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=application/octet-stream"
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url-loader?limit=10000&mimetype=image/svg+xml"
            }
        ]
    },
    resolve: {
        extensions:[" ",".webpack.js",".web.js",".js",".jsx"]
    }
};


module.exports = config;
