// This is the webpack config to use during development.
// It enables the hot module replacement, the source maps and inline CSS styles.

/* eslint no-var: 0, no-console: 0 */

import webpack from 'webpack';
import WebpackErrorNotificationPlugin from 'webpack-error-notification';

const config = {
  devtool: 'cheap-module-eval-source-map',
  entry: [
    'webpack-hot-middleware/client',
    './app/client/index.js',
    './app/res/sass/main.scss'
  ],
  output: {
    filename: 'main.js',
    chunkFilename: '[name].main.js',
    path: '/',
    publicPath: '/'
  },
  module: {
    loaders: [

      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          'env': {
            'development': {
              'plugins': ['react-transform'],
              'extra': {
                'react-transform': {
                  'transforms': [{
                    'transform': 'react-transform-hmr',
                    'imports': ['react'],
                    'locals': ['module']
                  }, {
                    'transform': 'react-transform-catch-errors',
                    'imports': ['react', 'redbox-react']
                  }]
                }
              }
            }
          }
        }
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true']
      },
      { test: /\.(jpe?g|png|gif|svg)$/, loader: "file" }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.NoErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development')
      }
    }),
    new WebpackErrorNotificationPlugin()
  ]

};

export default config;
