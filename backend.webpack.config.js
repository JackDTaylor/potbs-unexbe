const baseDir = __dirname;
const globalModules = baseDir + `/node_modules`;
const webpack = require(`webpack`);
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');
const webpackSharedConfig = require("./utils/webpack-shared-config");
const restrictFromUsage = require("./utils/restrict-from-usage").restrictFromUsage;
const UpgradeBuildNumber = require("./utils/version-plugin").UpgradeBuildNumber;
const WatchExternalFilesPlugin = require('webpack-watch-files-plugin').default;

function RestartOnCompile() {}

RestartOnCompile.prototype.apply = function(compiler) {
	compiler.plugin('done', function() {
		fs.closeSync(fs.openSync(__dirname + '/tmp/restart.txt', 'w'));
	});
};

module.exports = {
	...webpackSharedConfig,
	entry: `${baseDir}/backend.jsx`,
	output: { path: baseDir + '/compiled', filename: 'backend.min.js' },

	node: {
		__filename: false,
		__dirname: false
	},

	target: 'node',

	externals: [
		webpackSharedConfig.externals,
		restrictFromUsage('./frontend/', 'backend', 'global'),
		nodeExternals(),
	],
	watchOptions: {
		ignored: [`../node_modules/`],
	},
	plugins: [
		new RestartOnCompile(),
		new WatchExternalFilesPlugin({files: [baseDir + '/language/lang-*.csv']}),

		new UpgradeBuildNumber(true),
	],
	module: {
		loaders: [{
			test: /.jsx?$/,
			loader: 'babel-loader',
			exclude: /node_modules/,
			query: {
				presets: [
					"babel-preset-react",
					["babel-preset-env", {targets: { "node": 8 }}]
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