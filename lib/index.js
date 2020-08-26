
        import Button from './Button';
  
        const version = '1.0.0';
        function install(Vue) {
            const components = [
				// !skipInstall.includes(item)
				Button
            ];
        
            components.forEach(item => {
                if (item.install) {
                    Vue.use(item);
                } else if (item.name) {
                    Vue.component(item.name, item);
                }
            });
        }
        
        if (typeof window !== 'undefined' && window.Vue) {
            install(window.Vue);
        }
        
        export {
            install,
            version,
            Button
        };
        
        export default {
            install,
            version
        };
  