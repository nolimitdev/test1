// Root projektu a zahrnutie konfiguracneho suboru aplikacie
var ProjectRoot = require('./project-root.js');
var Config = require(ProjectRoot + '/config/config.js');

// Zahrnutie potrebnych modulov
var Fs = require('fs');
var Path = require('path');
var Webpack = require('webpack');
var { VueLoaderPlugin } = require('vue-loader');
var TerserWebpackPlugin = require('terser-webpack-plugin');
var MiniCssExtractPlugin = require('mini-css-extract-plugin');
var CssMinimizerWebpackPlugin = require('css-minimizer-webpack-plugin');
var WebpackBuildNotifier = require('webpack-build-notifier');

// Ignorovanie hlasky: "Browserslist: caniuse-lite is outdated..."
process.env.BROWSERSLIST_IGNORE_OLD_DATA = true;

// Nastavenie prostredia
process.env.NODE_ENV = (Config.production) ? 'production' : 'development';

// Webpack konfiguracia
module.exports = (env, options) => {
    var colorMode = (env['color-mode'] == 'dark') ? 'dark' : 'light';

    return {
        entry : './resources/app.js',
        devtool : (Config.sourcemaps) ? 'source-map' : false,
        devServer : {
            hot : 'only',
            static : Path.resolve(ProjectRoot + '/public'),
            devMiddleware : { publicPath : '/assets' },
            allowedHosts : 'all',
            server : (Config.devServerHttps) ? { type : 'https', options : { cert : Fs.readFileSync(Path.resolve(ProjectRoot + '/config/domain.crt')), key : Fs.readFileSync(Path.resolve(ProjectRoot + '/config/domain.key')) } } : { type : 'http' },
        },
        mode : (Config.production) ? 'production' : 'development',
        module : {
            rules : [
                // Pre `.vue` subory
                {
                    test : /\.vue$/,
                    loader : 'vue-loader',
                },
                // Pre `.js` subory, ale aj pre `<script>` bloky vo `.vue` suboroch
                {
                    test : /\.js$/,
                    exclude : /node_modules/,
                    loader : 'babel-loader',
                    options : {
                        presets : ['@babel/preset-env'],
                    },
                },
                // Pre `.css` subory, ale aj pre `<style>` bloky vo `.vue` suboroch
                {
                    test : /\.css$/,
                    use : [
                        (Config.extractCss) ? { loader : MiniCssExtractPlugin.loader } : { loader : 'vue-style-loader' },
                        { loader : 'css-loader', options : { url : false, sourceMap : Config.sourcemaps } },
                        { loader : 'postcss-loader', options : { sourceMap : Config.sourcemaps, postcssOptions : { config : './webpack/postcss-config.js', colorMode : colorMode } } },
                    ],
                },
            ],
        },
        optimization : {
            minimizer : [
                new TerserWebpackPlugin({ extractComments : () => false }), // potrebne, aby boli odstranene vsetky komentare vratane licencnych a aby sa ani nevytvaral *LICENSE.txt subor
                new CssMinimizerWebpackPlugin({
                    minimizerOptions : {
                        preset : [ 'default', { discardComments : { removeAll : true } } ], // potrebne, aby boli odstranene vsetky komentare vratane licencnych
                    },
                }),
            ],
        },
        output : {
            path : Path.resolve(ProjectRoot + '/public/assets'),
            filename : 'js/app.js',
        },
        performance : {
            hints : false,
        },
        plugins : [
            new MiniCssExtractPlugin({ filename : 'css/app-' + colorMode + '.css' }),
            new Webpack.DefinePlugin({ __VUE_OPTIONS_API__: true, __VUE_PROD_DEVTOOLS__: false }),
            new VueLoaderPlugin(),
            (Config.notifier) ? new WebpackBuildNotifier() : false,
        ].filter(Boolean),
        stats : {
            assets : false,
            modules : false,
            entrypoints : false,
            hash : false,
            version : false,
            builtAt : false,
            colors : true,
        },
    };
};
