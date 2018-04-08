const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function(env, argv) {
    return {
        entry: './src/js/app.js',
        output: {
            path: path.resolve("dist"),
            filename: 'js/app.js'
        },
        module: {
                rules: [    
                    {
                      test: /\.html$/,
                      use: [
                        {
                          loader: "html-loader"
                        }
                      ]
                    },        
                    {
                        test: /\.(scss)$/,
                        use: [{
                            loader: MiniCssExtractPlugin.loader, // inject CSS to page
                        }, {
                            loader: 'css-loader', // translates CSS into CommonJS modules
                        }, {
                            loader: 'postcss-loader', // Run post css actions
                            options: {
                            plugins: function () { // post css plugins, can be exported to postcss.config.js
                                return [
                                    require('autoprefixer')
                                ];
                            }
                            }
                        }, {    
                            loader: 'sass-loader' // compiles Sass to CSS
                        }]
                    }   
                ]
        },
        plugins: [  
            new CleanWebpackPlugin(["dist"]),      
            new MiniCssExtractPlugin({          
              filename: 'css/app.css'
            }),
            new webpack.ProvidePlugin({
                $: "jquery",
                jQuery: 'jquery',
                'window.jQuery': 'jquery',
                Popper: 'popper.js/dist/umd/popper.js'
            }),
            new HtmlWebPackPlugin({
              template: "src/index.html",
              filename: "index.html"
            }),
            new CopyWebpackPlugin([
                { from: 'src/img', to: 'img' }
            ])
        ],
        optimization: {            
            minimizer: argv.mode === 'production' ? [
                new UglifyJsPlugin(),
                new OptimizeCSSAssetsPlugin()
            ] : []
        },    
    }
}