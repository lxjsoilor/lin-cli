import Config from 'webpack-chain';
import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import WebpackBar from 'webpackbar'
export default (api: Config, options: any) => {

    const inlineLimit = 4096

    const getAssetPath = (options: { assetsDir: string; }, filePath: string) => {
        return options.assetsDir
            ? path.posix.join(options.assetsDir, filePath)
            : filePath
    }

    const genAssetSubPath = (dir: any) => {
        return getAssetPath(
            options,
            `${dir}/[name]${options.filenameHashing ? '.[hash:8]' : ''}.[ext]`
        )
    }

    const genUrlLoaderOptions = (dir: any) => {
        return {
            limit: inlineLimit,
            // use explicit fallback to avoid regression in url-loader>=1.1.0
            fallback: {
                loader: require.resolve('file-loader'),
                options: {
                    name: genAssetSubPath(dir)
                }
            }
        }
    }
    const getMiniCssPlugin = () => {
        if(options.cssPlugins){
            return options.cssPlugins
        }
        return [
            {
                filename: '[name].css',
                chunkFilename: '[id].css'
            }
        ]
    }
    const babelOptions = {
        presets: [require.resolve('@vue/babel-preset-app')]
    }
    // 入口
    api.mode('development')  // development 开发  production 生产 test 测试环境
        //  .context()
        .entry('app')
        .add('./src/main.js').end()
        // 输出
        .output
        .path(process.cwd())
        .filename('[name].js')
        .publicPath('/')

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
        .set(
            'vue$',
            options.runtimeCompiler
                ? 'vue/dist/vue.esm.js'
                : 'vue/dist/vue.runtime.esm.js'
        )
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
        .end()

    // images
    api.module
        .rule('images')
        .test(/\.(png|jpe?g|gif|webp)(\?.*)?$/)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('img'))
    api.module
        .rule('svg')
        .test(/\.(svg)(\?.*)?$/)
        .use('file-loader')
        .loader(require.resolve('file-loader'))
        .options(genUrlLoaderOptions('svg'))
    api.module
        .rule('media')
        .test(/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('media'))
    api.module
        .rule('fonts')
        .test(/\.(woff2?|eot|ttf|otf)(\?.*)?$/i)
        .use('url-loader')
        .loader(require.resolve('url-loader'))
        .options(genUrlLoaderOptions('fonts'))

    api.plugin("extract-css")
        .use(require('mini-css-extract-plugin'), getMiniCssPlugin())
        .end()

    api.plugin('html')
        .use(HtmlWebpackPlugin, [{
            title: 'title',
            // logo: siteConfig.logo,
            // description: siteConfig.description,
            chunks: ['chunks', 'app'],
            clientLogLevel: "none",
            quiet: true,
            template: options.htmlPath ? options.htmlPath : path.join(process.cwd(), './src/index.html'),
            filename: 'index.html',
            inject: true
            // baiduAnalytics,
        }])
        .end()
    api.plugin('WebpackBar')
        .use(WebpackBar, [{
            name: 'Tiger Cli',
            color: '#07c160',
        }])
        .end()

}