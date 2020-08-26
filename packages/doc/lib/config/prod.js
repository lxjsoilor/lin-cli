"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { join } from 'path';
const common_1 = require("../common");
exports.default = (api, options) => {
    api.mode('production')
        .output
        .path(common_1.DIST_DIR)
        .filename('[name].[hash:8].js')
        .chunkFilename('async_[name].[chunkhash:8].js')
        .publicPath(options.publicPath ? options.publicPath : '/')
        .end();
};
