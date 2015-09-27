var webpack = require('webpack');
var _ = require('lodash');

module.exports = _.merge({}, require('./webpack.config.js'), {
	plugins: [
		// Search for equal or similar files and deduplicate them in the output. This comes with some overhead
		// for the entry chunk, but can reduce file size effectively.
		// This is experimental and may crash, because of some missing implementations.
		// https://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
		//new webpack.optimize.DedupePlugin(),

		// We don't need uglify at the moment since we are having issues to be debugged
		//new webpack.optimize.UglifyJsPlugin({
		//	compress: {
		//		warnings: false
		//	}
		//}),

		new webpack.DefinePlugin({
			"process.env": {
				// Signal production mode for React JS and other libs.
				NODE_ENV: JSON.stringify("production")
			}
		})
	]
});
