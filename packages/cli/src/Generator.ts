// import Module from 'module';
import path from "path";
import { writeFlieTree } from "./utils/writeFileTree";
import { createRequire } from "./utils/module";
import GeneratorAPI from "./GeneratorAPI";
import CodeGen from "./utils/codegen";
/**
 * 配置
 */
declare type GeneratorPluginType = {
	pkg?: object;
	plugins?: any;
	afterInvokeCbs?: Array<Function>;
	afterAnyInvokeCbs?: Array<Function>;
	files?: Object;
	invoking?: boolean;
};

/**
 *
 */
declare type OptionType = {
	extractConfigFiles?: boolean;
	checkExisting?: boolean;
};

/**
 * 插件生成器
 */
export default class Generator {
	context: string;
	plugins: GeneratorPluginType;
	rootOptions: { [key: string]: any };
	pkg?: object;
	// 文件中间件
	fileMiddlewares: Array<any> = [];
	// 存储解析后的文件
	files?: any;
	imports: { [key: string]: any };
	otherCode: { [key: string]: any };
	postProcessFilesCbs: Array<any>;
	constructor(context: string, plugins: GeneratorPluginType) {
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

	async generate(opt: OptionType) {
		const { extractConfigFiles, checkExisting } = opt;
		// 初始化配置
		await this.initPlugins();
		// console.log("test",this.context, this.plugins);
		await this.resolveFiles();
		// console.log(this.pkg);
		this.files["package.json"] = JSON.stringify(this.pkg, null, 2) + "\n";
		//
		await writeFlieTree(this.context, this.files);
	}

	/**
	 * 初始化配置
	 */
	async initPlugins() {
		const { plugins } = this.plugins;
		const pIds = plugins.map((p: any) => p.id);
		console.log("--plugins--", plugins);

		pIds.forEach(async (id: any) => {
			const plugin = plugins.filter((p: any) => p.id == id);
			const api = new GeneratorAPI(id, this, plugin[0].plugins, {});
			const apply = await createRequire(path.resolve(this.context, "package.json"))(`${id}/generator`);
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
				files[file] = CodeGen(require("./utils/codegens/inports"), { path: file, source: files[file] }, { imports });
			}

			let injections = this.rootOptions[file];
			injections = injections instanceof Set ? Array.from(injections) : injections;
			if (injections && injections.length > 0) {
				files[file] = CodeGen(require("./utils/codegens/injectOptions"), { path: file, source: files[file] }, { injections });
			}

			let injecOthers = this.otherCode[file];
			injecOthers = injecOthers instanceof Set ? Array.from(injecOthers) : injecOthers;
			if (injecOthers && injecOthers.length > 0) {
				files[file] = CodeGen(require("./utils/codegens/injectOther"), { path: file, source: files[file] }, { injecOthers });
			}
		});
	}

	/**
	 * 判断是否有plugin 为 id 的配置
	 * @param id
	 * @param version
	 */
	hasPlugin(id: String, version: String): boolean {
		return [...this.plugins.plugins].some((_id: string) => {
			if (id != _id) return false;
			if (!version) return true;
			return true;
		});
	}
}
