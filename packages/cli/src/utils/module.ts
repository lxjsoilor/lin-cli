// const Module = require('module')
import Module from 'module';
import path from 'path'
export const createRequire = Module.createRequire || Module.createRequireFromPath || function (filename:string) {
    const mod = new Module(filename, undefined)
    mod.filename = filename
    mod.paths = Module._nodeModulePaths(path.dirname(filename))
  
    mod._compile(`module.exports = require;`, filename)
  
    return mod.exports
}