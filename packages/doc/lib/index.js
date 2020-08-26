"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doc = void 0;
const service_1 = __importDefault(require("@tiger/service"));
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const gen_package_entry_1 = require("./gen-package-entry");
const gen_site_shared_1 = require("./gen-site-shared");
const common_1 = require("./common");
exports.doc = (name, options) => {
    switch (name) {
        case 'dev':
            docDev(options);
            break;
        case 'build':
            docBuild(options);
            break;
        default:
            break;
    }
};
const docDev = (options) => {
    gen_package_entry_1.genPackageEntry({
        outputPath: common_1.PACKAGE_ENTRY
    });
    gen_site_shared_1.genSiteShared();
    const plugins = [
        require.resolve('./config/dev'),
    ];
    const htmlPath = path_1.join(__dirname, '../site/desktop/index.html');
    const serve = new service_1.default({ plugins, htmlPath });
    serve.run(options.port ? options.port : 9002, {
        devServer: {}
    });
};
const docBuild = (options) => {
    const { site, path } = options;
    if (site) {
        gen_package_entry_1.genPackageEntry({
            outputPath: common_1.PACKAGE_ENTRY
        });
        gen_site_shared_1.genSiteShared();
        const plugins = [
            require.resolve('./config/dev'),
            require.resolve('./config/prod')
        ];
        const htmlPath = path_1.join(__dirname, '../site/desktop/index.html');
        // 清空文档
        fs_extra_1.emptyDir(common_1.DIST_DIR);
        const serve = new service_1.default({ plugins, htmlPath, publicPath: path ? path : '/' });
        serve.build();
    }
    else {
        buildComponent();
    }
};
const buildComponent = async () => {
    gen_package_entry_1.genPackageEntry({
        outputPath: common_1.PACKAGE_ENTRY
    });
    // 清空 lib
    await fs_extra_1.emptyDir(common_1.LIB_DIR);
    // 1. 输出 packageEntry.js 到 lib
    gen_package_entry_1.genPackageEntry({
        outputPath: path_1.join(common_1.LIB_DIR, 'index.js'),
        pathResolver: (path) => `./${path_1.relative(common_1.SRC_DIR, path)}`
    });
    // 2. 编译组件
    const plugins = [
        require.resolve('./config/prod-component'),
    ];
    const serve = new service_1.default({ plugins, cssPlugins: [{
                filename: '[name]/index.css',
                chunkFilename: '[id].css'
            }] });
    serve.build();
    // 3. 编译 以 packageEntry.js 为入口的
    buildCommon();
};
/**
 *
 */
const buildCommon = async () => {
    const plugins = [
        require.resolve('./config/prod-common'),
    ];
    const serve = new service_1.default({ plugins });
    serve.build();
};
