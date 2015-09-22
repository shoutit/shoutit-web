var path = require('path'),
    webpack = require('webpack');

module.exports = {
    cache: true,
    entry: path.join(__dirname, "/app/client/index.js"),
    output: {
        path: path.join(__dirname, "/app/public/"),
        filename: "main.js"
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/buffer/, require('buffer'))
    ]
};
