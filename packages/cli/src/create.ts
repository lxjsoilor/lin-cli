import path from "path";
import inquirer from "inquirer";
import fs from "fs-extra";
import validateProjectName from "validate-npm-package-name";
import chalk from "chalk";
import { Creator } from "./creator";
// import admin from './promptModules/admin'

const arr = [
	"babel",
	"typescript",
	// 'pwa',
	"router",
	"vuex",
	"admin",
	"table",
	// 'cssPreprocessors',
	// 'linter',
	// 'unit',
	// 'e2e'
].map((file) => require(`./promptModules/${file}`).default);

/**
 * 创建本地项目
 * @param name
 * @param options
 */
export async function create(name: string, options: any) {
	const targetDir = await validateNewProjectName(name, options);
	const creator = new Creator(name, targetDir as string, arr);
	creator.create(options);
}

/**
 * 验证新的项目名称是否可用
 * @param name
 */
async function validateNewProjectName(name: string, options: any) {
	// 获取当前的工作目录
	const cwd = options.cwd || process.cwd();
	const inCurrent = name === ".";
	const projectName = inCurrent ? path.relative("../", cwd) : name;
	const targetDir = path.resolve(cwd, projectName || ".");
	const result = validateProjectName(name);
	if (!result.validForNewPackages) {
		if (!result.validForNewPackages) {
			console.error(chalk.red.dim(`Invalid project name: "${name}"`));
			result.errors &&
				result.errors.forEach((err) => {
					console.error(chalk.red.dim("Error: " + err));
				});
			result.warnings &&
				result.warnings.forEach((warn) => {
					console.error(chalk.red.dim("Warning: " + warn));
				});
			process.exit(1);
		}
	}
	if (fs.existsSync(targetDir)) {
		if (options.force) {
			await fs.remove(targetDir);
		} else {
			// await clearConsole()
			if (inCurrent) {
				const { ok } = await inquirer.prompt([
					{
						name: "ok",
						type: "confirm",
						message: `创建项目到当前文件夹?`,
					},
				]);
				if (!ok) {
					return;
				}
			} else {
				const { action } = await inquirer.prompt([
					{
						name: "action",
						type: "list",
						message: `目录 ${chalk.cyan(targetDir)} 已有. 请选择一种方式:`,
						choices: [
							{ name: "覆盖", value: "overwrite" },
							{ name: "合并", value: "merge" },
							{ name: "退出", value: false },
						],
					},
				]);
				if (!action) {
					return;
				} else if (action === "overwrite") {
					console.log(`\nRemoving ${chalk.cyan(targetDir)}...`);
					await fs.remove(targetDir);
				}
			}
		}
	}
	return targetDir;
}
