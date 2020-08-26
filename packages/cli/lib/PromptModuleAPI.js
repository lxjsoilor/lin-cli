"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PromptModuleAPI {
    constructor(creator) {
        this.creator = creator;
    }
    /**
     * 注入特征
     * @param feature
     */
    injectFeature(feature) {
        this.creator.featurePrompt.choices.push(feature);
    }
    /**
     * 注入提示
     * @param prompt
     */
    injectPrompt(prompt) {
        this.creator.injectedPrompts.push(prompt);
    }
    /**
     * 为提示注入选项
     * @param name
     * @param option
     */
    injectOptionForPrompt(name, option) {
        this.creator.injectedPrompts.find((f) => {
            return f.name === name;
        }).choices.push(option);
    }
    /**
     * 提示完成
     * @param cb
     */
    onPromptComplete(cb) {
        this.creator.promptCompleteCbs.push(cb);
    }
}
exports.default = PromptModuleAPI;
