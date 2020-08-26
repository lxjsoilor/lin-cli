import Config from 'webpack-chain';
export default (api:Config, options:any) => {
    const createCSSRule = ( lang: string, test:RegExp  , loader ?: string, options ?: any) =>{
        const baseRule = api.module.rule(lang).test(test)
        const modulesRule = baseRule.oneOf('modules').resourceQuery(/module/)
        const normalRule = baseRule.oneOf('normal')

        applyLoaders(modulesRule, true)
        applyLoaders(normalRule, false)

        function applyLoaders (rule:any, modules:any) {
            // if (!isServer) {
            //   if (isProd) {
                rule.use('extract-css-loader').loader(require('mini-css-extract-plugin').loader)
            //   } else {
            //     rule.use('vue-style-loader').loader('vue-style-loader')
            //   }
            // }
        
            rule.use('css-loader')
              .loader(require.resolve('css-loader'))
              .options({
                modules,
                // localIdentName: `[path][name]__[local]--[hash:base64:5]`,
                importLoaders: 1,
                sourceMap: true
              })
              
            rule.use('postcss-loader').loader(require.resolve('postcss-loader')).options(Object.assign({
              plugins: [require('autoprefixer')],
              sourceMap: true
            }, {}))
            
            rule.use

            if (loader) {
              rule.use(loader).loader(require.resolve(loader)).options(options)
            }
          }

    }

    createCSSRule('css', /\.css$/)
    createCSSRule('postcss', /\.p(ost)?css$/)
    // createCSSRule('scss', /\.scss$/, 'sass-loader', siteConfig.scss)
    // createCSSRule('sass', /\.sass$/, 'sass-loader', Object.assign({ indentedSyntax: true }, siteConfig.sass))
    createCSSRule('less', /\.less$/, 'less-loader')
    // createCSSRule('stylus', /\.styl(us)?$/, 'stylus-loader', Object.assign({
    //     preferPathResolver: 'webpack'
    // }, siteConfig.stylus))
}