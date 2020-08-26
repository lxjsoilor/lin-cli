<template>
	<div class="v-tags-nav">
		<el-tabs type="card" @tab-remove="removeTab" @tab-click="openTag" v-model="currentTag">
			<el-tab-pane
				:closable="idx > 0"
				:label="item.label"
				v-for="(item, idx) in list"
				:key="idx"
				:name="item.value"
			></el-tab-pane>
		</el-tabs>
		<el-dropdown class="v-tags-nav-menu" @command="handleCommand">
			<Icon type="ios-backspace" size="24" />
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="other">关闭其他</el-dropdown-item>
				<el-dropdown-item command="all">关闭所有</el-dropdown-item>
				<el-dropdown-item command="" disabled>清楚缓存</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
	</div>
</template>
<script lang="ts">
import { defineComponent, watch, ref, reactive, toRefs } from '@vue/composition-api';
import { useStore } from '@/utils/useStore';
export default defineComponent({
	props: {},
	setup(props, { root: { $router } }) {
		const store = useStore();
		const state = reactive({
			list: store.getters['tags/tags'],
			currentTag: store.getters['tags/tag'].value,
		});
		const removeTab = (value: string) => {
			const idx = state.list.map((item: any) => item.value).indexOf(value);
			const item = state.list[idx - 1];
			$router.push({
				path: item.value,
			});
			store.commit('tags/DEL_TAG', value);
		};
		const openTag = (item: any) => {
			$router.push({
				path: item.name,
				query: item.query,
			});
		};
		// watch
		watch(
			() => [store.getters['tags/tags'], store.getters['tags/tag']],
			([tags, tag]) => {
				state.list = tags;
				state.currentTag = tag.value;
			},
		);
		const handleCommand = (command: string) => {
			switch (command) {
				case 'all':
					store.commit('tags/DEL_TAGS');
					$router.push({
						name: 'Home',
					});
					break;
				case 'other':
					store.commit('tags/DEL_TAGS_OTHER', store.getters['tags/tag']);
					break;
				default:
					break;
			}
		};
		return {
			...toRefs(state),
			removeTab,
			openTag,
			handleCommand,
		};
	},
});
</script>
<style lang="less">
.v-tags-nav {
	user-select: none;
	position: relative;
	padding: 0 10px;
	border-top: 1px solid #f6f6f6;
	background-color: #fff;
	box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
	padding-right: 42px;
	& > &-menu {
		position: absolute;
		right: 15px;
		top: 0;
		height: 39px;
		line-height: 46px;
		cursor: pointer;
	}
	.el-tabs__header {
		margin: 0;
	}
	.el-tabs__nav-wrap::after {
		height: 0;
	}
	.el-tabs__item.is-active {
		color: #409eff;
		border-bottom: 2px solid;
	}
	.el-tabs--card > .el-tabs__header {
		border-bottom: 0;
		.el-tabs__item.is-active {
			border-bottom-color: #409eff;
		}
		.el-tabs__item {
			border-left-width: 0;
		}
		.el-tabs__nav {
			border: 0;
		}
	}
}
</style>
