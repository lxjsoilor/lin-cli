import Config from 'webpack-chain';
import { join } from 'path';
export default (api: Config, options: any) => {
    api.mode('production')
       .output
       .path(join(process.cwd(), 'dist'));
       
}