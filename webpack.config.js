/* eslint no-var: 0, vars-on-top: 0, prefer-arrow-callback: 0, object-shorthand: 0, prefer-template: 0 */
/* eslint-env node */

require('babel-register');

var noop = require('lodash/noop');

var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var WebpackErrorNotificationPlugin = require('webpack-error-notification');
var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;
var CopyPlugin = require('copy-webpack-plugin');
var WebpackRTLPlugin = require('webpack-rtl-plugin');

var isDevelopment = process.env.NODE_ENV === 'development';

var context = path.join(__dirname, './app');
var entries = ['./client.js'];
var config = require('./app/config');

if (isDevelopment) {
  entries.push('webpack-hot-middleware/client');
}

var NotifyConfigPlugin = function NotifyConfigPlugin() {};
NotifyConfigPlugin.prototype.apply = () => {
  console.log(config.getSummary()); // eslint-disable-line
  console.log("\nWebpack is compiling...\n"); // eslint-disable-line
};

module.exports = {
  cache: isDevelopment,
  devtool: isDevelopment ? 'eval' : '#source-map',
  context: context,
  entry: entries,
  output: {
    path: path.join(__dirname, 'built/public/'),
    filename: isDevelopment ? '[name].js' : '/scripts/[name]-[chunkhash].js',
    chunkFilename: isDevelopment ? '[name].js' : '/scripts/[name]-[chunkhash].js',
    publicPath: isDevelopment ? config.publicUrl + '/assets/' : `${config.publicUrl}`,
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    alias: {
      styles: path.join(__dirname, 'app/styles'),
    },
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: isDevelopment ? {
          presets: [
            'es2015',
            'stage-1',
            'react',
            'react-hmre',
          ],
        } : {
          presets: [
            'es2015',
            'stage-1',
            'react',
          ],
        },
      },
      {
        test: /\.s?css$/,
        loader: isDevelopment ?
          'style!rtl-css?sourceMap!postcss!sass?sourceMap&sourceMapContents' :
           ExtractTextPlugin.extract('style', 'css?sourceMap!postcss!sass?sourceMap'),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: 'file',
        query: isDevelopment ? null : {
          name: '/images/[name]-[hash].[ext]',
        },
      },
      {
        test: /\.json$/,
        loader: 'json',
      },
    ],
  },

  postcss: function postcss() {
    return [autoprefixer];
  },

  plugins: [
    !isDevelopment ? new NotifyConfigPlugin() : noop,
    new webpack.DefinePlugin({
      'process.env': {
        SHOUTIT_ENV: JSON.stringify(process.env.SHOUTIT_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        HOST: JSON.stringify(process.env.HOST),
        PORT: JSON.stringify(process.env.PORT),
        BROWSER: JSON.stringify(true),
      },
    }),

    // Optimizations

    new webpack.DllReferencePlugin({
      manifest: isDevelopment ?
        require('./assets/scripts/vendors-manifest.json') :
        require('./built/public/vendors-manifest.json'),
      context: process.cwd(),
    }),

    new ExtractTextPlugin(isDevelopment ? 'main.css' : '/styles/main-[contenthash].css'),
    !isDevelopment ? new WebpackRTLPlugin({ filename: '/styles/main-[contenthash]-rtl.css' }) : noop,
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : noop,
    isDevelopment ? new webpack.NoErrorsPlugin() : noop,
    isDevelopment ? new WebpackErrorNotificationPlugin() : noop,

    !isDevelopment ? // Write out stats.json file to build directory.
      new StatsWriterPlugin({
        fields: ['assetsByChunkName', 'assets'],
        filename: 'chunknames-app.json',
        transform: function transform(data) {
          const cssRtl = data.assets.find(function findRtlCss(asset) {
            return asset.name.split('-').slice(-1)[0] === 'rtl.css';
          });
          return JSON.stringify({
            main: data.assetsByChunkName.main[0],
            css: data.assetsByChunkName.main[1],
            cssRtl: cssRtl.name,
          }, null, 2);
        },
      }) : noop,

    !isDevelopment ?
      new CopyPlugin([{ from: path.join(__dirname, 'assets/images'), to: 'images' }]) : noop,
  ],
};
