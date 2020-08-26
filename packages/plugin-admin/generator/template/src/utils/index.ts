export * from './request';

export const parseTime = (time?: object | string | number | null, cFormat?: string): string | null => {
	if (time === undefined || !time) {
		return null;
	}
	const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}';
	let date: Date;
	if (typeof time === 'object') {
		date = time as Date;
	} else {
		if (typeof time === 'string') {
			if (/^[0-9]+$/.test(time)) {
				// support "1548221490638"
				time = parseInt(time);
			} else {
				// support safari
				// https://stackoverflow.com/questions/4310953/invalid-date-in-safari
				time = time.replace(new RegExp(/-/gm), '/');
			}
		}
		if (typeof time === 'number' && time.toString().length === 10) {
			time = time * 1000;
		}
		date = new Date(time);
	}
	const formatObj: { [key: string]: number } = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay(),
	};
	const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
		const value = formatObj[key];
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') {
			return ['日', '一', '二', '三', '四', '五', '六'][value];
		}
		return value.toString().padStart(2, '0');
	});
	return timeStr;
};

/**
 * 合并路由路径
 * @param  {...any} arg -路径字符
 */
function resolvePath(...arg: any) {
	return arg
		.map((url: any) => {
			return url
				.split('/')
				.filter((v: any) => v !== '')
				.join('/');
		})
		.join('/');
}

/**
 * 转化菜单到路由
 * @param menus
 * @param parentPath
 */
export const routesGenerator = (menus: any, parentPath?: string) => {
	if (!parentPath) parentPath = '/';
	return menus.map((item: any) => {
		const isChild = item.children && item.children.length && item.children[0].category !== 2;
		const isTop = item.parentId === '0';
		const tpl: { [key: string]: any } = {
			path: resolvePath(parentPath, item.code),
			name: item.code,
			meta: {
				name: item.name,
				icon: item.icon,
				hideInMenu: false,
				notCache: true,
			},
		};
		if (!isTop) {
			tpl.path = item.path;
			tpl.name = item.code;
			tpl.meta.name = item.name;
			// requireAuth为true表明该路由需要权限才能进入
			tpl.meta.requireAuth = true;
			// 将按钮权限列表放置在前端路由的meta.authList属性上
			if (item._access) {
				tpl.meta.authList = item._access.map((item: any) => item.code);
			}
		}
		// 判断路径是否为路由组件还是url
		if (item.isOpen) {
			tpl.meta.href = item.path;
		} else {
			tpl.component = () => (isTop ? import('@/layout/mainLayout.vue') : import(`@/views/${item.path}.vue`));
		}
		// 带有子节点递归处理
		if (isChild) {
			tpl.children = routesGenerator(item.children, tpl.path);
			tpl.redirect = tpl.children[0].path;
		}

		return tpl;
	});
};

/**
 * 转换TableColumns
 * @param columns
 */
export const parseTableColumns = (columns: Array<any>) => {
	columns = columns.map((item: any) => {
		return {
			prop: item.data,
			label: item.title,
		};
	});
	columns.push({
		prop: 'action',
		label: '操作',
		width: 220,
	});
	return columns;
};
