import { API } from "jscodeshift";

export default function injectImports(fileInfo: any, api: API, options: { [key: string]: any }) {
	const j = api.jscodeshift;
	const root = j(fileInfo.source);

	const toPropertyAST = (i: string) => {
		return j(`({${i}})`).nodes()[0].program.body[0].expression.properties[0];
	};

	const properties = root
		.find(j.NewExpression, {
			callee: { name: "Vue" },
			arguments: [{ type: "ObjectExpression" }],
		})
		.map((path) => path.get("arguments", 0))
		.get().node.properties;

	const toPropertyHash = (p: { [key: string]: any }) => `${p.key.name}: ${j(p.value).toSource()}`;
	const propertySet = new Set(properties.map(toPropertyHash));
	const nonDuplicates = (p: { [key: string]: any }) => !propertySet.has(toPropertyHash(p));

	// inject at index length - 1 as it's usually the render fn
	properties.splice(-1, 0, ...options.injections.map(toPropertyAST).filter(nonDuplicates));

	return root.toSource();
}
