const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const extractSass = new ExtractTextPlugin({
  filename: (getPath) => {
    return getPath('css/[name].css').replace('css/scripts', 'css');
  },
  allChunks: true
});
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = env => {
  const distributePath = env.production ? 'dist' : 'dist';

  return {
    entry: {
      'scripts/app': './src/script/index.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, distributePath),
    },
    devServer: {
      contentBase: path.join(__dirname, distributePath),
      compress: true,
      port: 8080
    },
    module: {
      loaders: [
      ],
      rules: [
        {
          test: /\.png$/,
          use: [ 'url-loader?mimetype=image/png' ],
          exclude: [path.resolve(__dirname, './sprite')]

        },
        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
        },
        {
          test: /\.html$/,
          use: [ {
            loader: 'html-loader',
          }]
        },
        {
          test: /\.scss$/,
          use: extractSass.extract({
            use: [
              {
                loader: 'css-loader',
                options: {
                  url: false,
                  minimize: true,
                }
              },
              {
                loader: 'postcss-loader',
                options: {
                  plugins: () => [require('postcss-cssnext')]
                }
              },
              {
                loader: 'sass-loader'
              }
            ],
            fallback: 'style-loader'
          })
        }
      ]
    },
    resolve: {
      modules: ['node_modules', 'spritesmith-generated'],
    },
    plugins: [
      new CleanWebpackPlugin([distributePath]),
      new SpritesmithPlugin({
        src: {
          cwd: path.resolve(__dirname, 'src/sprite'),
          glob: '*.png'
        },
        target: {
          image: path.resolve(__dirname, distributePath + '/images/sprite.png'),
          css: [
            [path.resolve(__dirname, 'src/scss/common/sprite.scss'), {
              format: 'handlebars_based_template'
            }]
          ]
        },
        apiOptions: {
          cssImageRef: '../images/sprite.png'
        },
        customTemplates: {
          'handlebars_based_template': path.resolve(__dirname, 'icon.css.template.hbs')
        },
      }),
      extractSass,
      new CopyWebpackPlugin([
        { from: './src/images', to: 'images' }
      ]),
      new CopyWebpackPlugin([
        { from: './src/fonts', to: 'fonts' }
      ]),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/index.html'
      }),
      new UglifyJsPlugin(),
      new ExtractTextPlugin('./scss/index.scss')
    ]
  }
}