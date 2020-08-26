"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const execa_1 = __importDefault(require("execa"));
function executeCommand(command, args, targetDir) {
    return new Promise((resolve, reject) => {
        const apiMode = process.env.VUE_CLI_API_MODE;
        if (apiMode) {
            if (command === 'npm') {
                // TODO when this is supported
            }
            else if (command === 'yarn') {
                args.push('--json');
            }
        }
        const child = execa_1.default(command, args, {
            cwd: targetDir,
            stdio: ['inherit', apiMode ? 'pipe' : 'inherit', !apiMode && command === 'yarn' ? 'pipe' : 'inherit']
        });
        child.on('close', code => {
            if (code !== 0) {
                reject(`command failed: ${command} ${args.join(' ')}`);
                return;
            }
            resolve();
        });
    });
}
exports.default = executeCommand;
