const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: "css/[name].css",
  disable: process.env.NODE_ENV === "development"
});
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'scripts/app': './src/script/index.js',
    style: './src/scss/index.scss'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8080
  },
  module: {
    loaders: [
    ],
    rules: [{
      test: /\.scss$/,
      use: extractSass.extract({
        use: [
          {
            loader: "css-loader",
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [require('postcss-cssnext'), require('autoprefixer'), require('cssnano')]
            }
          },
            {
            loader: "sass-loader"
          }
        ],
        fallback: "style-loader"
      })
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html'
    }),
    extractSass,
    new CopyWebpackPlugin([
      { from: './src/images', to: 'images'}
    ]),
    new CopyWebpackPlugin([
      { from: './src/fonts', to: 'fonts'}
    ])
  ]
};