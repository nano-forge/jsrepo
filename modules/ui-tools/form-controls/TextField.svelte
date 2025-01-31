<script lang="ts">
	let {value = $bindable(), placeholder, big = false}: {
		value: string | number | undefined,
		placeholder?: string,
		big?: boolean
	} = $props();


</script>

<input class:big type="text" bind:value={value} placeholder={placeholder}/>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
		&.big {
			font-size: 18px;
		}
	}
</style>