export default class PromptModuleAPI {
    creator?: any;
    constructor(creator: any);
    /**
     * 注入特征
     * @param feature
     */
    injectFeature(feature: any): void;
    /**
     * 注入提示
     * @param prompt
     */
    injectPrompt(prompt: any): void;
    /**
     * 为提示注入选项
     * @param name
     * @param option
     */
    injectOptionForPrompt(name: string, option: any): void;
    /**
     * 提示完成
     * @param cb
     */
    onPromptComplete(cb: Function): void;
}
