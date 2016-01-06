/* eslint no-var: 0 */
/* eslint-env node */

var path = require("path")
var webpack = require("webpack")

var isDevelopment = process.env.NODE_ENV === "development";

var context = path.join(__dirname, "./app");
var entries = ["./client/index.js"];

if (isDevelopment) {
  entries.push("webpack-hot-middleware/client");
  entries.push("./res/sass/main.scss")
}

module.exports = {
  devtool: isDevelopment ? "cheap-module-eval-source-map" : "source-map",
  context: context,
  entry: entries,
  output: {
    path: path.join(__dirname, "./app/public"),
    filename: "main.js"
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loaders: isDevelopment ? ["style", "css", "sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true"] : []
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
    new webpack.ContextReplacementPlugin(/buffer/, require("buffer")),
    isDevelopment ? new webpack.HotModuleReplacementPlugin() : new Function(),
    new webpack.DefinePlugin({
      "process.env": { NODE_ENV: JSON.stringify(process.env.NODE_ENV || "development") }
    })
  ]
};
