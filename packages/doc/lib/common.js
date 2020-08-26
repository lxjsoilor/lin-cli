"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponents = exports.getDocConfig = exports.hasDefaultExport = exports.removeExt = exports.normalizePath = exports.formatName = exports.pascalize = exports.camelize = exports.PACKAGE_ENTRY = exports.PACKAGE_JSON_FILE = exports.ENTRY_EXTS = exports.DOC_CONFIG_DIR = exports.DIST_DIR = exports.DOCS_DIR = exports.SRC_DIR = exports.LIB_DIR = exports.CWD = void 0;
const path_1 = require("path");
const fs_extra_1 = require("fs-extra");
// 命令行当前的 路径
exports.CWD = process.cwd();
exports.LIB_DIR = path_1.join(exports.CWD, 'lib');
// src 的相对路径
exports.SRC_DIR = path_1.join(exports.CWD, 'src');
// 静态文档的相对路径
exports.DOCS_DIR = path_1.join(exports.CWD, 'docs');
// dist
exports.DIST_DIR = path_1.join(exports.CWD, 'dist');
// 配置文件的路径
exports.DOC_CONFIG_DIR = path_1.join(exports.CWD, "doc.config.js");
exports.ENTRY_EXTS = ['js', 'ts', 'tsx', 'jsx', 'vue'];
exports.PACKAGE_JSON_FILE = path_1.join(exports.CWD, 'package.json');
// 
exports.PACKAGE_ENTRY = path_1.join(__dirname, '../dist/package-entry.js');
const camelizeRE = /-(\w)/g;
const pascalizeRE = /(\w)(\w*)/g;
/**
 * 转为驼峰格式
 * @param str
 */
function camelize(str) {
    return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}
exports.camelize = camelize;
function pascalize(str) {
    return camelize(str).replace(pascalizeRE, (_, c1, c2) => c1.toUpperCase() + c2);
}
exports.pascalize = pascalize;
function formatName(component, lang) {
    component = pascalize(component);
    if (lang) {
        return `${component}_${lang.replace('-', '_')}`;
    }
    return component;
}
exports.formatName = formatName;
function normalizePath(path) {
    return path.replace(/\\/g, '/');
}
exports.normalizePath = normalizePath;
function removeExt(path) {
    return path.replace('.js', '');
}
exports.removeExt = removeExt;
function hasDefaultExport(code) {
    return code.includes('export default') || code.includes('export { default }');
}
exports.hasDefaultExport = hasDefaultExport;
/**
 * 获取 doc 配置文件
 */
function getDocConfig() {
    return require(exports.DOC_CONFIG_DIR);
}
exports.getDocConfig = getDocConfig;
/**
 * 获取组件
 */
function getComponents() {
    const EXCLUDES = ['.DS_Store'];
    const dirs = fs_extra_1.readdirSync(exports.SRC_DIR);
    return dirs
        .filter(dir => !EXCLUDES.includes(dir))
        .filter(dir => exports.ENTRY_EXTS.some(ext => {
        const path = path_1.join(exports.SRC_DIR, dir, `index.${ext}`);
        if (fs_extra_1.existsSync(path)) {
            return hasDefaultExport(fs_extra_1.readFileSync(path, 'utf-8'));
        }
        return false;
    }));
}
exports.getComponents = getComponents;
