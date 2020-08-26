import { API } from "jscodeshift";

export default function injectImports(fileInfo: any, api: API, options: { [key: string]: any }) {
	const j = api.jscodeshift;
	const root = j(fileInfo.source);

	const toImportAST = (i: string) => j(`${i}\n`).nodes()[0].program.body[0];
	const toImportHash = (node: { [key: string]: any }) =>
		JSON.stringify({
			specifiers: node.specifiers.map((s: { [key: string]: any }) => s.local.name),
			source: node.source.raw,
		});

	const declarations = root.find(j.ImportDeclaration);
	const importSet = new Set(declarations.nodes().map(toImportHash));
	const nonDuplicates = (node: { [key: string]: any }) => !importSet.has(toImportHash(node));

	const importASTNodes = options.imports.map(toImportAST).filter(nonDuplicates);

	if (declarations.length) {
		declarations
			.at(-1)
			// a tricky way to avoid blank line after the previous import
			.forEach(({ node }) => delete node.loc)
			.insertAfter(importASTNodes);
	} else {
		// no pre-existing import declarations
		root.get().node.program.body.unshift(...importASTNodes);
	}

	return root.toSource();
}
