"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = exports.server = void 0;
const webpack_chain_1 = __importDefault(require("webpack-chain"));
exports.Config = webpack_chain_1.default;
const webpack_1 = __importDefault(require("webpack"));
const webpack_dev_server_1 = __importDefault(require("webpack-dev-server"));
const utils_1 = require("@tiger/utils");
class Service {
    // 
    constructor(args) {
        this.plugins = this.resolvePlugins(args.plugins);
        this.config = new webpack_chain_1.default();
        this.htmlPath = args.htmlPath;
        this.cssPlugins = args.cssPlugins;
        this.publicPath = args.publicPath;
    }
    init() {
        const { cssPlugins, htmlPath, publicPath } = this;
        this.plugins.forEach(item => {
            item.apply(this.config, { runtimeCompiler: true, htmlPath, cssPlugins, publicPath });
        });
    }
    resolvePlugins(otherPlugins) {
        let plugins = [];
        const idToPlugin = (id) => ({
            id: id.replace(/^.\//, 'local:'),
            apply: require(id).default
        });
        const idToPluginOther = (id) => ({
            id: id.replace(/^.\//, 'other:'),
            apply: require(id).default
        });
        const localPlugins = [
            './config/base',
            './config/css',
            './config/vue'
        ].map(idToPlugin);
        if (otherPlugins)
            plugins = localPlugins.concat(otherPlugins.map(idToPluginOther));
        else
            plugins = localPlugins;
        return plugins;
    }
    /**
     *
     */
    run(port, config) {
        this.init();
        const webpackConfig = this.config.toConfig();
        const server = new webpack_dev_server_1.default(webpack_1.default(webpackConfig), config.devServer);
        utils_1.logServerInfo(port);
        server.listen(port, 'localhost', (err) => {
            if (err) {
                console.log(err);
            }
        });
    }
    build() {
        this.init();
        const webpackConfig = this.config.toConfig();
        webpack_1.default(webpackConfig, (err, stats) => {
            console.log(err);
        });
    }
}
exports.default = Service;
exports.server = (name, options) => {
    console.log(name, options);
    const { port } = options;
    const server = new Service({});
    if (name == 'dev') {
        server.run(port ? port : 9001, {
            devServer: {}
        });
    }
    if (name == 'build') {
        console.log(name);
        server.build();
    }
};
