<template>
	<error-content code="403" :desc="`Oh~~当前用户没有访问该系统的权限~`" :src="src" />
</template>

<script>
import error401 from '@/assets/images/error-page/error-404.svg';
import errorContent from './error-content.vue';
export default {
	name: 'error_403',
	components: {
		errorContent,
	},
	data() {
		return {
			src: error401,
		};
	},
	computed: {},
};
</script>
