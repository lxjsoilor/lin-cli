import { join, parse } from "path";
import {
	existsSync,
	readdirSync,
	readFileSync,
	outputFileSync
} from 'fs-extra';
// 命令行当前的 路径
export const CWD = process.cwd()
export const LIB_DIR = join(CWD, 'lib');
// src 的相对路径
export const SRC_DIR = join(CWD, 'src');
// 静态文档的相对路径
export const DOCS_DIR = join(CWD, 'docs');
// dist
export const DIST_DIR = join(CWD, 'dist');
// 配置文件的路径
export const DOC_CONFIG_DIR = join(CWD, "doc.config.js");

export const ENTRY_EXTS = ['js', 'ts', 'tsx', 'jsx', 'vue'];

export const PACKAGE_JSON_FILE = join(CWD, 'package.json');
// 
export const PACKAGE_ENTRY = join(__dirname, '../dist/package-entry.js');

const camelizeRE = /-(\w)/g;
const pascalizeRE = /(\w)(\w*)/g;
/**
 * 转为驼峰格式
 * @param str 
 */
export function camelize(str: string): string {
    return str.replace(camelizeRE, (_, c) => c.toUpperCase());
}

export function pascalize(str: string): string {
    return camelize(str).replace(
        pascalizeRE,
        (_, c1, c2) => c1.toUpperCase() + c2
    );
}

export function formatName(component: string, lang?: string) {
    component = pascalize(component);
    if (lang) {
        return `${component}_${lang.replace('-', '_')}`;
    }

    return component;
}

export function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

export function removeExt(path: string) {
	return path.replace('.js', '');
}

export function hasDefaultExport(code: string) {
	return code.includes('export default') || code.includes('export { default }');
}

/**
 * 获取 doc 配置文件
 */
export function getDocConfig() {
    return require(DOC_CONFIG_DIR)
}
/**
 * 获取组件
 */
export function getComponents() {
	const EXCLUDES = ['.DS_Store'];
	const dirs = readdirSync(SRC_DIR);
	return dirs
		.filter(dir => !EXCLUDES.includes(dir))
		.filter(dir =>
			ENTRY_EXTS.some(ext => {
				const path = join(SRC_DIR, dir, `index.${ext}`);
				if (existsSync(path)) {
					return hasDefaultExport(readFileSync(path, 'utf-8'));
				}
				return false;
			})
		);
}