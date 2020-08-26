import Config from 'webpack-chain';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { logServerInfo, log } from "@tiger/utils";

type ServiceType = {
    plugins ?: Object,
    htmlPath ?: string,
    cssPlugins? :any,
    publicPath? : string
}

export default class Service {
    plugins : Array<any>
    config : Config
    htmlPath ?: string
    cssPlugins: any
    publicPath ?: string
    // 
    constructor(args: ServiceType) {
        this.plugins = this.resolvePlugins(args.plugins);
        this.config = new Config();
        this.htmlPath = args.htmlPath;
        this.cssPlugins = args.cssPlugins
        this.publicPath = args.publicPath
    }

    init() {
        const { cssPlugins, htmlPath, publicPath } = this;
        this.plugins.forEach(item => {
            item.apply(this.config, { runtimeCompiler: true, htmlPath, cssPlugins, publicPath })
        });
    }

    resolvePlugins(otherPlugins ?:any) {

        let plugins :Array<any> = []

        const idToPlugin = (id:string) => ({
            id: id.replace(/^.\//, 'local:'),
            apply: require(id).default
        })

        const idToPluginOther = (id:string) => ({
            id: id.replace(/^.\//, 'other:'),
            apply: require(id).default
        })

        const localPlugins = [
            './config/base',
            './config/css',
            './config/vue'
        ].map(idToPlugin)

        if(otherPlugins) plugins = localPlugins.concat(otherPlugins.map(idToPluginOther))
        else plugins = localPlugins

        return plugins
    }

    /**
     * 
     */
    run(port: number, config:any) {
        this.init();
        const webpackConfig = this.config.toConfig();
        const server = new WebpackDevServer(webpack(webpackConfig), config.devServer);
        logServerInfo(port);
        server.listen(port, 'localhost', (err?:Error) => {
            if (err) {
                console.log(err);
            }
        })
    }
    build() {
        this.init();
        const webpackConfig = this.config.toConfig();
        webpack(webpackConfig, (err, stats) => {
            console.log(err);
        });
    }
}


export const server = (name:string, options: any) => {
    console.log(name, options);
    const { port } = options
    const server = new Service({ })
    if(name == 'dev'){
        server.run(port ? port : 9001, {
            devServer: {
            }
        })
    }

    if(name == 'build'){
        console.log(name);
        server.build()
    }
}


export {
    Config
}
