const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");
// const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const miniCssExtractPlugin = require("mini-css-extract-plugin");
const webpack = require("webpack");
const PurgeCss = require("purgecss-webpack-plugin");
const glob = require("glob");

const purgePath = {
  src: path.join(__dirname, "src"),
};

module.exports = {
  // entry is the entry for the js not html
  entry: {
    index: "./src/index.js",
    courses: "./src/pages/courses.js",
  },
  output: {
    filename: "[name].[contenthash].js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /.(png|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
    // provide plugin (adding mnt (moment library to a global object (window)))
    // that's why we can remove the import from the index.js
    // also lodash and jquery by default is been added to the global object (window)
    // that's why we remove their imports
    new webpack.ProvidePlugin({
      mnt: "moment",
    }),
    new htmlWebpackPlugin({
      template: "./src/index.html",
      // chunk is the entry
      // if the index.html is depending on the courses then you can download the both chunks
      // chunks: ["index", "courses"],
      chunks: ["index"],
      filename: "index.html",
      inject: true,
    }),
    new htmlWebpackPlugin({
      template: "./src/pages/courses.html",
      // chunk is the entry
      chunks: ["courses"],
      filename: "courses.html",
      inject: true,
    }),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
