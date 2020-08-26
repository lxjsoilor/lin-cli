import { RouteConfig } from "vue-router";
import MainLayout from "../layout/mainLayout.vue";
/**
 * 所有权限通用路由表
 * 如首页和登录页和一些不用权限的公用页面
 */
export const constantRoutes: Array<RouteConfig> = [
	{
		path: "/",
		name: "Layout",
		meta: {
			name: "首页",
			icon: "md-home",
		},
		component: MainLayout,
		redirect: "/home",
		children: [
			{
				path: "home",
				name: "Home",
				meta: {
					name: "首页",
				},
				component: () => import("../views/Home.vue"),
			},
		],
	},
	{
		path: "/login",
		name: "Login",
		meta: {
			hideInMenu: true,
			name: "Login",
		},
		component: () => import("@/views/login/Login.vue"),
	},
	{
		path: "/401",
		name: "error_401",
		meta: {
			hideInMenu: true,
		},
		component: () => import("@/views/error-page/401.vue"),
	},
	{
		path: "/500",
		name: "error_500",
		meta: {
			hideInMenu: true,
		},
		component: () => import("@/views/error-page/500.vue"),
	},
	{
		path: "/404",
		name: "error_404",
		meta: {
			hideInMenu: true,
		},
		component: () => import("@/views/error-page/404.vue"),
	},
	{
		path: "/403",
		name: "error_403",
		meta: {
			hideInMenu: true,
		},
		component: () => import("@/views/error-page/403.vue"),
	},
];
