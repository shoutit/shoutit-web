/* eslint no-var: 0, vars-on-top: 0, prefer-arrow-callback: 0, object-shorthand: 0, prefer-template: 0 */

var path = require('path');
var webpack = require('webpack');
var noop = require('lodash/noop');

var isDevelopment = process.env.NODE_ENV === 'development';

var outputPath = path.join(__dirname, 'assets/scripts');
if (!isDevelopment) {
  outputPath = path.join(__dirname, 'built/public');
}

var StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin;

module.exports = {
  context: process.cwd(),
  devtool: isDevelopment ? '#cheap-module-eval-source-map' : '#source-map',
  entry: {
    vendors: [path.join(__dirname, 'assets', 'vendors-packages.js')],
  },
  output: {
    path: outputPath,
    filename: isDevelopment ? '[name].js' : '/scripts/[name]-[chunkhash].js',
    library: '[name]',
  },
  plugins: [

    new webpack.DefinePlugin({
      'process.env': {
        SHOUTIT_ENV: JSON.stringify(process.env.SHOUTIT_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
        HOST: JSON.stringify(process.env.HOST),
        PORT: JSON.stringify(process.env.PORT),
        BROWSER: JSON.stringify(true),
      },
    }),

    new webpack.DllPlugin({
      path: path.join(outputPath, '[name]-manifest.json'),
      name: '[name]',
      context: '.',
    }),

    !isDevelopment ? // Write out stats.json file to build directory.
      new StatsWriterPlugin({
        fields: ['assetsByChunkName', 'assets'],
        filename: 'chunknames-vendors.json',
        transform: function transform(data) {
          return JSON.stringify({
            vendors: data.assetsByChunkName.vendors[0],
          }, null, 2);
        },
      }) : noop,

  ],
};
