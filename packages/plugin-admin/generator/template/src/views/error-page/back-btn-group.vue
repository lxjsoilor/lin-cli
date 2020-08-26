<template>
	<div>
		<template v-if="code === '403'">
			<Button size="large" type="text" @click="handleSwitch">切换账号</Button>
			<Button size="large" type="text" @click="handleToggle">切换租户</Button>
		</template>
		<template v-else>
			<Button size="large" type="text" @click="backHome">返回首页</Button>
			<Button size="large" type="text" @click="backPrev">返回上一页({{ second }}s)</Button>
		</template>
	</div>
</template>

<script>
import './error.less';
import { mapActions, mapState } from 'vuex';
export default {
	name: 'backBtnGroup',
	props: {
		code: String,
	},
	data() {
		return {
			second: 5,
			timer: null,
		};
	},
	computed: {
		...mapState({
			tenantList: state => state.tenant.tenantList,
			currentTenantId: state => state.tenant.currentTenantId,
		}),
	},
	methods: {
		...mapActions(['toggleTenantData', 'handleLogout']),
		handleSwitch() {
			this.handleLogout().then(() => {
				const REDIRECT_URI = encodeURIComponent(location.origin + '/login');
				const targetUrl = `http://sso.flytiger.net/logout?response_type=code&client_id=7gBZcbsC7kLIWCdELIl8nxcs&redirect_uri=${REDIRECT_URI}`;
				window.location.href = targetUrl;
			});
		},
		handleToggle() {
			const { tenantList, currentTenantId, toggleTenantData } = this;
			const tenantId = currentTenantId;
			const loading = false;
			this.$Modal.confirm({
				render(h) {
					return (
						<RadioGroup class="tenant-list" size="large" vertical v-model={tenantId}>
							{tenantList.map(item => (
								<Radio label={item.tenantId}>{item.tenantAlias + (item.tenantId === tenantId ? '（当前租户）' : '')}</Radio>
							))}
						</RadioGroup>
					);
				},
				title: '切换租户',
				loading: loading,
				okText: '切换',
				onOk() {
					toggleTenantData({ tenantId });
				},
			});
		},
		backHome() {
			this.$router.replace({
				name: this.$config.homeName,
			});
		},
		backPrev() {
			this.$router.go(-1);
		},
	},
	mounted() {
		if (this.code === '403') return;
		this.timer = setInterval(() => {
			if (this.second === 0) this.backHome();
			else this.second--;
		}, 1000);
	},
	beforeDestroy() {
		clearInterval(this.timer);
	},
};
</script>
