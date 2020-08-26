import { EventEmitter } from "events";
import inquirer from "inquirer";
import chalk from "chalk";
import Generator from "./Generator";
import PromptModuleApi from "./PromptModuleAPI";
import { writeFlieTree } from "./utils/writeFileTree";
import executeCommand from "./utils/executeCommand";
import { saveOptions, loadOptions, savePreset } from "./utils/options";
import PackageManager from "./packageManager";
// 是否是手动模式
const isManualMode = (answers: any) => answers.preset === "__manual__";

/**
 * 创建者
 */
export class Creator extends EventEmitter {
	/**
	 * 项目名称
	 */
	name?: string;
	/**
	 * 目录地址
	 */
	context: string;
	featurePrompt?: any;
	presetPrompt?: any;
	/**
	 * prompt 结尾
	 */
	outroPrompts?: any;
	injectedPrompts?: any;
	promptCompleteCbs: Array<Function> = [];
	constructor(name: string, context: string, promptModules: Array<Function>) {
		super();
		this.name = name;
		const { presetPrompt, featurePrompt } = this.resolveIntroPrompts();
		this.presetPrompt = presetPrompt;
		this.featurePrompt = featurePrompt;
		this.injectedPrompts = [];
		this.promptCompleteCbs = [];
		this.outroPrompts = this.resolveOutroPrompts();
		const api = new PromptModuleApi(this);
		this.context = context;
		promptModules.forEach((fn: Function) => fn(api));
	}
	/**
	 *
	 * @param options
	 */
	async create(options: any) {
		const { preset } = options;
		let presetT: any = {
			plugins: {
				"@vue/cli-service": {},
			},
		};
		if (preset) {
			if (typeof preset === 'string') {
				presetT = await this.resolvePreset(preset);
			} else {
				presetT = preset;
			}
		} else {
			presetT = await this.promptAndResolvePreset();
		}
		presetT.plugins["@vue/cli-service"] = Object.assign(
			{
				projectName: this.name,
			},
			presetT
		);

		// 生成 package.json
		const pkg: any = {
			name: this.name,
			version: "0.1.0",
			private: true,
			devDependencies: {},
			// todo 读取本地的 package.json
		};

		Object.keys(presetT.plugins).forEach((key) => {
			pkg.devDependencies[key] = presetT.plugins[key].version || "latest";
		});
		// console.log(pkg);
		await writeFlieTree(this.context, { "package.json": JSON.stringify(pkg, null, 2) });

		const pm = new PackageManager(this.context);
		console.log(`⚙\u{fe0f}  安装脚手架插件,这可能需要一段时间...`);
		// 下载内置依赖
		await pm.install();
		// const { afterInvokeCbs, afterAnyInvokeCbs } = this;
		console.log(presetT.plugins);
		const plugins = await this.pluginsToArray(presetT.plugins);
		// generator
		const generator = new Generator(this.context, { pkg, plugins });
		await generator.generate({});

		console.log(`安装额外的依赖关系...`);
		// 下载
		await pm.install();
	}

	async pluginsToArray(rawPlugins: { [key: string]: any }) {
		const plugins: Array<any> = [];
		const ttt: any = this.sortObject(rawPlugins, ["@vue/cli-service"], true);
		for (const id of Object.keys(ttt)) {
			// const apply = await Module.createRequire(`${this.context}/package.json`)(`${id}/generator`);
			// console.log(apply);
			plugins.push({ id, plugins: ttt[id] });
		}
		return plugins;
	}
	/**
	 * 排序对象
	 * @param obj
	 * @param keyOrder
	 * @param dontSortByUnicode
	 */
	sortObject(obj: any, keyOrder: any, dontSortByUnicode: any) {
		if (!obj) return;
		const res: { [key: string]: any } = {};

		if (keyOrder) {
			keyOrder.forEach((key: string) => {
				if (obj.hasOwnProperty(key)) {
					res[key] = obj[key];
					delete obj[key];
				}
			});
		}

		const keys = Object.keys(obj);

		!dontSortByUnicode && keys.sort();
		keys.forEach((key) => {
			res[key] = obj[key];
		});

		return res;
	}

