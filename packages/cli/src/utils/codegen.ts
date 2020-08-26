import JsCodeShift, { API } from "jscodeshift";
// @ts-ignore
import adapt from "vue-jscodeshift-adapter";

/**
 * 修改文件代码
 * @param module
 * @param fileInfo
 * @param options
 */
export default function CodeGen(module: any, fileInfo: any, options: { [key: string]: any } = {}) {
	const transform = typeof module.default === "function" ? module.default : module;
	let parser = module.parser || options.parser;
	if (!parser) {
		if (fileInfo.path.endsWith(".ts")) {
			parser = "ts";
		} else if (fileInfo.path.endsWith(".tsx")) {
			parser = "tsx";
		}
	}
	let jscodeshift = JsCodeShift;
	if (parser) {
		jscodeshift = JsCodeShift.withParser(parser);
	}

	const api: API = {
		jscodeshift,
		j: jscodeshift,
		stats: () => {},
		report: () => {},
	};

	return adapt(transform)(fileInfo, api, options);
}
