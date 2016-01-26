/* eslint no-var: 0 */
/* eslint-env node */

var path = require("path");
var webpack = require("webpack");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var isDevelopment = process.env.NODE_ENV === "development";
var WebpackErrorNotificationPlugin = require("webpack-error-notification");
var context = path.join(__dirname, "./app");
var entries = ["./client/index.js"];

if (isDevelopment) {
  entries.push("webpack-hot-middleware/client");
}

module.exports = {
  devtool: isDevelopment ? "cheap-module-eval-source-map" : "source-map",
  context: context,
  entry: entries,
  output: {
    path: path.join(__dirname, "./app/public/js"),
    filename: "main.js",
    publicPath: "/js"
  },
  resolve: {
    extensions: ["", ".js", ".jsx", ".scss"],
    alias: {
      "styles": path.join(__dirname, "app/res/sass")
    }
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: isDevelopment ?
          "style!css?sourceMap!sass?sourceMap&sourceMapContents" :
           ExtractTextPlugin.extract("style", "css?sourceMap!sass?sourceMap")
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        loader: "file"
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: "babel",

        query: {
          env: {
            development: {
              plugins: ["react-transform"],
              extra: {
                "react-transform": {
                  transforms: [{
                    transform: "react-transform-hmr",
                    imports: ["react"],
                    locals: ["module"]
                  }, {
                    transform: "react-transform-catch-errors",
                    imports: ["react", "redbox-react"]
                  }]
                }
              }
            }
          }
        }

      }
    ]
  },
  plugins: [
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development"),
        BROWSER: JSON.stringify(true)
      }
    }),
    new webpack.ContextReplacementPlugin(/buffer/, require("buffer")),
    new webpack.optimize.OccurenceOrderPlugin(),
    !isDevelopment ? new ExtractTextPlugin("../css/main.css") : new Function(),
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : new Function(),
    isDevelopment ? new webpack.NoErrorsPlugin() : new Function(),
    isDevelopment ? new WebpackErrorNotificationPlugin() : new Function()

  ]
};
