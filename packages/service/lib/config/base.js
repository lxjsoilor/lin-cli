"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const webpackbar_1 = __importDefault(require("webpackbar"));
exports.default = (api, options) => {
    const inlineLimit = 4096;
    const getAssetPath = (options, filePath) => {
        return options.assetsDir
            ? path_1.default.posix.join(options.assetsDir, filePath)
            : filePath;
    };
    const genAssetSubPath = (dir) => {
        return getAssetPath(options, `${dir}/[name]${options.filenameHashing ? '.[hash:8]' : ''}.[ext]`);
    };
    const genUrlLoaderOptions = (dir) => {
        return {
            limit: inlineLimit,
            // use explicit fallback to avoid regression in url-loader>=1.1.0
            fallback: {
                loader: require.resolve('file-loader'),
                options: {
                    name: genAssetSubPath(dir)
                }
            }
        };
    };
    const getMiniCssPlugin = () => {
        if (options.cssPlugins) {
            return options.cssPlugins;
        }
        return [
            {
                filename: '[name].css',
                chunkFilename: '[id].css'
            }
        ];
    };
    const babelOptions = {
        presets: [require.resolve('@vue/babel-preset-app')]
    };
    // 入口
    api.mode('development') // development 开发  production 生产 test 测试环境
        //  .context()
        .entry('app')
        .add('./src/main.js').end()
        // 输出
        .output
        .path(process.cwd())
        .filename('[name].js')
        .publicPath('/');
    // 配置 Webpack 如何寻找模块所对应的文件
    api.resolve
        // .plugin()
        .extensions
        .merge(['.js', '.jsx', '.vue', '.json', '.wasm'])
        .end()
        .modules
        .add('node_modules')
        .end()
        .alias
        .set('@', 'src')
        .set('vue$', options.runtimeCompiler
        ? 'vue/dist/vue.esm.js'
        : 'vue/dist/vue.runtime.esm.js');
    api.module
        .rule('js')
        .test(/\.js$/)
        .use('babel-loader')
        .loader(require.resolve('babel-loader'))
        //   .tap(() => babelOptions)
        .end()
        .exclude
        .add(/node_modules/)
        // .add(/@vue\/cli-service/)
        .end();
    // images
    api.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('img'));
    api.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options(genUrlLoaderOptions('svg'));
    api.module
        .rule('media')
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('media'));
    api.module
        .rule('fonts')
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('fonts'));
    api.plugin("extract-css")
        .use(require('mini-css-extract-plugin'), getMiniCssPlugin())
        .end();
    api.plugin('html')
        .use(html_webpack_plugin_1.default, [{
            title: 'title',
            // logo: siteConfig.logo,
            // description: siteConfig.description,
            chunks: ['chunks', 'app'],
            clientLogLevel: "none",
            quiet: true,
            template: options.htmlPath ? options.htmlPath : path_1.default.join(process.cwd(), './src/index.html'),
            filename: 'index.html',
            inject: true
            // baiduAnalytics,
        }])
        .end();
    api.plugin('WebpackBar')
        .use(webpackbar_1.default, [{
            name: 'Tiger Cli',
            color: '#07c160',
        }])
        .end();
};
