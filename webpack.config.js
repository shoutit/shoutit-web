/* eslint no-var: 0 */
/* eslint-env node */

require("babel-register");

var path = require("path");
var webpack = require("webpack");
var autoprefixer = require("autoprefixer");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var WebpackErrorNotificationPlugin = require("webpack-error-notification");
var StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin;
var CopyPlugin = require("copy-webpack-plugin");

var isDevelopment = process.env.NODE_ENV === "development";

var context = path.join(__dirname, "./app");
var entries = ["./client.js"];
var config = require("./config");

function noop() {}

if (isDevelopment) {
  entries.push("webpack-hot-middleware/client");
}

var NotifyConfigPlugin = function() {};
NotifyConfigPlugin.prototype.apply = () => {
  console.log(config.getSummary()); // eslint-disable-line
  console.log("\nWebpack is compiling...\n"); // eslint-disable-line
};

module.exports = {
  devtool: isDevelopment ? "cheap-module-eval-source-map" : "source-map",
  context: context,
  entry: entries,
  output: {
    path: path.join(__dirname, "public/"),
    filename: isDevelopment ? "main.js" : "/scripts/main-[hash].js",
    publicPath: isDevelopment ? config.publicUrl + "/assets/" : `${config.publicUrl}`
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".scss"],
    alias: {
      "styles": path.join(__dirname, "app/styles")
    }
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: isDevelopment ?
          "style!css?sourceMap!postcss!sass?sourceMap&sourceMapContents" :
           ExtractTextPlugin.extract("style", "css?sourceMap!postcss!sass?sourceMap")
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "file",
        query: isDevelopment ?  null : {
          name: "/images/[name]-[hash].[ext]"
        }
      },
      {
        test: /\.json$/,
        loader: "json"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  },

  postcss: function () {
    return [autoprefixer];
  },

  plugins: [

    !isDevelopment ? new NotifyConfigPlugin() : noop,

    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      "process.env": {
        SHOUTIT_ENV: JSON.stringify(process.env.SHOUTIT_ENV),
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        HOST: JSON.stringify(process.env.HOST),
        PORT: JSON.stringify(process.env.PORT),
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.ContextReplacementPlugin(/buffer/, require("buffer")),
    new webpack.optimize.OccurenceOrderPlugin(),
    new ExtractTextPlugin(isDevelopment ? "main.css" : "/styles/main-[contenthash].css"),
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : noop,
    isDevelopment ? new webpack.NoErrorsPlugin() : noop,
    isDevelopment ? new WebpackErrorNotificationPlugin() : noop,

    !isDevelopment ? // Write out stats.json file to build directory.
      new StatsWriterPlugin({
        transform: function (data) {
          return JSON.stringify({
            main: data.assetsByChunkName.main[0],
            css: data.assetsByChunkName.main[1]
          }, null, 2);
        }
      }) : noop,

    !isDevelopment ?
      new CopyPlugin([{ from: "../assets/images/", to: "./images" }]) : noop

  ]
};
