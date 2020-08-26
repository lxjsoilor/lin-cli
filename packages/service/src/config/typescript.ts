import Config from 'webpack-chain';
export default (api:Config, options:any) => {
    // console.log(api,options);
    api.resolve
        .extensions
        .prepend('.ts')
        .prepend('.tsx')
}