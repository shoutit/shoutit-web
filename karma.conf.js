module.exports = function (config) {
  config.set({
    browsers: ["PhantomJS"],
    singleRun: true,
    frameworks: ["mocha"],
    files: [
      "node_modules/babel-core/browser-polyfill.js",
      "./spec.webpack.js"
    ],
    preprocessors: {
      "spec.webpack.js": ["webpack", "sourcemap"]
    },

    plugins: [
      "karma-mocha",
      "karma-phantomjs-launcher",
      "karma-sourcemap-loader",
      "karma-webpack",
      "karma-coverage",
      "karma-mocha-reporter"
    ],

    // reporters: ["mocha", "coverage"],
    coverageReporter: {
      reporters: [
        { type: "text" },
        { type: "html" },
        { type: "json", file: "coverage-karma.json" }
      ]
    },

    webpack: {
      devtool: "inline-source-map",
      module: {
        loaders: [
          { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: "babel-loader" }
        ],
        postLoaders: [
          {
            test: /\.(js|jsx)$/,
            exclude: /(tests\.webpack\.js|node_modules|\.spec\.js)/,
            loader: "istanbul-instrumenter"
          }
        ]
      },
      resolve: {
        alias: {
          sinon: "sinon/pkg/sinon-1.17.0.js"
        }
      },
      server: {
        noInfo: true,
        silent: true
      }
    },

    webpackMiddleware: {
      noInfo: true,
      quiet: true
    }

  });
};
