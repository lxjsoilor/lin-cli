"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
/**
 * 创建文件
 * @param dir
 * @param files
 */
exports.writeFlieTree = (dir, files) => {
    Object.keys(files).forEach((key) => {
        const filePath = path_1.default.join(dir, key);
        // 确保目录的存在。如果目录结构不存在,就创建一个。
        fs_extra_1.default.ensureDirSync(path_1.default.dirname(filePath));
        // 创建文件
        fs_extra_1.default.writeFileSync(filePath, files[key]);
    });
};
