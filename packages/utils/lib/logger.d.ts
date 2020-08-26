/// <reference types="node" />
import { EventEmitter } from 'events';
export declare const events: EventEmitter;
/**
 * 默认提示
 * @param msg
 * @param tag
 */
export declare const log: (msg?: string, tag?: any) => void;
/**
 * 信息提示
 * @param msg
 * @param tag
 */
export declare const info: (msg: string, tag?: any) => void;
/**
 * 完成提示
 * @param msg
 * @param tag
 */
export declare const done: (msg: string, tag?: any) => void;
/**
 * 警告提示
 * @param msg
 * @param tag
 */
export declare const warn: (msg: string, tag?: any) => void;
/**
 * error 提示
 * @param msg
 * @param tag
 */
export declare const error: (msg: any, tag?: any) => void;
export declare const logServerInfo: (port: number) => void;
