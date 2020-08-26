"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (api, options) => {
    // console.log(api,options);
    api.resolve
        .extensions
        .prepend('.ts')
        .prepend('.tsx');
};
