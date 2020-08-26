import { ActionContext } from 'vuex';
import { RouteConfig } from 'vue-router';
import router, { constantRoutes, aysncRoutes } from '@/router';
import { UserMenuTree } from '@/api';
import { SYS_APP_CODE } from '@/config';
import { routesGenerator } from '@/utils';
export interface State {
	routes: RouteConfig[];
	addRoutes: RouteConfig[];
	menus: RouteConfig[];
}

const state: State = {
	// 完整路由 包含 异步路由
	routes: [],
	// 添加的异步路由
	addRoutes: [],
	menus: [],
};
const getters = {
	routes: (state: State) => state.routes,
	addRoutes: (state: State) => state.addRoutes,
	menus: (state: State) => state.menus,
};
const mutations = {
	SET_ROUTES: (state: State, routes: Array<RouteConfig>) => {
		state.addRoutes = routes;
		state.routes = constantRoutes.concat(routes);
	},
	SET_MENUS: (state: State, menus: any) => {
		state.menus = menus;
	},
};
const actions = {
	/**
	 * 生成路由
	 * @param param0
	 */
	generateRoutes({ commit, dispatch, state }: ActionContext<State, any>) {
		return new Promise(resolve => {
			const accessedRoutes = aysncRoutes.concat(routesGenerator(state.menus)) || [];
			commit('SET_ROUTES', accessedRoutes);
			router.addRoutes(accessedRoutes);
			resolve(accessedRoutes);
		});
	},
	/**
	 * 获取异步树形菜单
	 * @param param0
	 */
	getUserMenuTree({ commit, dispatch, state }: ActionContext<State, any>) {
		const data = {
			api: UserMenuTree,
			data: {
				sysAppCode: SYS_APP_CODE,
			},
		};
		return new Promise((resolve, reject) => {
			dispatch('crud/post', data, { root: true })
				.then(async res => {
					commit('SET_MENUS', res.data);
					await dispatch('generateRoutes');
					resolve(res.data);
				})
				.catch(err => {
					reject(err);
				});
		});
	},
};
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations,
};
