const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
const { merge } = require("webpack-merge");
const commonConfig = require("./webpack.common");

module.exports = merge(commonConfig, {
  // entry is the entry for the js not html
  devServer: {
    static: "./dist",
  },
  mode: "development",
  module: {
    rules: [
      {
        test: /\.css$/,
        // we remove style-loader that is responsible to inject css to the html
        // and instead , exract the css to an extra css files added to the bundle
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    // provide plugin (adding mnt (moment library to a global object (window)))
    // that's why we can remove the import from the index.js
    // also lodash and jquery by default is been added to the global object (window)
    // that's why we remove their imports
    new BundleAnalyzerPlugin({}),
  ],
});
