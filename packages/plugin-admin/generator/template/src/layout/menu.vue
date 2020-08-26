<template>
	<el-menu
		:default-active="activeIndex"
		:collapse-transition="false"
		class="el-menu-demo"
		:mode="mode"
		router
		:collapse="collapse"
		@select="handleSelect"
	>
		<menuItem :menu="routes" />
	</el-menu>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs } from '@vue/composition-api';
import { useStore } from '@/utils/useStore';
import menuItem from './menuItem.vue';
export default defineComponent({
	components: { menuItem },
	props: {
		mode: String,
		collapse: {
			type: Boolean,
			default: false,
		},
	},
	setup() {
		const store = useStore();
		const state = reactive({
			activeIndex: '/',
			routes: store.getters['routes/routes'],
		});

		const handleSelect = (value: string) => {
			state.activeIndex = value;
		};
		// 解析路由
		const parsePath = (parent: string, sub: string) => {
			return parent + '/' + sub;
		};
		return {
			handleSelect,
			parsePath,
			...toRefs(state),
		};
	},
});
</script>
<style lang="less">
.el-menu {
	height: 100%;
	&-item {
		text-align: left;
	}
	.el-submenu {
		text-align: left;
	}
	&.el-menu--collapse .el-menu-item span,
	&.el-menu--collapse .el-submenu > .el-submenu__title span {
		height: 0;
		width: 0;
		overflow: hidden;
		visibility: hidden;
		display: inline-block;
	}
	&.el-menu--collapse > .el-menu-item .el-submenu__icon-arrow,
	&.el-menu--collapse .el-submenu > .el-submenu__title .el-submenu__icon-arrow {
		display: none;
	}
}
</style>
