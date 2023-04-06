const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const path = require('path');

module.exports = {
	entry: './src/pack.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'pack.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader']
			},
			{
				test: /\.ttf$/,
				use: ['file-loader']
			}
		]
	},
	resolve: {
		alias: {
			'monaco-editor' : 'monaco-editor/esm/vs/editor/editor.api.js'
		}
	},
	plugins: [new MonacoWebpackPlugin({
		languages: ['lua', 'plaintext'],
		features: []
	})]
};
