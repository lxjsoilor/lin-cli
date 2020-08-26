"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const inquirer_1 = __importDefault(require("inquirer"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const validate_npm_package_name_1 = __importDefault(require("validate-npm-package-name"));
const chalk_1 = __importDefault(require("chalk"));
const creator_1 = require("./creator");
// import admin from './promptModules/admin'
const arr = [
    "babel",
    "typescript",
    // 'pwa',
    "router",
    "vuex",
    "admin",
    "table",
].map((file) => require(`./promptModules/${file}`).default);
/**
 * 创建本地项目
 * @param name
 * @param options
 */
async function create(name, options) {
    const targetDir = await validateNewProjectName(name, options);
    const creator = new creator_1.Creator(name, targetDir, arr);
    creator.create(options);
}
exports.create = create;
/**
 * 验证新的项目名称是否可用
 * @param name
 */
async function validateNewProjectName(name, options) {
    // 获取当前的工作目录
    const cwd = options.cwd || process.cwd();
    const inCurrent = name === ".";
    const projectName = inCurrent ? path_1.default.relative("../", cwd) : name;
    const targetDir = path_1.default.resolve(cwd, projectName || ".");
    const result = validate_npm_package_name_1.default(name);
    if (!result.validForNewPackages) {
        if (!result.validForNewPackages) {
            console.error(chalk_1.default.red.dim(`Invalid project name: "${name}"`));
            result.errors &&
                result.errors.forEach((err) => {
                    console.error(chalk_1.default.red.dim("Error: " + err));
                });
            result.warnings &&
                result.warnings.forEach((warn) => {
                    console.error(chalk_1.default.red.dim("Warning: " + warn));
                });
            process.exit(1);
        }
    }
    if (fs_extra_1.default.existsSync(targetDir)) {
        if (options.force) {
            await fs_extra_1.default.remove(targetDir);
        }
        else {
            // await clearConsole()
            if (inCurrent) {
                const { ok } = await inquirer_1.default.prompt([
                    {
                        name: "ok",
                        type: "confirm",
                        message: `创建项目到当前文件夹?`,
                    },
                ]);
                if (!ok) {
                    return;
                }
            }
            else {
                const { action } = await inquirer_1.default.prompt([
                    {
                        name: "action",
                        type: "list",
                        message: `目录 ${chalk_1.default.cyan(targetDir)} 已有. 请选择一种方式:`,
                        choices: [
                            { name: "覆盖", value: "overwrite" },
                            { name: "合并", value: "merge" },
                            { name: "退出", value: false },
                        ],
                    },
                ]);
                if (!action) {
                    return;
                }
                else if (action === "overwrite") {
                    console.log(`\nRemoving ${chalk_1.default.cyan(targetDir)}...`);
                    await fs_extra_1.default.remove(targetDir);
                }
            }
        }
    }
    return targetDir;
}
