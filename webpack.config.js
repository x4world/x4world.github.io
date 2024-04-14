const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = env => {
    const isEnvDevelopment = !!env.development;
    const isEnvProduction = !isEnvDevelopment;
    const devtool = isEnvDevelopment ? 'cheap-module-source-map' : false;

    function getStyleLoaders(cssOptions, preProcessor) {
        const loaders = [
            isEnvDevelopment && 'style-loader',
            isEnvProduction && {
                loader: MiniCssExtractPlugin.loader,
                options: {
                    publicPath: '../'
                }
            }, {
                loader: 'css-loader',
                options: cssOptions
            }, {
                loader: 'postcss-loader',
                options: {
                    postcssOptions: {
                        plugins: [
                            require('postcss-flexbugs-fixes'),
                            require('postcss-preset-env')({
                                autoprefixer: {
                                    flexbox: 'no-2009',
                                },
                                stage: 3,
                            })
                        ],
                    },
                },
            }
        ].filter(Boolean);
    
        if (preProcessor) {
            loaders.push(preProcessor);
        }
    
        return loaders;
    }

    return {
        mode: isEnvDevelopment ? 'development' : 'production',
        watch: isEnvDevelopment,
        entry: {
            index: path.join(__dirname, 'src/js/index')
        },
        output: {
            path: path.join(__dirname, 'public'),
            publicPath: '/',
            clean: true,
            filename: 'js/[name].js',
            chunkFilename: 'js/[name].bundle.js',
            assetModuleFilename: 'images/[hash][ext][query]'
        },
        devtool,
        module: {
            rules: [{
                test: /\.less$/i,
                use: getStyleLoaders({
                    modules: {
                        localIdentContext:  __dirname,
                        localIdentName: isEnvDevelopment ? '[path][name]__[local]' : '[hash:base64:6]'
                    }
                }, 'less-loader')
            }, {
                test: /\.css$/i,
                use: getStyleLoaders()
            }, {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource'
            }, {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            }]
        },
        plugins: [
            new HtmlWebpackPlugin({
                title: 'X-DBC',
                filename: 'index.html',
                template: path.join(__dirname, 'src/tpl/index.ejs'),
                hash: true
            }),
            new ESLintPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/[name].min.css',
                chunkFilename: 'css/[name].min.css'
            }),
            fs.existsSync(path.join(__dirname, 'src', 'lib')) && new CopyPlugin({
                patterns: [{
                    from: path.join(__dirname, 'src', 'lib'),
                    to: path.join(__dirname, 'public', 'lib')
                }]
            }),
        ].filter(Boolean),
        optimization: {
            minimize: isEnvProduction,
            minimizer: [
                new TerserPlugin(),
                new CssMinimizerPlugin({
                    minimizerOptions: {
                        preset: [
                            'default',
                            {
                                discardComments: { removeAll: true },
                            }
                        ]
                    }
                })
            ]
        },
        externals: {
            'react': 'React',
            'react-dom': 'ReactDOM'
        },
        resolve: {
            alias: {
                'xui': 'D:\\repository\\xui\\src\\js\\components'
            }
        }
    };
};