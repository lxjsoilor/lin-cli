import { MutationTree, ActionTree, ActionContext } from 'vuex';
import { LoginToken, SelectDefaultTenant, OAuthLoginToken, Logout } from '@/api';
import { getToken, setToken, removeToken } from '@/utils/cache';
import { TokenCode, RefreshTokenCode, ClientId } from '@/config';

interface UserState {
	token?: string;
	refreshToken?: string;
}

const state: UserState = {
	token: getToken(TokenCode),
	refreshToken: getToken(RefreshTokenCode),
};

const getters = {
	token: () => state.token,
};

const mutations: MutationTree<UserState> = {
	// 设置 token
	SET_TOKEN: (state: UserState, token: string) => {
		state.token = token;
		setToken(TokenCode, token);
	},
	// 设置 refresh token
	SET_REFRESH_TOKEN: (state: UserState, refreshToken: string) => {
		state.refreshToken = refreshToken;
		setToken(RefreshTokenCode, refreshToken);
	},
};

const actions: ActionTree<UserState, any> = {
	// 登录获取 token
	login({ commit, dispatch }: ActionContext<UserState, any>, userInfo) {
		return new Promise((resolve, reject) => {
			const data = {
				api: LoginToken,
				data: Object.assign({ clientId: ClientId }, userInfo),
				type: 'FormData',
			};
			dispatch('crud/post', data, { root: true }) // root= true 是 modules之间调用 必须的
				.then(async res => {
					commit('SET_TOKEN', res.data.access_token);
					commit('SET_REFRESH_TOKEN', res.data.refresh_token);
					await dispatch('tenantInfo');
					// 获取异步菜单
					dispatch('routes/getUserMenuTree', {}, { root: true }).then(res => {
						resolve();
					});
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	/**
	 * 退出登录
	 * @param param0
	 */
	logout({ dispatch }: ActionContext<UserState, any>) {
		return new Promise((resolve, reject) => {
			const data = {
				api: Logout,
				data: { token: getToken(TokenCode) },
				type: 'FormData',
			};
			dispatch('crud/post', data, { root: true })
				.then(res => {
					removeToken(TokenCode);
					removeToken(RefreshTokenCode);
					resolve(true);
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	/**
	 * 单点登录授权
	 */
	oAuthLogin({ commit, dispatch }: ActionContext<UserState, any>, code) {
		return new Promise((resolve, reject) => {
			const data = {
				api: OAuthLoginToken,
				params: { code: code.code, clientId: ClientId },
			};
			dispatch('crud/get', data, { root: true }).then(async res => {
				commit('SET_TOKEN', res.data.access_token);
				commit('SET_REFRESH_TOKEN', res.data.refresh_token);
				await dispatch('tenantInfo');
				// 获取异步菜单
				dispatch('routes/getUserMenuTree', {}, { root: true }).then(res => {
					resolve();
				});
			});
		});
	},
	/**
	 * 获取默认租户
	 * @param param0
	 * @param userInfo
	 */
	tenantInfo({ dispatch }: ActionContext<UserState, any>) {
		return new Promise((resolve, reject) => {
			const data = {
				api: SelectDefaultTenant,
			};
			dispatch('crud/post', data, { root: true })
				.then(res => {
					resolve();
				})
				.catch(err => {
					reject(err);
				});
		});
	},
	/**
	 * 获取用户信息
	 * @param param0
	 * @param userInfo
	 */
	userInfo({ commit, dispatch }: ActionContext<UserState, any>, userInfo) {
		return new Promise((resolve, reject) => {
			const data = {
				api: SelectDefaultTenant,
			};
			dispatch('crud/post', data, { root: true })
				.then(res => {
					resolve();
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
