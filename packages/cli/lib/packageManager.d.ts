/**
 * 包管理
 */
export default class PackageManager {
    /**
     * 命令方式
     */
    bin: string;
    /**
     * 目标路径
     */
    targetDir: string;
    constructor(targetDir?: string);
    /**
     * 运行命令行
     * @param command
     * @param args
     */
    runCommand(command: string, args?: Array<any>): Promise<unknown>;
    /**
     * 下载 package.json 中的依赖包
     * 如： yarn install npm install
     */
    install(): Promise<unknown>;
    /**
     * 添加一个依赖包
     * 如： yarn add vue npm install vue --save
     */
    add(packageName: string, { tilde, dev }?: {
        tilde?: boolean | undefined;
        dev?: boolean | undefined;
    }): Promise<unknown>;
    /**
     * 移除一个依赖包
     */
    remove(packageName: string): Promise<unknown>;
    /**
     * 升级一个依赖包
     * @param packageName
     */
    upgrade(packageName: string): Promise<unknown>;
}