	/**
	 * 加载本地预设
	 * @param name
	 */
	async resolvePreset(name: string) {
		let preset;
		preset = await this.getPresets();
		preset[name];
		if (!preset[name]) {
			console.error(chalk.red(`Tiger Error: not find preset ${name}`));
			process.exit(1);
		}
		return preset[name];
	}

	/**
	 * 选中预设
	 * @param answers
	 */
	async promptAndResolvePreset(answers: any = null) {
		if (!answers) {
			// todo 清理 console
			answers = await inquirer.prompt(this.resolveFinalPrompts());
		}
		let preset: any;
		if (answers.preset && answers.preset !== "__manual__") {
			preset = await this.resolvePreset(answers.preset);
		} else {
			preset = {
				useConfigFiles: answers.useConfigFiles === "files",
				plugins: {},
			};
			answers.features = answers.features || [];
			this.promptCompleteCbs.forEach((cb: Function) => cb(answers, preset));
		}
		if (answers.save && answers.saveName) {
			savePreset(answers.saveName, preset);
		}
		return preset;
	}

	/**
	 * 获取本地配置
	 */
	getPresets() {
		const presets = loadOptions().presets;
		return Object.assign({}, presets);
	}

	/**
	 * 介绍提示
	 */
	resolveIntroPrompts() {
		const presets = this.getPresets();
		const presetsChoices = Object.keys(presets).map((name) => {
			return {
				name: `${name}`,
				value: name,
			};
		});
		const presetPrompt = {
			name: "preset",
			type: "list",
			message: `请选择一个预设:`,
			choices: [
				...presetsChoices,
				{
					name: "自定义",
					value: "__manual__",
				},
			],
		};

		const featurePrompt = {
			name: "features",
			when: isManualMode,
			type: "checkbox",
			message: "检查你的项目所需的特性:",
			choices: [],
			pageSize: 10,
		};
		return {
			presetPrompt,
			featurePrompt,
		};
	}
	/**
	 * 结尾部分提示
	 */
	resolveOutroPrompts() {
		const outroPrompts = [
			{
				name: "useConfigFiles",
				when: isManualMode,
				type: "list",
				message: "Babel, ESLint, etc. 配置放置在那?",
				choices: [
					{
						name: "在专用配置文件",
						value: "files",
					},
					{
						name: "package.json 中",
						value: "pkg",
					},
				],
			},
			{
				name: "save",
				when: isManualMode,
				type: "confirm",
				message: "保存为预设项目?",
				default: false,
			},
			{
				name: "saveName",
				when: (answers: any) => answers.save,
				type: "input",
				message: "预设保存为:",
			},
		];

		// const savedOptions = loadOptions()
		// if (!savedOptions.packageManager && (hasYarn() || hasPnpm3OrLater())) {
		//   const packageManagerChoices = []

		//   if (hasYarn()) {
		//     packageManagerChoices.push({
		//       name: 'Use Yarn',
		//       value: 'yarn',
		//       short: 'Yarn'
		//     })
		//   }

		//   if (hasPnpm3OrLater()) {
		//     packageManagerChoices.push({
		//       name: 'Use PNPM',
		//       value: 'pnpm',
		//       short: 'PNPM'
		//     })
		//   }

		//   packageManagerChoices.push({
		//     name: 'Use NPM',
		//     value: 'npm',
		//     short: 'NPM'
		//   })

		//   outroPrompts.push({
		//     name: 'packageManager',
		//     type: 'list',
		//     message: 'Pick the package manager to use when installing dependencies:',
		//     choices: packageManagerChoices
		//   })
		// }

		return outroPrompts;
	}

	/**
	 * 最终提示
	 */
	resolveFinalPrompts() {
		this.injectedPrompts.forEach((prompt: any) => {
			const originalWhen = prompt.when || (() => true);
			prompt.when = (answers: any) => {
				return isManualMode(answers) && originalWhen(answers);
			};
		});
		const prompts = [this.presetPrompt, this.featurePrompt, ...this.injectedPrompts, ...this.outroPrompts];
		return prompts;
	}
}
