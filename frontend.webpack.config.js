const baseDir = __dirname;
const globalModules = baseDir + `/node_modules`;
const webpack = require(`webpack`);
const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackSharedConfig = require("./utils/webpack-shared-config");
const restrictFromUsage = require("./utils/restrict-from-usage").restrictFromUsage;
const UpgradeBuildNumber = require("./utils/version-plugin").UpgradeBuildNumber;

module.exports = {
	...webpackSharedConfig,

	externals: [
		{
			...webpackSharedConfig.externals,
			'bluebird': 'Bluebird',
		},
		restrictFromUsage('./backend/', 'frontend', 'window'),
	],

	entry: `${baseDir}/frontend.jsx`,

	output: {
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[chunkhash].js',
		path: baseDir + '/public/assets/compiled',
		publicPath: '/assets/compiled/',
	},
	// devtool: 'source-map',

	plugins: [
		new CleanWebpackPlugin([baseDir + '/public/assets/compiled'], {
			watch: false,
		}),
		new HtmlWebpackPlugin({
			title: 'Загрузка...',
			inject: 'body',
			template: baseDir + '/layouts/index.html',
			filename: 'template.html',
		}),
		new webpack.HashedModuleIdsPlugin(),
		new webpack.optimize.CommonsChunkPlugin({
			name:'manifest'
		}),
		// [size -= 400kb][time *= 1.75]
		// new webpack.optimize.UglifyJsPlugin({
		// 	sourceMap: true,
		// 	mangle: { keep_fnames: true },
		// })

		new UpgradeBuildNumber(),
	],

	module: {
		loaders: [{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [
					"babel-preset-react",
					"babel-preset-env"
				],

				plugins: [
					"babel-plugin-transform-runtime",
					"babel-plugin-external-helpers",
					"babel-plugin-transform-decorators-legacy",
					"babel-plugin-transform-class-properties",
					"babel-plugin-transform-object-rest-spread",
					"babel-plugin-syntax-async-functions",
					"babel-plugin-dynamic-import-webpack",
					"babel-plugin-transform-regenerator",
					"babel-plugin-transform-async-to-bluebird"
				]
			}
		}]
	}
};