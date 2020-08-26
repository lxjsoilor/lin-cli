<template>
	<div class="v-screenfull" id="screenfull" @click="click">
		<Icon :type="isFullscreen ? 'md-contract' : 'md-expand'" size="28" />
	</div>
</template>

<script lang="ts">
import screenfull from 'screenfull';
import { Component, Vue } from 'vue-property-decorator';

const sf = screenfull;

@Component({
	name: 'Screenfull',
})
export default class extends Vue {
	private isFullscreen = false;

	mounted() {
		if (sf.isEnabled) {
			sf.on('change', this.change);
		}
	}

	beforeDestory() {
		if (sf.isEnabled) {
			sf.off('change', this.change);
		}
	}

	private change() {
		if (sf.isEnabled) {
			this.isFullscreen = sf.isFullscreen;
		}
	}

	private click() {
		if (!sf.isEnabled) {
			this.$message({
				message: 'you browser can not work',
				type: 'warning',
			});
			return false;
		}
		sf.toggle();
	}
}
</script>
<style lang="less" scoped>
.v-screenfull {
	height: 60px;
	line-height: 68px;
	cursor: pointer;
	padding: 0 10px;
}
</style>
