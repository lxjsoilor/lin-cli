"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../common");
exports.default = (api, options) => {
    api.mode("production").entryPoints.clear().end().entry("tiger").clear().add(common_1.PACKAGE_ENTRY).end().output.path(common_1.LIB_DIR).filename("[name].min.js").chunkFilename("[id].js").publicPath("/").end();
    api.plugins.delete("html");
};
