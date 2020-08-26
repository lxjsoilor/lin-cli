import { Config } from "@tiger/service";
import path from "path";
// @ts-ignore
// import DocSearchPlugin from "@tiger/doc-search";

export default (api: Config, options: any) => {
	api.mode("development").entry("app").clear().add(path.join(__dirname, "../../site/desktop/main.js")).end();

	api.module
		.rule("md")
		.test(/\.md$/)
		.use("vue-loader")
		.loader(require.resolve("vue-loader"))
		.end()
		.use("md-loader")
		.loader(require.resolve("@tiger/md-loader"))
		.options({
			name: "[name]",
		})
		.end();
	// .use('doc-search')
	//     .loader(require.resolve('@tiger/doc-search'))

	// api.plugin("md-loader").use(DocSearchPlugin).end();

	api.resolve.alias.set("site-shared", path.join(__dirname, "../../dist/site-shared.js"));

	// api.resolve
	//     .extensions
	//     .prepend('.ts')
	//     .prepend('.tsx')
};
