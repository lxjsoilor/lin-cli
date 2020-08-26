<template>
	<i :class="`v-icon v-icon-${type}`" :style="styles"></i>
</template>

<script>
export default {
	name: 'Icons',
	props: {
		type: {
			type: String,
			required: true,
		},
		color: {
			type: String,
			default: '#5c6b77',
		},
		size: {
			type: [Number, String],
			default: 16,
		},
	},
	computed: {
		styles() {
			return {
				fontSize: `${this.size}px`,
				color: this.color,
			};
		},
	},
	methods: {
		handleClick(e) {
			this.$emit('click', e);
		},
	},
};
</script>

<style></style>
