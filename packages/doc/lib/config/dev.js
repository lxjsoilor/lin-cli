"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
// @ts-ignore
// import DocSearchPlugin from "@tiger/doc-search";
exports.default = (api, options) => {
    api.mode("development").entry("app").clear().add(path_1.default.join(__dirname, "../../site/desktop/main.js")).end();
    api.module
        .rule("md")
        .test(/\.md$/)
        .use("vue-loader")
        .loader(require.resolve("vue-loader"))
        .end()
        .use("md-loader")
        .loader(require.resolve("@tiger/md-loader"))
        .options({
        name: "[name]",
    })
        .end();
    // .use('doc-search')
    //     .loader(require.resolve('@tiger/doc-search'))
    // api.plugin("md-loader").use(DocSearchPlugin).end();
    api.resolve.alias.set("site-shared", path_1.default.join(__dirname, "../../dist/site-shared.js"));
    // api.resolve
    //     .extensions
    //     .prepend('.ts')
    //     .prepend('.tsx')
};
