import Config from 'webpack-chain';
declare type ServiceType = {
    plugins?: Object;
    htmlPath?: string;
    cssPlugins?: any;
    publicPath?: string;
};
export default class Service {
    plugins: Array<any>;
    config: Config;
    htmlPath?: string;
    cssPlugins: any;
    publicPath?: string;
    constructor(args: ServiceType);
    init(): void;
    resolvePlugins(otherPlugins?: any): any[];
    /**
     *
     */
    run(port: number, config: any): void;
    build(): void;
}
export declare const server: (name: string, options: any) => void;
export { Config };
