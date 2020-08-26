import Vue from 'vue';
import VueRouter, { Route } from 'vue-router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { constantRoutes } from './constantRoutes';
import { PageTitle, WhiteList, LoginRedirectUrl, TokenCode } from '@/config';
import store from '@/store';
Vue.use(VueRouter);
// import MainLayout from '@/layout/mainLayout.vue';
import { removeToken } from '@/utils/cache';

/**
 * 异步路由
 */
export const aysncRoutes = [{ path: '*', redirect: '/404', meta: { hideInMenu: true } }];

export { constantRoutes };

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes: constantRoutes,
});

const getPageTitle = (pageName: string) => {
	return `${pageName} - ${PageTitle}`;
};

// const getToken = () => {
// 	const REDIRECT_URI = encodeURIComponent(LoginRedirectUrl);
// 	window.location.replace(
// 		`http://sso.flytiger.net/oauth/authorize?response_type=code&client_id=0hIbyFPg78DF0AVAnXEMNqhq&redirect_uri=${REDIRECT_URI}`,
// 	);
// };

router.beforeEach(async (to: Route, _: Route, next: any) => {
	NProgress.start();
	if (store.getters['user/token']) {
		// 判断是否有token
		if (to.path === '/login') {
			next({ path: '/' });
			NProgress.done();
		} else {
			// 判断当前用户是否已拉取完 user_info信息
			// 如果没有 则拉取 info
			if (store.getters['routes/menus'].length === 0) {
				try {
					store.dispatch('routes/getUserMenuTree').then(async res => {
						// 挂载异步路由
						if (res.length > 0) {
							// 挂载异步路由
							// console.log(store.getters['routes/addRoutes']);
							// await router.addRoutes(store.getters['routes/addRoutes']);
							next({ ...to, replace: true });
						} else {
							// todo 清理token 重定向至 login
							// next(`/403?redirect=${to.path}`);
							// getToken();
							removeToken(TokenCode);
							next(`/login`);
							NProgress.done();
						}
					});
				} catch (error) {
					// todo 清理token 重定向至 login
					next(`/login?redirect=${to.path}`);
					// getToken();
					NProgress.done();
				}
			} else {
				// console.log(to);
				const label = to.meta.name;
				const value = to.fullPath;
				// console.log(label, value);
				store.commit('tags/SET_TAG', {
					label,
					value,
				});
				next();
			}
		}
	} else {
		if (WhiteList.indexOf(to.path) !== -1) {
			// 在免登录白名单，直接进入
			next();
		} else {
			// getToken();
			next(`/login?redirect=${to.path}`); // 否则全部从定向到登录页
			NProgress.done();
		}
	}
});

router.afterEach((to: Route) => {
	NProgress.done();
	// 设置页面title
	document.title = getPageTitle(to.meta.name);
});

export default router;
