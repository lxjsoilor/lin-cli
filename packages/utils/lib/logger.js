"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logServerInfo = exports.error = exports.warn = exports.done = exports.info = exports.log = exports.events = void 0;
const chalk_1 = __importDefault(require("chalk"));
const strip_ansi_1 = __importDefault(require("strip-ansi"));
const events_1 = require("events");
exports.events = new events_1.EventEmitter();
const address_1 = __importDefault(require("address"));
/**
 *
 * @param type
 * @param tag
 * @param message
 */
const _log = (type, tag, message) => {
    if (message) {
        exports.events.emit('log', {
            message,
            type,
            tag
        });
    }
};
/**
 *
 * @param label
 * @param msg
 */
const format = (label, msg) => {
    return msg.split('\n').map((line, i) => {
        return i === 0 ? `${label} ${line}` : line.padStart(strip_ansi_1.default(label).length);
    }).join('\n');
};
/**
 *
 * @param msg
 */
const chalkTag = (msg) => chalk_1.default.bgBlackBright.white.dim(` ${msg}`);
/**
 * 默认提示
 * @param msg
 * @param tag
 */
exports.log = (msg = '', tag = null) => {
    tag ? console.log(format(chalkTag(tag), msg)) : console.log(msg);
    _log('log', tag, msg);
};
/**
 * 信息提示
 * @param msg
 * @param tag
 */
exports.info = (msg, tag = null) => {
    console.log(format(chalk_1.default.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('info', tag, msg);
};
/**
 * 完成提示
 * @param msg
 * @param tag
 */
exports.done = (msg, tag = null) => {
    console.log(format(chalk_1.default.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg));
    _log('done', tag, msg);
};
/**
 * 警告提示
 * @param msg
 * @param tag
 */
exports.warn = (msg, tag = null) => {
    console.warn(format(chalk_1.default.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), msg));
    _log('warn', tag, msg);
};
/**
 * error 提示
 * @param msg
 * @param tag
 */
exports.error = (msg, tag = null) => {
    console.log(format(chalk_1.default.bgRed.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg));
    _log('error', tag, msg);
    if (msg instanceof Error) {
        console.error(msg.stack);
        // _log('error', tag, msg.stack)
    }
};
exports.logServerInfo = (port) => {
    const local = `http://localhost:${port}/`;
    const network = `http://${address_1.default.ip()}:${port}/`;
    const GREEN = '#07c160';
    console.log('\n  Site running at:\n');
    console.log(`  ${chalk_1.default.bold('Local')}:    ${chalk_1.default.hex(GREEN)(local)} `);
    console.log(`  ${chalk_1.default.bold('Network')}:  ${chalk_1.default.hex(GREEN)(network)}`);
};
