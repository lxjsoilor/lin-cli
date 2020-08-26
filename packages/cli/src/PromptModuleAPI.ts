export default class PromptModuleAPI{
    creator?: any
    constructor(creator:any){
        this.creator = creator
    }
    /**
     * 注入特征
     * @param feature 
     */
    injectFeature (feature:any) {
        this.creator.featurePrompt.choices.push(feature)
    }
    /**
     * 注入提示
     * @param prompt 
     */
    injectPrompt (prompt:any) {
        this.creator.injectedPrompts.push(prompt)
    }
    /**
     * 为提示注入选项
     * @param name 
     * @param option 
     */
    injectOptionForPrompt (name:string, option:any) {
        this.creator.injectedPrompts.find((f:any) => {
            return f.name === name
        }).choices.push(option)
    }
    /**
     * 提示完成
     * @param cb 
     */
    onPromptComplete (cb:Function) {
        this.creator.promptCompleteCbs.push(cb)
    }
}