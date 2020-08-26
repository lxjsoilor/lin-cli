"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smartOutputFile = exports.genSiteShared = void 0;
const path_1 = require("path");
const glob_1 = __importDefault(require("glob"));
const fs_extra_1 = require("fs-extra");
const common_1 = require("./common");
/**
 * i18n mode:
 *   - action-sheet/README.md       => ActionSheet_EnUS
 *   - action-sheet/README.zh-CN.md => ActionSheet_ZhCN
 *
 * default mode:
 *   - action-sheet/README.md => ActionSheet
 * @param components
 */
function resovleDocuments(components) {
    const docConfig = common_1.getDocConfig();
    const { locales, defaultLang } = docConfig;
    const docs = [];
    if (locales) {
        const langs = Object.keys(locales);
        langs.forEach((lang) => {
            const fileName = lang === defaultLang ? "README.md" : `README.${lang}.md`;
            components.forEach((component) => {
                docs.push({
                    name: common_1.formatName(component, lang),
                    path: path_1.join(common_1.SRC_DIR, component, fileName),
                });
            });
        });
    }
    else {
        components.forEach((component) => {
            docs.push({
                name: common_1.formatName(component),
                path: path_1.join(common_1.SRC_DIR, component, "README.md"),
            });
        });
    }
    // 获取静态资源 md
    const staticDocs = glob_1.default.sync(path_1.join(common_1.DOCS_DIR, "**/*.md"), { dot: true }).map((path) => {
        const pairs = path_1.parse(path).name.split(".");
        return {
            name: common_1.formatName(pairs[0], pairs[1] || defaultLang),
            path,
        };
    });
    return [...staticDocs, ...docs.filter((item) => fs_extra_1.existsSync(item.path))];
}
function genImportDocuments(items) {
    return items
        .map(item => `import ${item.name} from '${common_1.normalizePath(item.path)}';`)
        .join('\n');
}
function genExportDocuments(items) {
    return `export const documents = {
        ${items.map(item => item.name).join(',\n  ')}
    };`;
}
function genImportConfig() {
    return `import config from '${common_1.removeExt(common_1.normalizePath(common_1.DOC_CONFIG_DIR))}';`;
}
function genExportConfig() {
    return 'export { config };';
}
function genInstall() {
    return `import Vue from 'vue';
			  import '${common_1.normalizePath(path_1.join(common_1.DOCS_DIR, 'index.js'))}';
		  	import PackageEntry from './package-entry';
          // import './package-style';
  `;
}
//   function genExportVersion() {
//     return `export const packageVersion = '${getPackageJson().version}';`;
//   }
function genSiteShared() {
    const dirs = fs_extra_1.readdirSync(common_1.SRC_DIR);
    const documents = resovleDocuments(dirs);
    const code = `
            ${genInstall()}
            Vue.use(PackageEntry);
            ${genImportConfig()}
            ${genImportDocuments(documents)}
            ${genExportConfig()}
            ${genExportDocuments(documents)}
        `; // ${genExportVersion()}
    smartOutputFile(path_1.join(__dirname, '../dist/site-shared.js'), code);
}
exports.genSiteShared = genSiteShared;
function smartOutputFile(filePath, content) {
    if (fs_extra_1.existsSync(filePath)) {
        const previousContent = fs_extra_1.readFileSync(filePath, 'utf-8');
        if (previousContent === content) {
            return;
        }
    }
    fs_extra_1.outputFileSync(filePath, content);
}
exports.smartOutputFile = smartOutputFile;
