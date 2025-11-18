const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");
try {
  require("fs").rmSync("./dist", { recursive: true });
} catch (e) {}

module.exports = {
  mode: "production",
  devServer: {
    allowedHosts: "all",
    port: 3958,
  },
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
  devtool: false,
  entry: {
    interface: "./src/interface/index.js",
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      name: "shared",
    },
    //minimize: false
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].bundle.js",
  },
  performance: {
    hints: "warning",
    assetFilter: function (assetFilename) {
      //Ignore warnings for media assets which are typically large files.
      return assetFilename.endsWith(".js") || assetFilename.endsWith(".css");
    },
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          {
            loader: "raw-loader",
            options: {
              esModule: false,
            },
          },
        ],
        type: "javascript/auto", // Fix for raw-loader
      },
      {
        test: /\.txt$/i,
        use: [
          {
            loader: "raw-loader",
            options: {
              esModule: false,
            },
          },
        ],
        type: "javascript/auto",
      },
      {
        test: /\.ttf$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
      {
        test: /\.otf$/i,
        use: [
          {
            loader: "url-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: `index.html`,
      title: `Gvbvdxx Game Maker 3`,
      template: "./src/base_html.html",
      chunks: ["interface"],
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "./static",
          to: ".",
          noErrorOnMissing: true,
        },
      ],
    }),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
  ],
};
