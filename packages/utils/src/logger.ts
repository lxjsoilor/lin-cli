import chalk from 'chalk';
import stripAnsi from 'strip-ansi'
import { EventEmitter } from 'events';
export const events = new EventEmitter()
import address from 'address';


/**
 * 
 * @param type 
 * @param tag 
 * @param message 
 */
const _log = (type:string, tag:string, message:string) => {
    if(message){
        events.emit('log', {
            message,
            type,
            tag
        })
    }
}
/**
 * 
 * @param label 
 * @param msg 
 */
const format = (label:string, msg:string) => {
    return msg.split('\n').map((line,i)=>{
        return i === 0 ? `${label} ${line}`: line.padStart(stripAnsi(label).length)
    }).join('\n')
}

/**
 * 
 * @param msg 
 */
const chalkTag = (msg:string) => chalk.bgBlackBright.white.dim(` ${msg}`)

/**
 * 默认提示
 * @param msg 
 * @param tag 
 */
export const log = (msg:string= '', tag:any= null) => {
    tag ? console.log(format(chalkTag(tag),msg)) : console.log(msg);
    _log('log', tag, msg)
}

/**
 * 信息提示
 * @param msg 
 * @param tag 
 */
export const info = (msg:string, tag:any  = null) => {
    console.log(format(chalk.bgBlue.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
    _log('info', tag, msg)
}
/**
 * 完成提示
 * @param msg 
 * @param tag 
 */
export const done = (msg:string, tag:any  = null) => {
    console.log(format(chalk.bgGreen.black(' DONE ') + (tag ? chalkTag(tag) : ''), msg))
    _log('done', tag, msg)
}

/**
 * 警告提示
 * @param msg 
 * @param tag 
 */
export const warn = (msg:string, tag:any  = null) => {
    console.warn(format(chalk.bgYellow.black(' WARN ') + (tag ? chalkTag(tag) : ''), msg))
    _log('warn', tag, msg)
}

/**
 * error 提示
 * @param msg 
 * @param tag 
 */
export const error = (msg:any, tag:any = null) => {
    console.log(format(chalk.bgRed.black(' INFO ') + (tag ? chalkTag(tag) : ''), msg))
    _log('error', tag, msg)
    if (msg instanceof Error) {
        console.error(msg.stack)
        // _log('error', tag, msg.stack)
    }
}

export const  logServerInfo = (port: number) => {
    const local = `http://localhost:${port}/`;
    const network = `http://${address.ip()}:${port}/`;
    const GREEN = '#07c160';
    console.log('\n  Site running at:\n');
    console.log(`  ${chalk.bold('Local')}:    ${chalk.hex(GREEN)(local)} `);
    console.log(`  ${chalk.bold('Network')}:  ${chalk.hex(GREEN)(network)}`);
}