var path = require('path'),
    webpack = require('webpack');

module.exports = {
    cache: true,
    devtool: "source-map",
    entry: path.join(__dirname, "/app/client/index.js"),
    output: {
        path: path.join(__dirname, "/app/public/"),
        filename: "main.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/buffer/, require('buffer'))
    ]
};
