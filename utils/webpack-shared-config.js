const globalModules = __dirname + `/../node_modules`;

module.exports = {
	cache: {},
	externals: {
		'react': 'React',
		'react-dom': 'ReactDOM',
		'material-ui': 'MaterialUI',
		'@devexpress/dx-react-grid': 'DxReactGrid',
		'@devexpress/dx-react-grid-material-ui': 'DxReactGridMaterialUi',
	},
	watchOptions: {
		ignored: [`/node_modules/`],
	},
	devtool: false,//'cheap-module-eval-source-map',
	resolve: {
		extensions: [".jsx", ".webpack.js", ".web.js", ".js", ".json"],
	},
	resolveLoader: {
		modules: [ globalModules ],
		extensions: [ '.js', '.json' ],
		mainFields: [ 'loader', 'main' ]
	},
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