"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import Module from 'module';
const path_1 = __importDefault(require("path"));
const writeFileTree_1 = require("./utils/writeFileTree");
const module_1 = require("./utils/module");
const GeneratorAPI_1 = __importDefault(require("./GeneratorAPI"));
const codegen_1 = __importDefault(require("./utils/codegen"));
/**
 * 插件生成器
 */
class Generator {
    constructor(context, plugins) {
        // 文件中间件
        this.fileMiddlewares = [];
        this.context = context;
        this.plugins = plugins;
        this.pkg = Object.assign({}, plugins.pkg);
        this.fileMiddlewares = [];
        this.postProcessFilesCbs = [];
        this.files = plugins.files || {};
        this.imports = {};
        this.rootOptions = {};
        this.otherCode = {};
    }
    async generate(opt) {
        const { extractConfigFiles, checkExisting } = opt;
        // 初始化配置
        await this.initPlugins();
        // console.log("test",this.context, this.plugins);
        await this.resolveFiles();
        // console.log(this.pkg);
        this.files["package.json"] = JSON.stringify(this.pkg, null, 2) + "\n";
        //
        await writeFileTree_1.writeFlieTree(this.context, this.files);
    }
    /**
     * 初始化配置
     */
    async initPlugins() {
        const { plugins } = this.plugins;
        const pIds = plugins.map((p) => p.id);
        console.log("--plugins--", plugins);
        pIds.forEach(async (id) => {
            const plugin = plugins.filter((p) => p.id == id);
            const api = new GeneratorAPI_1.default(id, this, plugin[0].plugins, {});
            const apply = await module_1.createRequire(path_1.default.resolve(this.context, "package.json"))(`${id}/generator`);
            console.log(plugin);
            await apply(api, plugin[0].plugins);
        });
    }
    /**
     *
     */
    async resolveFiles() {
        const files = this.files;
        for (const middleware of this.fileMiddlewares) {
            await middleware(files);
        }
        for (const postProcess of this.postProcessFilesCbs) {
            await postProcess(files);
        }
        Object.keys(files).forEach((file) => {
            let imports = this.imports[file];
            imports = imports instanceof Set ? Array.from(imports) : imports;
            if (imports && imports.length > 0) {
                files[file] = codegen_1.default(require("./utils/codegens/inports"), { path: file, source: files[file] }, { imports });
            }
            let injections = this.rootOptions[file];
            injections = injections instanceof Set ? Array.from(injections) : injections;
            if (injections && injections.length > 0) {
                files[file] = codegen_1.default(require("./utils/codegens/injectOptions"), { path: file, source: files[file] }, { injections });
            }
            let injecOthers = this.otherCode[file];
            injecOthers = injecOthers instanceof Set ? Array.from(injecOthers) : injecOthers;
            if (injecOthers && injecOthers.length > 0) {
                files[file] = codegen_1.default(require("./utils/codegens/injectOther"), { path: file, source: files[file] }, { injecOthers });
            }
        });
    }
    /**
     * 判断是否有plugin 为 id 的配置
     * @param id
     * @param version
     */
    hasPlugin(id, version) {
        return [...this.plugins.plugins].some((_id) => {
            if (id != _id)
                return false;
            if (!version)
                return true;
            return true;
        });
    }
}
exports.default = Generator;
