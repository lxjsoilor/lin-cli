"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const os_1 = __importDefault(require("os"));
/**
 * 获取 .hcrc 文件  win C:\Users\用户\.hcrc
 * @param file
 */
exports.getRcPath = (file) => {
    migrateWindowsConfigPath(file);
    return (process.env.VUE_CLI_CONFIG_PATH ||
        xdgConfigPath(file) ||
        path_1.default.join(os_1.default.homedir(), file));
};
const migrateWindowsConfigPath = (file) => {
    if (process.platform !== 'win32') {
        return;
    }
    const appData = process.env.APPDATA;
    if (appData) {
        const rcDir = path_1.default.join(appData, 'hc');
        const rcFile = path_1.default.join(rcDir, file);
        const properRcFile = path_1.default.join(os_1.default.homedir(), file);
        if (fs_extra_1.default.existsSync(rcFile)) {
            try {
                if (fs_extra_1.default.existsSync(properRcFile)) {
                    fs_extra_1.default.removeSync(rcFile);
                }
                else {
                    fs_extra_1.default.moveSync(rcFile, properRcFile);
                }
            }
            catch (e) { }
        }
    }
};
const xdgConfigPath = (file) => {
    const xdgConfigHome = process.env.XDG_CONFIG_HOME;
    if (xdgConfigHome) {
        const rcDir = path_1.default.join(xdgConfigHome, 'hc');
        if (!fs_extra_1.default.existsSync(rcDir)) {
            fs_extra_1.default.ensureDirSync(rcDir, 0o700);
        }
        return path_1.default.join(rcDir, file);
    }
};
