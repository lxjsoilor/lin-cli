/// <reference types="node" />
import { EventEmitter } from "events";
/**
 * 创建者
 */
export declare class Creator extends EventEmitter {
    /**
     * 项目名称
     */
    name?: string;
    /**
     * 目录地址
     */
    context: string;
    featurePrompt?: any;
    presetPrompt?: any;
    /**
     * prompt 结尾
     */
    outroPrompts?: any;
    injectedPrompts?: any;
    promptCompleteCbs: Array<Function>;
    constructor(name: string, context: string, promptModules: Array<Function>);
    /**
     *
     * @param options
     */
    create(options: any): Promise<void>;
    pluginsToArray(rawPlugins: {
        [key: string]: any;
    }): Promise<any[]>;
    /**
     * 排序对象
     * @param obj
     * @param keyOrder
     * @param dontSortByUnicode
     */
    sortObject(obj: any, keyOrder: any, dontSortByUnicode: any): {
        [key: string]: any;
    } | undefined;
    /**
     * 加载本地预设
     * @param name
     */
    resolvePreset(name: string): Promise<any>;
    /**
     * 选中预设
     * @param answers
     */
    promptAndResolvePreset(answers?: any): Promise<any>;
    /**
     * 获取本地配置
     */
    getPresets(): any;
    /**
     * 介绍提示
     */
    resolveIntroPrompts(): {
        presetPrompt: {
            name: string;
            type: string;
            message: string;
            choices: {
                name: string;
                value: string;
            }[];
        };
        featurePrompt: {
            name: string;
            when: (answers: any) => boolean;
            type: string;
            message: string;
            choices: never[];
            pageSize: number;
        };
    };
    /**
     * 结尾部分提示
     */
    resolveOutroPrompts(): ({
        name: string;
        when: (answers: any) => boolean;
        type: string;
        message: string;
        choices: {
            name: string;
            value: string;
        }[];
        default?: undefined;
    } | {
        name: string;
        when: (answers: any) => boolean;
        type: string;
        message: string;
        default: boolean;
        choices?: undefined;
    } | {
        name: string;
        when: (answers: any) => any;
        type: string;
        message: string;
        choices?: undefined;
        default?: undefined;
    })[];
    /**
     * 最终提示
     */
    resolveFinalPrompts(): any[];
}
