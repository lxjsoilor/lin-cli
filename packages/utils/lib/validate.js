"use strict";
/**
 * 验证
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNull = exports.isNumber = void 0;
/**
 * 是否是小数
 * @param num
 * @param type
 */
exports.isNumber = (num) => {
    return String(num).includes(".");
};
/**
 * 验证一个值是否为空
 * @param val
 */
exports.isNull = (val) => {
    if (typeof val == "boolean") {
        return false;
    }
    if (typeof val == "number") {
        return false;
    }
    if (val instanceof Array) {
        if (val.length == 0)
            return true;
    }
    else if (val instanceof Object) {
        if (JSON.stringify(val) === "{}")
            return true;
    }
    else {
        if (val == "null" || val == null || val == "undefined" || val == undefined || val == "")
            return true;
        return false;
    }
    return false;
};
