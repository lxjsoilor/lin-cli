import path from 'path'
import typescript from 'rollup-plugin-typescript2'
import isBuiltinModule from 'is-builtin-module'
import uglify from "rollup-plugin-uglify";
function resolveInput(projectDir) {
  return path.resolve('packages', `${projectDir}/src/index.ts`)
}

function resolveOutput(projectDir) {
  return path.resolve('packages', `${projectDir}/lib/index.js`)
}

const PKG_DIR = process.env.PKG_DIR
const pkgMeta = require(path.resolve(`packages`, `${PKG_DIR}/package.json`))

export default {
  input: resolveInput(PKG_DIR),
  banner: '/* my-library version ' + pkgMeta.version + ' */',
  external(id) {
    return (
      (pkgMeta.dependencies && !!pkgMeta.dependencies[id]) ||
      id === 'prismjs/components' ||
      id === 'vue-template-compiler/build'
    )
  },
  plugins: [
    typescript({
      cacheRoot: path.resolve(__dirname, 'node_modules/.rts2_cache')
    }),
    // uglify.uglify(),
  ],
  output: {
    file: resolveOutput(PKG_DIR),
    format: 'cjs',
    exports: 'named',
    minify: true
  },
  onwarn(warning, warn) {
    if (warning.code === 'UNRESOLVED_IMPORT' && isBuiltinModule(warning.source))
      return
    warn(warning)
  }
}
