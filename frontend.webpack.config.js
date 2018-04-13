const baseDir = __dirname;
const globalModules = baseDir + `/node_modules`;
const webpack = require(`webpack`);
const path = require('path');
const fs = require('fs');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpackSharedConfig = require("./utils/webpack-shared-config");

module.exports = {
	...webpackSharedConfig,

	entry: `${baseDir}/frontend.jsx`,

	output: {
		chunkFilename: '[name].[chunkhash].js',
		filename: '[name].[chunkhash].js',
		path: baseDir + '/public/assets/compiled',
		publicPath: '/assets/compiled/',
	},

	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'material-ui': 'MaterialUI',
	},
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
		})
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
					"babel-plugin-transform-regenerator"
				]
			}
		}]
	}
};