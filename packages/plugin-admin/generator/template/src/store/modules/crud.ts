import request, { MyAxiosRequestConfig } from '@/utils/request';
import { ActionContext } from 'vuex';
const state = {};
const getters = {};
const mutations = {};

// type paramsType = {
// 	api: string;
// 	params: { [key: string]: unknown };
// 	headers?: { [key: string]: unknown };
// };

type dataType = {
	api: string;
	data: { [key: string]: unknown };
	type: string;
	headers?: { [key: string]: unknown };
};

type fileType = {
	api: string;
	params: { [key: string]: unknown };
	filename: string;
};

const actions = {
	/**
	 * get 方法
	 * @param context
	 * @param args
	 */
	async get(context: ActionContext<any, any>, args: dataType) {
		const { api, data, headers } = args;
		const res = await request.get(api, { params: data, headers });
		return res;
	},
	/**
	 * post 方法
	 * @param context
	 * @param args
	 */
	async post(context: ActionContext<any, any>, args: dataType) {
		const { api, data, type } = args;
		const res = await request.post(api, data, { type } as MyAxiosRequestConfig);
		return res;
	},
	/**
	 * delete 方法
	 * @param context
	 * @param args
	 */
	async delete(context: ActionContext<any, any>, args: dataType) {
		const { api, data, type } = args;
		const res = await request.delete(api + '/' + data.id, { data, type } as MyAxiosRequestConfig);
		return res;
	},
	/**
	 * put 方法
	 * @param context
	 * @param args
	 */
	async put(context: ActionContext<any, any>, args: dataType) {
		const { api, data } = args;
		const res = await request.put(api, data);
		return res;
	},
	/**
	 * 下载
	 * @param context
	 * @param args
	 */
	async download(context: ActionContext<any, any>, args: fileType) {
		const { api, params, filename } = args;
		const response = await request({
			url: api,
			method: 'GET',
			responseType: 'blob',
			params,
		});
		const url = window.URL.createObjectURL(new Blob([response.data]));
		const link = document.createElement('a');
		link.href = url;
		link.setAttribute('download', filename);
		document.body.appendChild(link);
		link.click();
	},
};

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
