const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const DISTRIBUTE_PATH = "dist";

module.exports = () => {
  return {
    entry: {
      "scripts/app": "./src/script/index.js"
    },
    mode: "development",
    output: {
      filename: "[name].js",
      path: path.resolve(__dirname, DISTRIBUTE_PATH)
    },
    devServer: {
      contentBase: path.join(__dirname, DISTRIBUTE_PATH),
      compress: true,
      port: 8080
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: "html-loader"
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: "style-loader",
              options: { sourceMap: true }
            },
            {
              loader: "css-loader",
              options: { sourceMap: true }
            },
            {
              loader: "postcss-loader",
              options: { sourceMap: true }
            },
            {
              loader: "sass-loader",
              options: { sourceMap: true }
            }
          ]
        }
      ]
    },
    resolve: {
      modules: ["node_modules"]
    },
    plugins: [
      new HtmlWebpackPlugin({
        inject: true,
        template: path.join(__dirname, "src/index.html")
      })
    ]
  };
};
