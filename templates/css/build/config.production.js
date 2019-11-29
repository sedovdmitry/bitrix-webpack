const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConfig = require('./config.base.js');
const UglifyJSWebpackPlugin = require('uglifyjs-webpack-plugin');
const BundleAnalyzer = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const autoprefixer = require('autoprefixer');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const { StatsWriterPlugin } = require("webpack-stats-plugin");

const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(ROOT_DIR, 'local', 'dist');

module.exports = merge(baseConfig, {
    mode: 'production',
    devtool: 'source-map',
    target: 'web',
    output: {
        path: DIST_DIR,
        publicPath: '/',
        filename: '[name].[chunkhash].js', // All common js-files will set in one file: scripts.hash.js
        chunkFilename: '[name].[chunkhash].js',
    },
    optimization: {
        minimizer: [
            new UglifyJSWebpackPlugin({
                cache: true,
                parallel: true,
                sourceMap: true
            }),
            new OptimizeCSSAssetsPlugin({})
        ]
    },
    plugins: [
        // erasing /dist folder
        new CleanWebpackPlugin(['local/dist'], { root: ROOT_DIR, verbose: true, dry: false}),

        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css', // marya.hash.css, ed.hash.css, mia.hash.css
            allChunks: false,//chunkFilename: '[id].[hash].css',
        }),

        // генерируем файл с названиями новых файлов с новым хэшем, чтобы потом их спарсить и подключить PHP-скриптом
        new StatsWriterPlugin({
            filename: "stats.json" // Default
        }),

    ],
    module: {
        rules: [
            {
                test: /\.s?css$/,
                use: [
                    MiniCssExtractPlugin.loader, // dev: 'style-loader'
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer()
                            ]
                        }
                    }
                ]
            }
        ]
    },
});
