"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const rcPath_1 = require("./rcPath");
const rcPath = exports.rcPath = rcPath_1.getRcPath('.hcrc');
let cachedOptions;
/**
 * 加载配置
 */
exports.loadOptions = () => {
    if (cachedOptions) {
        return cachedOptions;
    }
    if (fs_extra_1.default.existsSync(rcPath)) {
        try {
            cachedOptions = JSON.parse(fs_extra_1.default.readFileSync(rcPath, 'utf-8'));
        }
        catch (e) {
            console.log(e.message);
        }
        return cachedOptions;
    }
    else {
        return {};
    }
};
/**
 * 保存配置
 * @param toSave
 */
exports.saveOptions = (toSave) => {
    const options = Object.assign({}, toSave);
    for (const key in options) {
        // if(!(key in defaults)){
        // }
    }
    try {
        fs_extra_1.default.writeFileSync(rcPath, JSON.stringify(options, null, 2));
    }
    catch (err) {
        console.error(err.message);
    }
};
/**
 * 保存预设
 * @param name
 * @param preset
 */
exports.savePreset = (name, preset) => {
    const presets = exports.loadOptions().presets || {};
    presets[name] = preset;
    exports.saveOptions({ presets });
};
