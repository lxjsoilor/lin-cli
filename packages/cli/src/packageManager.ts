import { execSync } from "child_process";
import executeCommand from "./utils/executeCommand";

/**
 * 是否有 yarn 环境
 */
const hasYarn = () => {
	try {
		execSync("yarn --version", { stdio: "ignore" });
		return true;
	} catch (e) {
		return false;
	}
};
const PACKAGE_MANAGER_CONFIG: any = {
	npm: {
		install: ["install", "--loglevel", "error"],
		add: ["install", "--loglevel", "error"],
		upgrade: ["update", "--loglevel", "error"],
		remove: ["uninstall", "--loglevel", "error"],
	},
	yarn: {
		install: [],
		add: ["add"],
		upgrade: ["upgrade"],
		remove: ["remove"],
	},
};
/**
 * 包管理
 */
export default class PackageManager {
	/**
	 * 命令方式
	 */
	bin: string = "yarn";
	/**
	 * 目标路径
	 */
	targetDir: string;
	constructor(targetDir?: string) {
		this.targetDir = targetDir || process.cwd();
		if (!hasYarn()) {
			this.bin = "yarn";
		} else {
			this.bin = "npm";
		}
	}

	/**
	 * 运行命令行
	 * @param command
	 * @param args
	 */
	async runCommand(command: string, args?: Array<any>) {
		return await executeCommand(this.bin, [...PACKAGE_MANAGER_CONFIG[this.bin][command], ...(args || [])], this.targetDir);
	}
	/**
	 * 下载 package.json 中的依赖包
	 * 如： yarn install npm install
	 */
	async install() {
		return await this.runCommand("install");
	}
	/**
	 * 添加一个依赖包
	 * 如： yarn add vue npm install vue --save
	 */
	async add(packageName: string, { tilde = false, dev = true } = {}) {
		const args = dev ? ["-D"] : [];
		if (tilde) {
			if (this.bin === "yarn") {
				args.push("--tilde");
			} else {
				process.env.npm_config_save_prefix = "~";
			}
		}

		return await this.runCommand("add", [packageName, ...args]);
	}
	/**
	 * 移除一个依赖包
	 */
	async remove(packageName: string) {
		return await this.runCommand("remove", [packageName]);
	}

	/**
	 * 升级一个依赖包
	 * @param packageName
	 */
	async upgrade(packageName: string) {
		// const realname = stripVersion(packageName);
		// if (packageName === "@vue/cli-service" || isOfficialPlugin(resolvePluginId(realname))) {
		// 	// link packages in current repo for test
		// 	const src = path.resolve(__dirname, `../../../../${realname}`);
		// 	const dest = path.join(this.context, "node_modules", realname);
		// 	await fs.remove(dest);
		// 	await fs.symlink(src, dest, "dir");
		// 	return;
		// }

		return await this.runCommand("add", [packageName]);
	}
}

// extract the package name 'xx' from the format 'xx@1.1'
// function stripVersion(packageName: string) {
// 	const nameRegExp = /^(@?[^@]+)(@.*)?$/;
// 	const result = packageName.match(nameRegExp);

// 	if (!result) {
// 		throw new Error(`Invalid package name ${packageName}`);
// 	}

// 	return result[1];
// }
