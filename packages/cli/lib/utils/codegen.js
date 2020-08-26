"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jscodeshift_1 = __importDefault(require("jscodeshift"));
// @ts-ignore
const vue_jscodeshift_adapter_1 = __importDefault(require("vue-jscodeshift-adapter"));
/**
 * 修改文件代码
 * @param module
 * @param fileInfo
 * @param options
 */
function CodeGen(module, fileInfo, options = {}) {
    const transform = typeof module.default === "function" ? module.default : module;
    let parser = module.parser || options.parser;
    if (!parser) {
        if (fileInfo.path.endsWith(".ts")) {
            parser = "ts";
        }
        else if (fileInfo.path.endsWith(".tsx")) {
            parser = "tsx";
        }
    }
    let jscodeshift = jscodeshift_1.default;
    if (parser) {
        jscodeshift = jscodeshift_1.default.withParser(parser);
    }
    const api = {
        jscodeshift,
        j: jscodeshift,
        stats: () => { },
        report: () => { },
    };
    return vue_jscodeshift_adapter_1.default(transform)(fileInfo, api, options);
}
exports.default = CodeGen;
