module.exports = (api, options = {}) => {
	api.injectImports(api.entryFile, `import VForm from '@tiger/form';`);
	api.injectImports(api.entryFile, `import ElementUI from 'element-ui';`);
	api.injectImports(api.entryFile, `import API from '@vue/composition-api';`);
	api.injectImports(api.entryFile, `import Component from 'vue-class-component';`);
	api.injectImports(api.entryFile, `import 'element-ui/lib/theme-chalk/index.css';`);
	api.injectImports(api.entryFile, `import { Icon, Icons } from '@/components/Icons';`);
	api.injectImports(api.entryFile, `import '@/assets/icons/ionicons.less';`);
	api.injectImports(api.entryFile, `import '@/directives';`);
	api.injectImports(api.entryFile, `import '@/filters';`);

	api.injectOthers(api.entryFile, `Vue.use(API);`);
	api.injectOthers(api.entryFile, `Vue.use(VForm);`);
	api.injectOthers(api.entryFile, `Vue.use(ElementUI, {size: 'small'});`);
	api.injectOthers(api.entryFile, `Component.registerHooks(['setup', 'beforeRouteUpdate', 'beforeRouteEnter', 'beforeRouteLeave']);`);
	api.injectOthers(api.entryFile, `Vue.component('Icon', Icon);`);
	api.injectOthers(api.entryFile, `Vue.component('Icons', Icons);`);

	api.extendPackage({
		dependencies: {
			"@tiger/form": "^1.0.4-bate.28",
			"@vue/composition-api": "^0.6.1",
			"element-ui": "^2.13.2",
			axios: "^0.19.2",
			"js-cookie": "^2.2.1",
			nprogress: "^0.2.0",
			qs: "^6.9.4",
			screenfull: "^5.0.2",
			"vue-class-component": "^7.2.3",
			"vue-property-decorator": "^8.4.2",
			less: "^3.0.4",
			"less-loader": "^5.0.0",
		},
		devDependencies: {
			"@types/qs": "^6.9.3",
			"@types/js-cookie": "^2.2.6",
			"@types/nprogress": "^0.2.0",
			"@types/screenfull": "^4.1.0",
		},
	});
	api.render("./template");
};
