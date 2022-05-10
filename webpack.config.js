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
  devServer: {
    static: "./dist",
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        // we remove style-loader that is responsible to inject css to the html
        // and instead , exract the css to an extra css files added to the bundle
        use: [miniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: [miniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
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
    new copyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, "src/assets/images/*"),
          to: path.resolve(__dirname, "dist"),
          // means start the structure in the dist from after the src
          context: "src",
        },
      ],
    }),
    new PurgeCss({
      // the path will not work with resolve , instead it need to be as below
      // ** means all the folders
      // * means all the files
      // nodir means no directory as per the configuration of glob
      paths: glob.sync(`${purgePath.src}/**/*`, { nodir: true }),
      // if you have some classes been added dynamically and you want to ignore purge it,
      // add it to the safelist (you can pass body, h1 or any think you want to ignore)
      safelist: ["dummy-css"],
    }),
    new miniCssExtractPlugin(),
    // new BundleAnalyzerPlugin({}),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
