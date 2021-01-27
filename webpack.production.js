const { join, resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const webpack = require('webpack');
const AddAssetHtmlPlugin = require('add-asset-html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: 'production',
    entry: join(__dirname, 'src', 'index.js'),

    output: {
        path: join(__dirname, 'dist'),
        filename: 'js/[name].[fullhash].js',
    },

    optimization: {
        splitChunks: {
            chunks: 'all',
            minSize: 0,
            maxSize: 1200,
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                exclude: /\/node_modules/,
                terserOptions: {
                    ecma: 2015,
                },
            }),
            new OptimizeCSSAssetsPlugin(),
            new CompressionPlugin({
                test: /\.js(\?.*)?$/i,
                exclude: /\/node_modules/,
            }),
            new OptimizeCSSAssetsPlugin({
                assetNameRegExp: /\.optimize\.css$/g,
                cssProcessor: require('cssnano'),
                cssProcessorPluginOptions: {
                    preset: [
                        'default',
                        { discardComments: { removeAll: true } },
                    ],
                },
                canPrint: true,
            }),
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
        alias: {
            '@componets': resolve(__dirname, 'src/components'),
        },
    },

    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ],
    },

    plugins: [
        new MiniCSSExtractPlugin({
            filename: 'css/[name].[fullhash].css',
            chunkFilename: 'css/[id].[fullhash].css',
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html',
            filename: './index.html',
            scriptLoading: 'defer',
        }),
        new webpack.DllReferencePlugin({
            context: join(__dirname),
            manifest: join(__dirname, 'dist', 'modules-manifest.json'),
        }),
        new AddAssetHtmlPlugin({
            filepath: resolve(__dirname, './dist/auto/modules.dll.js'),
        }),
    ],
};
