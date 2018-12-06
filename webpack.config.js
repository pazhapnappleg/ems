const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
    devServer: {
      contentBase: path.join(__dirname, '.'),
      index: 'index.html',
      compress: true,
      port: 9000,
      hot: true
    },
    entry: {
        vendor: ['crossfilter','lodash','nouislider', 'd3', 'dc', 'dot'],
        app: './src/WholeApp.ts'
    },
    output: {
        path: path.resolve(__dirname, '.'),
        filename: 'js/[name].bundle.js',
        library: ['lodash','nouislider', 'crossfilter', 'd3', 'dc', 'dot'],
        libraryTarget: 'umd'
    },
    optimization: {
        splitChunks: {
          // include all types of chunks
          chunks: 'all'
        }
      },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'gen.html'
        })
    ],
    externals: { 
        crossfilter: 'crossfilter',
        lodash: {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: 'lodash',
            root: '_'
            },
        nouislider: 'noUiSlider',
        dc: 'dc',
        d3: 'd3',
        dot: 'doT'
    },
    devtool: 'source-map',
	mode: 'development',
    resolve: {
        extensions: ['.ts', '.tsx', '.json', '.js']
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            { 
                enforce: "pre", 
                test: /\.js$/, 
                loader: "source-map-loader",
                options: {
                  presets: ["es2015"]
                } 
            }
        ]
    }
}