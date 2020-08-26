import Vue from "vue";
const modulesFiles = require.context(".", true, /\.ts|.js$/);
const modules = modulesFiles
	.keys()
	.filter((item) => item !== "./index.ts")
	.reduce((modules: any, modulePath) => {
		const moduleName: string = modulePath.replace(/^\.\/(.*)\.\w+$/, "$1").split("/")[0];
		const value = modulesFiles(modulePath);
		modules[moduleName] = value.default;
		return modules;
	}, {});
Object.keys(modules).forEach((key) => {
	Vue.directive(key, modules[key]);
});
