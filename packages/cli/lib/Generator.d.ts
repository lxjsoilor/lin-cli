/**
 * 配置
 */
declare type GeneratorPluginType = {
    pkg?: object;
    plugins?: any;
    afterInvokeCbs?: Array<Function>;
    afterAnyInvokeCbs?: Array<Function>;
    files?: Object;
    invoking?: boolean;
};
/**
 *
 */
declare type OptionType = {
    extractConfigFiles?: boolean;
    checkExisting?: boolean;
};
/**
 * 插件生成器
 */
export default class Generator {
    context: string;
    plugins: GeneratorPluginType;
    rootOptions: {
        [key: string]: any;
    };
    pkg?: object;
    fileMiddlewares: Array<any>;
    files?: any;
    imports: {
        [key: string]: any;
    };
    otherCode: {
        [key: string]: any;
    };
    postProcessFilesCbs: Array<any>;
    constructor(context: string, plugins: GeneratorPluginType);
    generate(opt: OptionType): Promise<void>;
    /**
     * 初始化配置
     */
    initPlugins(): Promise<void>;
    /**
     *
     */
    resolveFiles(): Promise<void>;
    /**
     * 判断是否有plugin 为 id 的配置
     * @param id
     * @param version
     */
    hasPlugin(id: String, version: String): boolean;
}
export {};
