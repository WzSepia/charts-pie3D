const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require("copy-webpack-plugin");

const config = {
  mode: "development",
  entry: {
    index: "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].min.js",
    // filename: "[name].[chunkhash].js",
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      { test: /\.css$/, use: ["style-loader", "css-loader"] },
      {
        test: /\.json$/,
        use: ["file-loader", "url-loader"],
        type: "./src/asset/resource",
      },
    ],
  },
  devServer: {
    static: "./dist",
    host: "localhost",
    port: "8080",
    https: false,
    hot: true,
    proxy: {},
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./src/asset/resource/Arial Unicode MS_Regular.json", //json文件路径
          to: path.resolve(__dirname, "./dist/fonts/"), //打包后文件路径
        },
      ],
    }),
  ],
};

module.exports = config;