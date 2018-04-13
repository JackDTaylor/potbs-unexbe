const webpackSharedConfig = require("./utils/webpack-shared-config");
const baseDir = __dirname;
const webpack = require(`webpack`);

module.exports = {
	...webpackSharedConfig,

	entry: `${baseDir}/vendor.jsx`,
	devtool: 'sourcemap',
	output: {
		path: baseDir + '/public/assets',
		filename: 'vendor.min.js'
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			sourceMap: true,
			mangle: { keep_fnames: true },
		})
	],
};