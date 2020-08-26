module.exports = (api, options = {}) => {
	api.injectImports(api.entryFile, `import VTable from '@tiger/v-table';`);

	api.injectOthers(
		api.entryFile,
		`Vue.use(VTable, {
            // 以下为默认值
            pageKey: 'current', // 设定请求页码参数的key值
            pageSizeKey: 'size', // 设定请求页数参数的key值
            /**
             * 处理请求函数返回的响应数据
             * @param {Object} res - action函数的返回内容
             * @param {Boolean} paging - 用以区分带分页的数据与列表数据
             * @return {Object} - 根据响应数据 手动返回数据对象{ page[Number]: 页面, total[Number]: 总条数, data[Array]: 传给表格的列表数据 }
             **/
            preAction(res: any, paging: boolean) {
                // （示例）需根据实际响应数据返回
                if (paging) {
                    const { current: page, total, records: data } = res.data;
                    return {
                        page,
                        total,
                        data,
                    };
                } else {
                    return res.data;
                }
            },
        });`
	);

	api.extendPackage({
		dependencies: {
			"@tiger/v-table": "^0.1.4-beta",
		},
		devDependencies: {},
	});
	api.render("./template");
};
