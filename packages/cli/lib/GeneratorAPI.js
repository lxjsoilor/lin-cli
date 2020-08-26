"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const globby_1 = __importDefault(require("globby"));
const resolve_1 = __importDefault(require("resolve"));
const deepmerge_1 = __importDefault(require("deepmerge"));
const isbinaryfile_1 = require("isbinaryfile");
const replaceBlockRE = /<%# REPLACE %>([^]*?)<%# END_REPLACE %>/g;
const isString = (val) => typeof val === "string";
const isFunction = (val) => typeof val === "function";
const isObject = (val) => val && typeof val === "object";
const mergeArrayWithDedupe = (a, b) => Array.from(new Set([...a, ...b]));
class GeneratorAPI {
    constructor(id, generator, options, rootOptions) {
        this.id = id;
        this.generator = generator;
        this.options = options;
        this.rootOptions = rootOptions;
        this._entryFile = undefined;
    }
    /**
     * 获取入口文件
     */
    get entryFile() {
        if (this._entryFile)
            return this._entryFile;
        console.log(fs_1.default.existsSync(path_1.default.resolve(this.generator.context, "src/main.ts")));
        return (this._entryFile = fs_1.default.existsSync(path_1.default.resolve(this.generator.context, "src/main.ts")) ? "src/main.ts" : "src/main.ts");
    }
    /**
     * 获取当前的路径
     * @param paths
     */
    resolve(paths) {
        return path_1.default.resolve(this.generator.context, paths);
    }
    /**
     * 判断是否有plugin 为 id 的配置
     * @param id
     * @param version
     */
    hasPlugin(id, version) {
        return this.generator.hasPlugin(id, version);
    }
    /**
     * 插入 import 到 某个文件
     * @param file
     * @param imports
     */
    injectImports(file, imports) {
        const _imports = this.generator.imports[file] || (this.generator.imports[file] = new Set());
        (Array.isArray(imports) ? imports : [imports]).forEach((imp) => {
            _imports.add(imp);
        });
    }
    /**
     *
     */
    injectRootOptions(file, options) {
        const _options = this.generator.rootOptions[file] || (this.generator.rootOptions[file] = new Set());
        (Array.isArray(options) ? options : [options]).forEach((opt) => {
            _options.add(opt);
        });
    }
    /**
     *
     */
    injectOthers(file, options) {
        const _others = this.generator.otherCode[file] || (this.generator.otherCode[file] = new Set());
        (Array.isArray(options) ? options : [options]).forEach((opt) => {
            _others.add(opt);
        });
    }
    // 修改 'package.json' 里的字段
    extendPackage(fields) {
        const pkg = this.generator.pkg;
        const toMerge = isFunction(fields) ? fields(pkg) : fields;
        for (const key in toMerge) {
            const value = toMerge[key];
            const existing = pkg[key];
            // 如果是 object
            if (isObject(value) && (key === "dependencies" || key === "devDependencies")) {
                // console.log(key +"-"+ value +' : ', value);
                if (!pkg[key])
                    pkg[key] = {};
                pkg[key] = Object.assign(pkg[key], value);
                // todo
            }
            else if (Array.isArray(value) && Array.isArray(existing)) {
                pkg[key] = mergeArrayWithDedupe(existing, value);
            }
            else if (isObject(value) && isObject(existing)) {
                pkg[key] = deepmerge_1.default(existing, value, { arrayMerge: mergeArrayWithDedupe });
            }
            else {
                pkg[key] = value;
            }
        }
    }
    // 复制并用 ejs 渲染 ./template 内所有文件
    render(source, additionalData, ejsOptions) {
        const baseDir = this.extractCallDir();
        if (isString(source)) {
            const data = this._resolveData(additionalData);
            const sources = path_1.default.resolve(baseDir, source);
            this._injectFileMiddleware(async (files) => {
                const _files = await globby_1.default(["**/*"], { cwd: sources });
                for (const rawPath of _files) {
                    const targetPath = rawPath
                        .split("/")
                        .map((filename) => {
                        // dotfiles are ignored when published to npm, therefore in templates
                        // we need to use underscore instead (e.g. "_gitignore")
                        if (filename.charAt(0) === "_" && filename.charAt(1) !== "_") {
                            return `.${filename.slice(1)}`;
                        }
                        if (filename.charAt(0) === "_" && filename.charAt(1) === "_") {
                            return `${filename.slice(1)}`;
                        }
                        return filename;
                    })
                        .join("/");
                    const sourcePath = path_1.default.resolve(sources, rawPath);
                    const content = this.renderFile(sourcePath, data, ejsOptions);
                    if (Buffer.isBuffer(content) || /[^\s]/.test(content)) {
                        files[targetPath] = content;
                    }
                }
            });
        }
        else if (isObject(source)) {
            this._injectFileMiddleware((files) => {
                const data = this._resolveData(additionalData);
                for (const targetPath in source) {
                    const sourcePath = path_1.default.resolve(baseDir, source[targetPath]);
                    const content = this.renderFile(sourcePath, data, ejsOptions);
                    if (Buffer.isBuffer(content) || content.trim()) {
                        files[targetPath] = content;
                    }
                }
            });
        }
        else if (isFunction(source)) {
            this._injectFileMiddleware(source);
        }
    }
    _resolveData(additionalData) {
        return Object.assign({
            options: this.options,
            rootOptions: this.rootOptions,
            plugins: [],
        }, additionalData);
    }
    /**
     *
     */
    _injectFileMiddleware(middleware) {
        this.generator.fileMiddlewares.push(middleware);
    }
    /**
     * 渲染文件
     * @param name
     * @param data
     * @param ejsOptions
     */
    renderFile(name, data, ejsOptions) {
        // 判断是否是二进制文件
        if (isbinaryfile_1.isBinaryFileSync(name)) {
            return fs_1.default.readFileSync(name); // return buffer
        }
        // 如果不是
        const template = fs_1.default.readFileSync(name, "utf-8");
        const yaml = require("yaml-front-matter");
        // 解析模板
        const parsed = yaml.loadFront(template);
        const content = parsed.__content;
        let finalTemplate = content.trim() + `\n`;
        if (parsed.when) {
            finalTemplate = `<%_ if (${parsed.when}) { _%>` + finalTemplate + `<%_ } _%>`;
            // use ejs.render to test the conditional expression
            // if evaluated to falsy value, return early to avoid extra cost for extend expression
            const result = ejs_1.default.render(finalTemplate, data, ejsOptions);
            if (!result) {
                return "";
            }
        }
        // 如果有 extend 的文件
        if (parsed.extend) {
            const extendPath = path_1.default.isAbsolute(parsed.extend) ? parsed.extend : resolve_1.default.sync(parsed.extend, { basedir: path_1.default.dirname(name) });
            // const extendPath = parsed.extend;
            finalTemplate = fs_1.default.readFileSync(extendPath, "utf-8");
            if (parsed.replace) {
                if (Array.isArray(parsed.replace)) {
                    const replaceMatch = content.match(replaceBlockRE);
                    if (replaceMatch) {
                        const replaces = replaceMatch.map((m) => {
                            return m.replace(replaceBlockRE, "$1").trim();
                        });
                        parsed.replace.forEach((r, i) => {
                            finalTemplate = finalTemplate.replace(r, replaces[i]);
                        });
                    }
                }
                else {
                    finalTemplate = finalTemplate.replace(parsed.replace, content.trim());
                }
            }
        }
        return ejs_1.default.render(finalTemplate, data, ejsOptions);
    }
    /**
     *
     * @param cb
     */
    postProcessFiles(cb) {
        this.generator.postProcessFilesCbs.push(cb);
    }
    extractCallDir() {
        const obj = {};
        Error.captureStackTrace(obj);
        const callSite = obj.stack.split("\n")[3];
        const fileName = callSite.match(/\s\((.*):\d+:\d+\)$/)[1];
        return path_1.default.dirname(fileName);
    }
}
exports.default = GeneratorAPI;
