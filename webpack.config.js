const webpack = require('webpack')
const rimraf = require('rimraf')
const path = require('path')
const AssetsPlugin = require('assets-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'

function resolve() {
	return path.join(__dirname, 'source', 'js')
}

//Длинное кэширование используем только в проде, в деве руками в html вставляем ссылку на этот файл
//и в браузере отключаем кэш
let chunkFilename = '[name].js'

//На проде используем длинное кэширование
if (NODE_ENV === 'production') {
	chunkFilename = '[name]-[chunkhash].js'
}

module.exports = {
	entry: {
		app: './source/js/app.js'
	},
	output: {
		path: __dirname + '/build/js',
		filename: chunkFilename,
		publicPath: '/build/js/'
	},
	resolve: {
		extensions: ['.js', '.json'],
		alias: {
			'@': resolve(),
		}
	},
	module: {
		rules: [{
			test: /\.js$/,
			include: [__dirname + '/source/js'],
			loader: "babel-loader",
		},],
	},
	plugins: [
		{
			apply: (compiler) => {
				rimraf.sync(compiler.options.output.path)
			}
		},
		new AssetsPlugin({
			filename: 'js.json',
			path: __dirname + '/build/js',
			fullPath: false
		}),
		new webpack.ProvidePlugin({
			axios: 'axios',
			$: 'jquery',
			jQuery: 'jquery'
		}),
	]
}

if (NODE_ENV === 'development') {
	module.exports.devtool = 'cheap-inline-module-source-map'
	module.exports.watch = true
	module.exports.watchOptions = {
		aggregateTimeout: 100
	}
	//В дев режиме страницу vue-приложения отдает webpack-dev-server
	//в прод режиме - рельсы. На локале когда разрабатываем, рельсы запускать не надо
	//достаточно запустить сборку стилей и js
	module.exports.devServer = {
		hot: true
	}
	module.exports.plugins.push(new webpack.NamedModulesPlugin())
	module.exports.plugins.push(new webpack.HotModuleReplacementPlugin())
}

if (NODE_ENV === 'production') {
	const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

	module.exports.optimization = {
		minimizer: [
			new UglifyJsPlugin()
		]
	}
	module.exports.plugins.push(
		new webpack.DefinePlugin({
			'process.env': {
				NODE_ENV: '"production"',
			}
		})
	)
	const CompressionPlugin = require("compression-webpack-plugin")
	module.exports.plugins.push(
		new CompressionPlugin({
			test: /\.js/
		})
	)
}
