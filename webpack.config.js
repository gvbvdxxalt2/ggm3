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
    port: 1500,
    client: {
      overlay: {
        errors: true, // Keep displaying errors
        warnings: false, // Disable displaying warnings
        runtimeErrors: true, // Keep displaying runtime errors
      },
    },
  },
  cache: {
    type: "filesystem",
    allowCollectingMemory: true,
  },
  devtool: false,
  entry: {
    interface: "./src/interface/index.js",
    //webgltest: "./src/interface/webgltest.js",
    engine: "./src/engine/export-engine.js",
  },
  optimization: {
    splitChunks: false,
    minimize: false
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].js",
  },
  performance: {
    /*hints: "warning",*/
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
        test: /\.xml$/i,
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
        test: /\.vert$/i,
        use: [
          {
            loader: "raw-loader",
          },
        ],
      },
      {
        test: /\.frag$/i,
        use: [
          {
            loader: "raw-loader",
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
    new HtmlWebpackPlugin({
      filename: `test/engine.html`,
      title: `Engine testing ground`,
      template: "./src/base_html_plain.html",
      chunks: ["engine"],
    }),
    /*new HtmlWebpackPlugin({
      filename: `test.html`,
      title: `WebGL test`,
      template: "./src/base_html.html",
      chunks: ["webgltest"],
    }),*/
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
