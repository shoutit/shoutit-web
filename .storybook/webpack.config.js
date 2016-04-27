const path = require('path');
const webpack = require('webpack');

module.exports = {
  module: {
    loaders: [
      {
        test: /\.s?css$/,
        loaders: ['style', 'css', 'sass'],
        include: path.resolve(__dirname, '../'),
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loaders: ['file'],
        query: null,
        include: path.resolve(__dirname, '../'),
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BROWSER: JSON.stringify(true),
      },
    }),
  ],
};
