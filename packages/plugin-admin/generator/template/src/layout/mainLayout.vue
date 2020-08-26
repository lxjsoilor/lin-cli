<template>
	<el-container class="v-layout">
		<el-header>
			<Header />
		</el-header>
		<el-container class="v-layout-container">
			<el-aside v-if="isShowASide" :style="{ width: !$store.getters.collapse ? '220px' : '64px' }">
				<Menu mode="vertical" :collapse="$store.getters.collapse" />
			</el-aside>
			<div
				:class="{
					'v-layout-main': true,
					'v-layout-collapse': $store.getters.collapse,
				}"
			>
				<TagsNav />
				<el-main style="height: calc(100% - 40px);">
					<transition name="fade-transform" mode="out-in">
						<keep-alive>
							<router-view />
						</keep-alive>
					</transition>
					<BackToTop />
				</el-main>
			</div>
		</el-container>
	</el-container>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import { useStore } from '@/utils/useStore';
import { MENU_TYPE } from '@/config';
import TagsNav from '@/components/TagsNav';
import Header from './header.vue';
import Menu from './menu';
import BackToTop from '@/components/BackToTop/index.vue';
export default {
	components: { Header, Menu, BackToTop, TagsNav },
	setup() {
		const store = useStore();
		const state = reactive({
			isShowASide: MENU_TYPE === 'aside',
			classObject: {
				'v-layout-main': true,
				'v-layout-collapse': store.getters.collapse,
			},
		});

		return {
			...toRefs(state),
		};
	},
};
</script>
<style lang="less" scoped>
.el-header {
	background-color: #fff;
	color: #333;
	line-height: 60px;
	padding-left: 0;
	border-bottom: solid 1px #e6e6e6;
	color: #909399;
}

.el-aside {
	color: #333;
}

.v-layout {
	&-container {
		height: calc(100% - 60px);
	}
	&-main {
		width: calc(100% - 220px);
	}

	&-collapse {
		width: calc(100% - 64px);
	}
}
</style>
