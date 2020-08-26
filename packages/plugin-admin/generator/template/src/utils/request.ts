import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import qs from 'qs';
import { Message } from 'element-ui';
import { SYS_APP_CODE, TokenCode, RefreshTokenCode, apiUrl } from '@/config';
import { getToken, removeToken } from './cache';

const service = axios.create({
	baseURL: process.env.NODE_ENV === 'development' ? apiUrl.dev : apiUrl.prod,
	timeout: 3000,
});

export interface MyAxiosRequestConfig extends AxiosRequestConfig {
	type?: string;
}

/**
 * 请求参数处理
 */
service.interceptors.request.use((config: MyAxiosRequestConfig) => {
	if (config.type === 'FormData') {
		config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
		if (config.method === 'post') config.data = qs.stringify(config.data);
		else if (config.method === 'delete') config.data = qs.stringify(config.data);
	}
	const token = getToken(TokenCode);
	if (token) config.headers['Authorization'] = 'Bearer ' + token;
	config.headers['Tiger-Sys-App-Code'] = SYS_APP_CODE;
	return config;
});

/**
 * 响应结果处理
 */
service.interceptors.response.use(
	(response: AxiosResponse) => {
		if (response.data.code == !0) {
			Message.error(response.data.message);
			return Promise.reject(response);
		}
		return Promise.resolve(response.data);
	},
	(error: any) => {
		if (error && error.response) {
			let message = '';
			switch (error.response.status) {
				case 401:
					removeToken(TokenCode);
					removeToken(RefreshTokenCode);
					location.reload();
					return;
				case 403:
					//   if (isPermitList.includes(error.config.url.replace(error.config.baseURL, '')) && window.location.pathname != '/403') {
					//     window.location.replace('/403')
					//   } else if (!isPermitList.includes(error.config.url.replace(error.config.baseURL, ''))) {
					//     message = error.response.data.path + ',' + error.response.data.message
					//   }
					break;
				case 429:
					message = '访问太过频繁，请稍后再试!';
					break;
				default:
					message = error.response.data.message ? error.response.data.message : '服务器错误';
					break;
			}
			message && Message.error(message);
			return Promise.reject(error.response);
		} else {
			return Promise.reject(error);
		}
	},
);

export default service;
