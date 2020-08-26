
import fs from 'fs-extra'
import { getRcPath } from './rcPath'

const rcPath = exports.rcPath = getRcPath('.hcrc')


let cachedOptions:any;
/**
 * 加载配置
 */
export const loadOptions = () => {
    if(cachedOptions){
        return cachedOptions
    }
    if(fs.existsSync(rcPath)){
        try{
            cachedOptions = JSON.parse(fs.readFileSync(rcPath, 'utf-8'))
        }catch(e){
            console.log(e.message);
        }
        return cachedOptions
    }else{
        return {}
    }
}
/**
 * 保存配置
 * @param toSave 
 */
export const saveOptions = (toSave:any) => {
    const options = Object.assign({}, toSave);
    for(const key in options){
        // if(!(key in defaults)){

        // }
    }
    try {
        fs.writeFileSync(rcPath, JSON.stringify(options, null, 2))
    }catch(err){
        console.error(err.message);
    }
}
/**
 * 保存预设
 * @param name 
 * @param preset 
 */
export const savePreset = (name:string, preset:any) => {
    const presets = loadOptions().presets || {}
    presets[name] = preset
    exports.saveOptions({ presets })
}