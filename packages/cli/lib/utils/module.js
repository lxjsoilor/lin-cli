"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const Module = require('module')
const module_1 = __importDefault(require("module"));
const path_1 = __importDefault(require("path"));
exports.createRequire = module_1.default.createRequire || module_1.default.createRequireFromPath || function (filename) {
    const mod = new module_1.default(filename, undefined);
    mod.filename = filename;
    mod.paths = module_1.default._nodeModulePaths(path_1.default.dirname(filename));
    mod._compile(`module.exports = require;`, filename);
    return mod.exports;
};
