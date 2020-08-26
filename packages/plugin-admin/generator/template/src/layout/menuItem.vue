<template>
	<div class="v-menu-item">
		<template v-for="(item, idx) in menu">
			<el-menu-item :index="parsePath(item.path)" :key="idx" v-if="!item.children && !item.meta.hideInMenu">
				<!-- <Icon :type="item.meta.icon" /> -->
				<span slot="title">{{ item.meta.name }}</span>
			</el-menu-item>
			<el-submenu :index="parsePath(item.path)" v-if="item.children && item.children.length > 0" :key="idx">
				<template slot="title">
					<Icon v-if="item.meta.icon" :type="item.meta.icon" size="18" />
					<span slot="title">{{ item.meta.name }}</span>
				</template>
				<menu-item :menu="item.children" :root="item.path" />
			</el-submenu>
		</template>
	</div>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useStore } from '@/utils/useStore';
export default defineComponent({
	name: 'menu-item',
	props: {
		menu: Array,
		root: {
			type: String,
			default: '/',
		},
	},
	setup(props) {
		const store = useStore();
		const { root } = props;
		const parsePath = (path: string) => {
			return `${root}${root == '/' ? path : '/' + path}`;
		};
		return {
			store,
			parsePath,
		};
	},
});
</script>
<style lang="less" scoped>
.v-menu-item {
	.el-menu-item {
		text-align: left;
	}
	.el-submenu {
		text-align: left;
		span {
			padding-left: 5px;
		}
	}
}
</style>
