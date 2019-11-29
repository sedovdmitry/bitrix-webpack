const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { StatsWriterPlugin } = require("webpack-stats-plugin");
const baseConfig = require('./config.base.js');

const ROOT_DIR = path.resolve(__dirname, '../');
const DIST_DIR = path.resolve(ROOT_DIR, 'local', 'dist');

module.exports = merge(baseConfig, {
    devtool: 'eval',
    mode: 'development',
    watch: true,
    output: {
        path: DIST_DIR,
        publicPath: '/',
        filename: '[name].[chunkhash].js', // Все общие js-скрипты будут располагаться в файле scripts.hash.js
    },
    plugins: [
        // очищаем папку с bundled-файлами
        new CleanWebpackPlugin(['local/templates/.default/dist'], { root: ROOT_DIR, verbose: true, dry: false}),
        new MiniCssExtractPlugin({
            filename: '[name].[chunkhash].css',
            allChunks: true,
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
                    MiniCssExtractPlugin.loader, // 'style-loader' not working
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: true,
                            plugins: [
                                autoprefixer()
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        }
                    }

                ]
            }
        ]
    },
});
