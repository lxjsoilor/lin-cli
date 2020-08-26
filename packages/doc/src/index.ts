import Service from '@tiger/service';
import { emptyDir } from 'fs-extra';
import { join, relative } from 'path';
import { genPackageEntry } from './gen-package-entry';
import { genSiteShared } from './gen-site-shared';
import { DIST_DIR, SRC_DIR, PACKAGE_ENTRY, LIB_DIR } from './common'
export const doc = (name:string, options: any) => {
    switch (name) {
        case 'dev':
            docDev(options);
            break;
        case 'build':
            docBuild(options);
            break;
        default:
            break;
    }
}

const docDev = (options: any) => {
    genPackageEntry({
        outputPath: PACKAGE_ENTRY
    });
    genSiteShared();
    const plugins = [
        require.resolve('./config/dev'),
    ]
    const htmlPath = join(__dirname, '../site/desktop/index.html');
    const serve = new Service({ plugins, htmlPath })
    serve.run(options.port ? options.port : 9002, {
        devServer: {}
    })
}

const docBuild = (options: any) => {
    const { site, path } = options
    if(site){
        genPackageEntry({
            outputPath: PACKAGE_ENTRY
        });
        genSiteShared();
        const plugins = [
            require.resolve('./config/dev'),
            require.resolve('./config/prod')
        ]
        const htmlPath = join(__dirname, '../site/desktop/index.html');
        // 清空文档
        emptyDir(DIST_DIR)
        const serve = new Service({ plugins, htmlPath, publicPath: path ? path : '/' });
        serve.build()
    }else{
        buildComponent()
    }
   
}

const buildComponent = async () => {
    
    genPackageEntry({
        outputPath: PACKAGE_ENTRY
    });
    // 清空 lib
    await emptyDir(LIB_DIR)
    // 1. 输出 packageEntry.js 到 lib
    genPackageEntry({
        outputPath: join(LIB_DIR, 'index.js'),
        pathResolver: (path:string) => `./${relative(SRC_DIR, path)}`
    })
    // 2. 编译组件
    const plugins = [
        require.resolve('./config/prod-component'),
    ]
    const serve = new Service({ plugins, cssPlugins:[{
        filename: '[name]/index.css',
        chunkFilename: '[id].css'
    }] });
    serve.build()
    // 3. 编译 以 packageEntry.js 为入口的
    buildCommon()
}

/**
 * 
 */
const buildCommon = async () => {
    const plugins = [
        require.resolve('./config/prod-common'),
    ]
    const serve = new Service({ plugins });
    serve.build()
}