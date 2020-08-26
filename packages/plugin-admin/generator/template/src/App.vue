<template>
	<div id="app">
		<router-view />
	</div>
</template>
<script>
import { provideStore } from '@/utils/useStore';
export default {
	setup(props, { root: { $store } }) {
		provideStore($store);
		return {};
	},
};
</script>
<style lang="less">
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
}
html,
body,
#app,
.el-container {
	padding: 0;
	margin: 0;
	height: 100%;
	background: #f7f8fa;
}
#nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}

.el-card + .el-card {
	margin-top: 15px;
}
.v-card-search .el-card__body {
	padding-bottom: 0;
}
::-webkit-scrollbar {
	width: 6px;
	height: 6px;
	background-color: transparent;
}
::-webkit-scrollbar-thumb {
	background-color: transparent;
	border-radius: 6px;
}
.el-drawer__header > span:focus {
	outline: 0;
}
.el-drawer:focus {
	outline: 0;
}
</style>
