<script lang="ts">
	let {value = $bindable()}: {
		value: string | undefined,
	} = $props();

</script>

<input type="week" bind:value={value}/>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
		position: relative;
		&::-webkit-calendar-picker-indicator {
			position: absolute;
			right: 0;
			width: 100%;
			height: 100%;
			margin: 0;
			padding: 0;
			opacity: 0;
			cursor: pointer;
		}
	}
</style>