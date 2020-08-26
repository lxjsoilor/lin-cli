"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
exports.default = (api, options) => {
    api.mode('production')
        .output
        .path(path_1.join(process.cwd(), 'dist'));
};
