export declare const CWD: string;
export declare const LIB_DIR: string;
export declare const SRC_DIR: string;
export declare const DOCS_DIR: string;
export declare const DIST_DIR: string;
export declare const DOC_CONFIG_DIR: string;
export declare const ENTRY_EXTS: string[];
export declare const PACKAGE_JSON_FILE: string;
export declare const PACKAGE_ENTRY: string;
/**
 * 转为驼峰格式
 * @param str
 */
export declare function camelize(str: string): string;
export declare function pascalize(str: string): string;
export declare function formatName(component: string, lang?: string): string;
export declare function normalizePath(path: string): string;
export declare function removeExt(path: string): string;
export declare function hasDefaultExport(code: string): boolean;
/**
 * 获取 doc 配置文件
 */
export declare function getDocConfig(): any;
/**
 * 获取组件
 */
export declare function getComponents(): string[];
