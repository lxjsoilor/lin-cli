"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const common_1 = require("../common");
exports.default = (api, options) => {
    const names = common_1.getComponents();
    const components = {};
    names.forEach(name => {
        let path = path_1.join(common_1.SRC_DIR, name);
        components[name] = common_1.normalizePath(path);
    });
    api.mode('production')
        .entryPoints
        .clear()
        .end()
        .output
        .path(common_1.LIB_DIR)
        .filename('[name]/index.js')
        .chunkFilename('[id].js')
        .publicPath('/')
        .end();
    api.merge({
        entry: components
    });
    api.plugins.delete('html');
};
