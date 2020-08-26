"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const executeCommand_1 = __importDefault(require("./utils/executeCommand"));
/**
 * 是否有 yarn 环境
 */
const hasYarn = () => {
    try {
        child_process_1.execSync("yarn --version", { stdio: "ignore" });
        return true;
    }
    catch (e) {
        return false;
    }
};
const PACKAGE_MANAGER_CONFIG = {
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
class PackageManager {
    constructor(targetDir) {
        /**
         * 命令方式
         */
        this.bin = "yarn";
        this.targetDir = targetDir || process.cwd();
        if (!hasYarn()) {
            this.bin = "yarn";
        }
        else {
            this.bin = "npm";
        }
    }
    /**
     * 运行命令行
     * @param command
     * @param args
     */
    async runCommand(command, args) {
        return await executeCommand_1.default(this.bin, [...PACKAGE_MANAGER_CONFIG[this.bin][command], ...(args || [])], this.targetDir);
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
    async add(packageName, { tilde = false, dev = true } = {}) {
        const args = dev ? ["-D"] : [];
        if (tilde) {
            if (this.bin === "yarn") {
                args.push("--tilde");
            }
            else {
                process.env.npm_config_save_prefix = "~";
            }
        }
        return await this.runCommand("add", [packageName, ...args]);
    }
    /**
     * 移除一个依赖包
     */
    async remove(packageName) {
        return await this.runCommand("remove", [packageName]);
    }
    /**
     * 升级一个依赖包
     * @param packageName
     */
    async upgrade(packageName) {
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
exports.default = PackageManager;
// extract the package name 'xx' from the format 'xx@1.1'
// function stripVersion(packageName: string) {
// 	const nameRegExp = /^(@?[^@]+)(@.*)?$/;
// 	const result = packageName.match(nameRegExp);
// 	if (!result) {
// 		throw new Error(`Invalid package name ${packageName}`);
// 	}
// 	return result[1];
// }
