declare type Options = {
    outputPath: string;
    pathResolver?: Function;
};
export declare function getPackageJson(): any;
export declare function genPackageEntry(options: Options): void;
export {};
