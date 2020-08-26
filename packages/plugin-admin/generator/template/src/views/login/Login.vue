<template>
	<div class="v-login">
		<div class="v-login-con">
			<el-card class="box-card" header="欢迎登录">
				<v-form ref="form" :options="options" v-model="model">
					<template slot="footer">
						<el-button type="primary" @click="submit(model)">登录</el-button>
					</template>
				</v-form>
				<div class="v-login-other">测试账号：sjl 密码：123456</div>
				<div class="v-login-other">
					其他登陆方式：
					<el-tooltip effect="dark" content="虎彩授权登录">
						<el-button>上左</el-button>
						<div class="hc-hucai-login" @click="getToken">
							<img src="../../assets/images/hucai-logo.png" alt="" />
						</div>
					</el-tooltip>
				</div>
			</el-card>
		</div>
	</div>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, ref } from '@vue/composition-api';
import { useStore } from '@/utils/useStore';
import { LoginRedirectUrl } from '@/config';
export default defineComponent({
	props: {
		name: String,
	},
	setup(props, { root: { $router, $route } }) {
		const store = useStore();
		const form = ref();
		const { code } = $route.query;
		if (code) {
			// 如果存在 code 则用code 换取code
			store.dispatch('user/oAuthLogin', { code }).then(() => {
				$router.push({
					name: 'Home',
				});
			});
		}
		// 登陆
		const submit = async (mode: { [key: string]: unknown }) => {
			const validate = await form.value.validateForm();
			if (!validate) return;
			await store.dispatch('user/login', mode);
			$router.push({
				name: 'Home',
			});
		};

		const state = reactive({
			model: {
				username: 'sjl',
				password: '123456',
			},
			submit,
			options: {
				labelWidth: '0px',
				columns: [
					{
						title: '',
						type: 'input',
						data: 'username',
						props: {
							placeholder: '请输入用户名/手机号/邮箱',
						},
						rules: [{ required: true, message: '请输入用户名/手机号/邮箱', trigger: 'blur' }],
						span: 24,
					},
					{
						title: '',
						type: 'input',
						data: 'password',
						rules: [{ required: true, message: '密码不能为空', trigger: 'blur' }],
						props: {
							placeholder: '请输入密码',
							showPassword: true,
						},
						span: 24,
					},
				],
			},
		});

		const getToken = () => {
			const REDIRECT_URI = encodeURIComponent(LoginRedirectUrl);
			window.location.replace(
				`http://${process.env.VUE_APP_SSO_SERVER}/oauth/authorize?response_type=code&client_id=0hIbyFPg78DF0AVAnXEMNqhq&redirect_uri=${REDIRECT_URI}`,
			);
		};
		return {
			form,
			getToken,
			...toRefs(state),
		};
	},
});
</script>
<style lang="less">
.v-login {
	width: 100%;
	height: 100%;
	background-image: url('../../assets/images/login-bg.jpg');
	background-size: cover;
	background-position: center;
	position: relative;
	display: flex;
	justify-content: center;
	align-items: center;
	&-con {
		width: 348px;
	}
	.box-card {
		text-align: left;
	}

	.el-button {
		width: 100%;
	}
	&-other {
		font-size: 14px;
		color: #666;
		display: flex;
		margin-top: 10px;
		align-items: center;
		.hc-hucai-login {
			border-radius: 50%;
			overflow: hidden;
			width: 25px;
			height: 25px;
			display: flex;
			justify-content: center;
			align-items: center;
			border: 2px solid #0077c2;
			transform: translateY(3px);
			cursor: pointer;
			img {
				width: 85%;
			}
		}
	}
}
</style>
