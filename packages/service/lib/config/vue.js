"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api, options) => {
    const vueLoaderCacheIdentifier = {
        'vue-loader': require('vue-loader/package.json').version
    };
    try {
        // @ts-ignore
        vueLoaderCacheIdentifier['@vue/component-compiler-utils'] = require('@vue/component-compiler-utils/package.json').version;
        // @ts-ignore
        vueLoaderCacheIdentifier['vue-template-compiler'] = require('vue-template-compiler/package.json').version;
    }
    catch (e) { }
    api.module
        .rule('vue-loader')
        .test(/\.vue$/)
        .use('vue-loader')
        .loader(require.resolve('vue-loader'))
        .options(Object.assign({
        compilerOptions: {
            //   whitespace: 'condense',
            preserveWhitespace: false,
        }
    }, vueLoaderCacheIdentifier))
        .end();
    // .rule('vue-style-loader')
    // .use('vue-style-loader')
    // .loader(require.resolve('vue-style-loader'))
    // .options({
    //   sourceMap,
    //   shadowMode
    // })
    // .end()
    api.plugin('vueLoader')
        .use(require('vue-loader/lib/plugin'))
        .end();
};
