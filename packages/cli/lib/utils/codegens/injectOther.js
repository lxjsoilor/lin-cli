"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function injectOther(fileInfo, api, options) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    const declarations = root.find(j.ImportDeclaration);
    const toOtherAST = (i) => j(`${i}\n`).nodes()[0].program.body[0];
    const otherASTNodes = options.injecOthers.map(toOtherAST);
    if (declarations.length) {
        declarations
            .at(-1)
            // a tricky way to avoid blank line after the previous import
            .forEach(({ node }) => delete node.loc)
            .insertAfter(otherASTNodes);
    }
    else {
        // no pre-existing import declarations
        root.get().node.program.body.unshift(...otherASTNodes);
    }
    return root.toSource();
}
exports.default = injectOther;
