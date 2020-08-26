import Vue from "vue";
import VueRouter from "vue-router";
import { config, documents } from "site-shared";
Vue.use(VueRouter);
const { locales, defaultLang } = config.site;
export const routerMaps = {};

export function decamelize(str, sep = "-") {
	return str
		.replace(/([a-z\d])([A-Z])/g, "$1" + sep + "$2")
		.replace(/([A-Z]+)([A-Z][a-z\d]+)/g, "$1" + sep + "$2")
		.toLowerCase();
}

function parseName(name) {
	if (name.indexOf("_") !== -1) {
		const pairs = name.split("_");
		const component = pairs.shift();

		return {
			component: `${decamelize(component)}`,
			lang: pairs.join("-"),
		};
	}

	return {
		component: `${decamelize(name)}`,
		lang: "",
	};
}

function getLangFromRoute(route) {
	const lang = route.path.split("/")[1];
	const langs = Object.keys(locales);

	if (langs.indexOf(lang) !== -1) {
		return lang;
	}

	return "zh-CN";
}
const getRoutes = () => {
	const routes = [];
	const names = Object.keys(documents);
	if (locales) {
		routes.push({
			path: "*",
			redirect: (route) => `/${getLangFromRoute(route)}/`,
		});
	} else {
		routes.push({
			path: "*",
			redirect: "/",
		});
	}

	function addHomeRoute(Home, lang) {
		routes.push({
			name: lang,
			path: `/${lang || ""}`,
			component: Home,
			meta: { lang },
		});
	}

	names.forEach((name) => {
		const { component, lang } = parseName(name);

		if (component === "home") {
			addHomeRoute(documents[name], lang);
		}

		if (lang) {
			routes.push({
				name: `${lang}/${component}`,
				path: `/${lang}/${component}`,
				component: documents[name],
				meta: {
					lang,
					name: component,
				},
			});
		} else {
			routes.push({
				name: `${component}`,
				path: `/${component}`,
				component: documents[name],
				meta: {
					name: component,
				},
			});
		}
	});

	return routes;
};

const router = new VueRouter({
	routes: getRoutes(),
});

export default router;
