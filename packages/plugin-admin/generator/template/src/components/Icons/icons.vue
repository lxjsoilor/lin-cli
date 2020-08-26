<template>
	<div class="v-icon-list">
		<el-input v-model="icon" :placeholder="placeholder">
			<Icon size="20" :type="icon" slot="prepend" />
			<el-popover width="600" slot="append" placement="bottom">
				<Icon size="20" type="ios-search" />
				<div slot="content">
					<ul class="icons">
						<li
							class="icons-item"
							:title="item"
							@click="onIconClick(item)"
							:key="idx"
							v-for="(item, idx) in selectIcons"
						>
							<Icon :type="item" size="28" />
							<p>{{ item }}</p>
						</li>
					</ul>
				</div>
			</el-popover>
		</el-input>
	</div>
</template>
<script>
import icons from './icons';
import Icon from './icon.vue';
export default {
	name: 'IconList',
	props: {
		value: String,
		placeholder: String,
	},
	components: { Icon },
	data() {
		return {
			icon: '',
			selectIcons: icons,
		};
	},
	mounted() {
		this.icon = this.value ? this.value : '';
	},
	watch: {
		value(val) {
			if (val) this.icon = val;
		},
	},
	methods: {
		onIconClick(item) {
			this.$emit('input', item);
		},
	},
};
</script>
<style lang="less" scoped>
.icons {
	overflow: auto;
	zoom: 1;
	height: 300px;
}

.icons-item {
	float: left;
	margin: 6px;
	width: 60px;
	text-align: center;
	list-style: none;
	cursor: pointer;
	color: #5c6b77;
	transition: all 0.2s ease;
	position: relative;
}

.icons-item p {
	word-break: break-all;
	overflow: hidden;
}
</style>
