
import { command, version, parse } from 'commander'
import { server } from '@tiger/service';
import { doc } from '@tiger/doc'
import { create } from './create'
import init from './init'

/**
 * tiger 命令:
 *      init 初始化一个项目
 *          component 初始化一个组件库
 *          project 初始化一个项目
 *              -git=url
 *      create 创建一个项目
 *      add 添加一个插件
 *      doc 启动一个带有文档的组件服务  
 *          dev 开发组件服务
 *          build 打包组件服务
 *              --site 打包文档
 *              -p port 服务端口 
 *      dev 启动一个项目开发服务
 *      build 启动项目打包服务
 *      test 测试
 */
version(`@tiger/cli ${require('../package').version}`, '-v, --version');
// 初始化项目
command('init <name>')
    .description('初始化一个项目')
    .option('-g, --git <gitUrl>', 'git 地址')
    .option('-p, --project <projectName>', '项目名称')
    .action((name: string, cmd: any) => {
        const options = cleanArgs(cmd);
        init(name, options)
    })

// 创建项目
command('create <name>')
    .description('create a new project')
    .option('-p, --preset <presetName>', 'Skip prompts and use saved or remote preset')
    .action((name: string, cmd: any) => {
        const options = cleanArgs(cmd)
        create(name, options)
    })
// 添加插件
command('add <plugin> [pluginOptions]')
    .description('install a plugin')
    .option('-- r <url>')
    .action((name: string, cmd: any) => {
        const options = cleanArgs(cmd)
        console.log(name, options);
    })

command('serve <name>')
    .option('-p, --port <port>', 'server port')
    .action((name: string, cmd: any) => {
        const options = cleanArgs(cmd)
        server(name, options)
    })

/**
 * doc 文档
 * 组件相关的开发服务
 */
command('doc <name>')
    .description("组件开发服务")
    .option('-p, --port <port>', 'server port')
    .option('-s, --site', '打包文档站点')
    .option('-pp, --path <publicPath>', '指定打吧的 publicPath 默认为 /')
    .action((name: string, cmd: any) => {
        const options = cleanArgs(cmd)
        doc(name, options)
    })

parse(process.argv);

/**
 * 过滤一些参数
 * @param cmd 
 */
function cleanArgs(cmd: any) {
    const args: any = {}
    cmd.options.forEach((o: any) => {
        const key = camelize(o.long.replace(/^--/, ''))
        if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
            args[key] = cmd[key]
        }
    });
    return args
}


function camelize(str: string) {
    return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}
