const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

const argv = require('yargs').argv;
const isProduction = argv.mode === 'production';

var webAppConfig = {
	resolve: {
		fallback: { 
			crypto: false,
		 },
		extensions: ['.js', '.jsx', '.ts', '.tsx'],  // Add .tsx here
		alias: {
			'react': path.resolve('./node_modules/react')
		}
	},
    entry: './src/index.js',
    output: {
		crossOriginLoading: 'anonymous',
			filename: 'bundle.js',
			path: path.join(__dirname, 'build')
    },


	devServer: {
		static: {
		  directory: path.join(__dirname, 'build'),
		},
		compress: true,
		port: 8081,
		allowedHosts : ["localhost" , "test.broclan.io"],
		hot: true,
		liveReload: true,
		watchFiles: ['src/**/*'],
		client: {
			overlay: true,
		},
	  },

    module: {
			rules: [
				{
					test: /\.svg$/,
					use: ['@svgr/webpack', 'svg-url-loader'],
				  },
				{
				loader: 'babel-loader',
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				options: {
					presets: [
						'@babel/preset-env',
						['@babel/preset-react', {"runtime": "automatic"}]
					],
					plugins: [
						'@babel/plugin-syntax-import-attributes'
					]
				}
			}, {
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			  },
				{
					test: /\.(ts|tsx)$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
	]
    },
	mode : isProduction ? 'production' : 'development',
	devtool : 'source-map',
	optimization: {
		usedExports: true,
	  },
	experiments: {
		asyncWebAssembly: true,
		topLevelAwait: true,
		layers: true // optional, with some bundlers/frameworks it doesn't work without
		},
	plugins: [
		new CopyPlugin({
			patterns: [
				{ from: "public", to: "." }
			],
		}),
	],
};

	
module.exports = [webAppConfig]
