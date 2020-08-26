import { outputFileSync } from "fs-extra";
import { join } from "path";

import { SRC_DIR, DOC_CONFIG_DIR, ENTRY_EXTS, PACKAGE_JSON_FILE, pascalize, normalizePath, getComponents } from "./common";

type Options = {
	outputPath: string;
	pathResolver?: Function;
};

function genImports(components: string[], options: Options): string {
	return components
		.map((name) => {
			let path = join(SRC_DIR, name);
			if (options && options.pathResolver) {
				path = options.pathResolver(path);
			}
			return `import ${pascalize(name)} from '${normalizePath(path)}';`;
		})
		.join("\n");
}

function genExports(names: string[]): string {
	return names.map((name) => `${name}`).join(",\n  ");
}

export function getPackageJson() {
	delete require.cache[PACKAGE_JSON_FILE];
	return require(PACKAGE_JSON_FILE);
}

export function genPackageEntry(options: Options) {
	const names = getComponents();
	// const vantConfig = getVantConfig();
	const docConfig = require(DOC_CONFIG_DIR);
	// const skipInstall = get(vantConfig, 'build.skipInstall', []).map(pascalize);
	const version = process.env.PACKAGE_VERSION || getPackageJson().version;
	const components = names.map(pascalize);
	const content = `
        ${genImports(names, options)}
  
        const version = '${version}';
        function install(Vue) {
            const components = [
				// !skipInstall.includes(item)
				${components.filter((item) => item).join(",\n    ")}
            ];
        
            components.forEach(item => {
                if (item.install) {
                    Vue.use(item);
                } else if (item.name) {
                    Vue.component(item.name, item);
                }
            });
        }
        
        if (typeof window !== 'undefined' && window.Vue) {
            install(window.Vue);
        }
        
        export {
            install,
            version,
            ${genExports(components)}
        };
        
        export default {
            install,
            version
        };
  `;

	outputFileSync(options.outputPath, content);
}
