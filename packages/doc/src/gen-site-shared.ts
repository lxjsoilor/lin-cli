import { join, parse } from "path";
import glob from 'glob';
import { existsSync, readdirSync, readFileSync, outputFileSync } from 'fs-extra';
import { SRC_DIR, DOCS_DIR, DOC_CONFIG_DIR, formatName, normalizePath, removeExt, getDocConfig } from './common';

type DocumentItem = {
	name: string;
	path: string;
};
/**
 * i18n mode:
 *   - action-sheet/README.md       => ActionSheet_EnUS
 *   - action-sheet/README.zh-CN.md => ActionSheet_ZhCN
 *
 * default mode:
 *   - action-sheet/README.md => ActionSheet
 * @param components
 */
function resovleDocuments(components: string[]): DocumentItem[] {
	const docConfig = getDocConfig();
	const { locales, defaultLang } = docConfig;
	const docs: DocumentItem[] = [];
	if (locales) {
		const langs = Object.keys(locales);
		langs.forEach((lang) => {
			const fileName = lang === defaultLang ? "README.md" : `README.${lang}.md`;
			components.forEach((component) => {
				docs.push({
					name: formatName(component, lang),
					path: join(SRC_DIR, component, fileName),
				});
			});
		});
	} else {
		components.forEach((component) => {
			docs.push({
				name: formatName(component),
				path: join(SRC_DIR, component, "README.md"),
			});
		});
	}
	// 获取静态资源 md
	const staticDocs = glob.sync(join(DOCS_DIR, "**/*.md"), { dot: true }).map((path) => {
		const pairs = parse(path).name.split(".");
		return {
			name: formatName(pairs[0], pairs[1] || defaultLang),
			path,
		};
	});
	return [...staticDocs, ...docs.filter((item) => existsSync(item.path))];
}

function genImportDocuments(items: DocumentItem[]) {
	return items
		.map(item => `import ${item.name} from '${normalizePath(item.path)}';`)
		.join('\n');
}

function genExportDocuments(items: DocumentItem[]) {
	return `export const documents = {
        ${items.map(item => item.name).join(',\n  ')}
    };`;
}

function genImportConfig() {
	return `import config from '${removeExt(normalizePath(DOC_CONFIG_DIR))}';`;
}

function genExportConfig() {
	return 'export { config };';
}

function genInstall() {
	return `import Vue from 'vue';
			  import '${ normalizePath(join(DOCS_DIR, 'index.js')) }';
		  	import PackageEntry from './package-entry';
          // import './package-style';
  `;
}
//   function genExportVersion() {
//     return `export const packageVersion = '${getPackageJson().version}';`;
//   }

export function genSiteShared() {
	const dirs = readdirSync(SRC_DIR);
	const documents = resovleDocuments(dirs);

	const code = `
            ${genInstall()}
            Vue.use(PackageEntry);
            ${genImportConfig()}
            ${genImportDocuments(documents)}
            ${genExportConfig()}
            ${genExportDocuments(documents)}
        `; // ${genExportVersion()}
	smartOutputFile(join(__dirname, '../dist/site-shared.js'), code);
}

export function smartOutputFile(filePath: string, content: string) {
	if (existsSync(filePath)) {
		const previousContent = readFileSync(filePath, 'utf-8');

		if (previousContent === content) {
			return;
		}
	}

	outputFileSync(filePath, content);
}