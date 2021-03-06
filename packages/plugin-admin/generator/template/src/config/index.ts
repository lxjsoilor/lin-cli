/**
 * base url
 */
export const apiUrl = {
	// dev: 'https://yapi.hucai.com/mock/13',
	// dev: 'http://192.172.56.152:8888',
	// dev: 'http://192.172.9.142:3000/mock/10/api',
	dev: 'http://dev-api.flytiger.net',
	prod: 'http://api.flytiger.net',
};

/**
 * 不允许访问的接口列表
 * 直接跳转全局 403
 */
export const notAllowVisitList = [];

// 导航的展示方式
export const MENU_TYPE = 'aside'; // menu, aside
//  CLIENT146884
export const SYS_APP_CODE = 'CLIENT146884';
export const ClientId = '0hIbyFPg78DF0AVAnXEMNqhq';
// host domain
export const domainHost = 'localhost';
// token 过期时间 默认是30天
export const expireTime = 30;
// token
export const TokenCode = 'token';
// refresh token
export const RefreshTokenCode = 'refresh_token';
/**
 * 系统 title
 */
export const PageTitle = 'FlyTiger';
/**
 * 免登录白名单
 */
export const WhiteList = ['/login'];

// 单点登录回调地址 自己系统的域名
export const LoginRedirectUrl = `http://${process.env.VUE_APP_SERVER}/login`;

export const CachePrefix = 'Tiger-';
