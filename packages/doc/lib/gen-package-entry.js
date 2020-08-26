"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genPackageEntry = exports.getPackageJson = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const common_1 = require("./common");
function genImports(components, options) {
    return components
        .map((name) => {
        let path = path_1.join(common_1.SRC_DIR, name);
        if (options && options.pathResolver) {
            path = options.pathResolver(path);
        }
        return `import ${common_1.pascalize(name)} from '${common_1.normalizePath(path)}';`;
    })
        .join("\n");
}
function genExports(names) {
    return names.map((name) => `${name}`).join(",\n  ");
}
function getPackageJson() {
    delete require.cache[common_1.PACKAGE_JSON_FILE];
    return require(common_1.PACKAGE_JSON_FILE);
}
exports.getPackageJson = getPackageJson;
function genPackageEntry(options) {
    const names = common_1.getComponents();
    // const vantConfig = getVantConfig();
    const docConfig = require(common_1.DOC_CONFIG_DIR);
    // const skipInstall = get(vantConfig, 'build.skipInstall', []).map(pascalize);
    const version = process.env.PACKAGE_VERSION || getPackageJson().version;
    const components = names.map(common_1.pascalize);
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
    fs_extra_1.outputFileSync(options.outputPath, content);
}
exports.genPackageEntry = genPackageEntry;
