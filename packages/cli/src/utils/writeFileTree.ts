import path from 'path'
import fs from 'fs-extra';
/**
 * 创建文件
 * @param dir 
 * @param files 
 */
export const writeFlieTree = (dir:string, files:any ) => {
    Object.keys(files).forEach((key:string)=>{
        const filePath = path.join(dir,key);
        // 确保目录的存在。如果目录结构不存在,就创建一个。
        fs.ensureDirSync(path.dirname(filePath))
        // 创建文件
        fs.writeFileSync(filePath, files[key])
    })
}