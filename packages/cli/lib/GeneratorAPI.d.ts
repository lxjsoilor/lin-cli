/// <reference types="node" />
export default class GeneratorAPI {
    id: string;
    generator: any;
    options: any;
    rootOptions: any;
    private _entryFile;
    constructor(id: string, generator: any, options: any, rootOptions: any);
    /**
     * 获取入口文件
     */
    get entryFile(): string;
    /**
     * 获取当前的路径
     * @param paths
     */
    resolve(paths: string): string;
    /**
     * 判断是否有plugin 为 id 的配置
     * @param id
     * @param version
     */
    hasPlugin(id: string, version: string): any;
    /**
     * 插入 import 到 某个文件
     * @param file
     * @param imports
     */
    injectImports(file: string, imports: string): void;
    /**
     *
     */
    injectRootOptions(file: string, options: any): void;
    /**
     *
     */
    injectOthers(file: string, options: any): void;
    extendPackage(fields: any): void;
    render(source: any, additionalData: any, ejsOptions: any): void;
    protected _resolveData(additionalData: any): any;
    /**
     *
     */
    protected _injectFileMiddleware(middleware: Function): void;
    /**
     * 渲染文件
     * @param name
     * @param data
     * @param ejsOptions
     */
    protected renderFile(name: string, data: any, ejsOptions: any): string | Buffer;
    /**
     *
     * @param cb
     */
    postProcessFiles(cb: Function): void;
    extractCallDir(): string;
}
