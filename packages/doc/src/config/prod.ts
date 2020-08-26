import { Config } from '@tiger/service';
// import { join } from 'path';
import { DIST_DIR } from '../common'
export default (api: Config, options: any) => {
    api.mode('production')
        .output
        .path(DIST_DIR)
        .filename('[name].[hash:8].js')
        .chunkFilename('async_[name].[chunkhash:8].js')
        .publicPath(options.publicPath ? options.publicPath : '/')
        .end()
}