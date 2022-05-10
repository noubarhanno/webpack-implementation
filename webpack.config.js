const path = require("path");
const htmlWebpackPlugin = require("html-webpack-plugin");
const copyPlugin = require("copy-webpack-plugin");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

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
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /.(png|jpeg|gif|svg)$/,
        type: "asset/resource",
      },
    ],
  },
  plugins: [
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
          // means start the structure from after the src
          context: "src",
        },
      ],
    }),
    new BundleAnalyzerPlugin({}),
  ],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
