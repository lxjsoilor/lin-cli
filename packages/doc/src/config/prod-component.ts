import { Config } from '@tiger/service';
import { join } from 'path';
import { LIB_DIR, SRC_DIR, CWD, normalizePath, getComponents } from '../common'
export default (api: Config, options: any) => {
    const names =  getComponents();
    const components: { [key: string]: string } = { }
    names.forEach(name => {
        let path = join(SRC_DIR, name);
        components[name] = normalizePath(path)
    })
    api.mode('production')
        .entryPoints
            .clear()
            .end()
        .output
            .path(LIB_DIR)
            .filename('[name]/index.js')
            .chunkFilename('[id].js')
            .publicPath('/')
            .end()
    api.merge({
        entry: components
    })

    api.plugins.delete('html')

}