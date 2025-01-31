<script lang="ts">
	import {untrack} from "svelte";

	let {value = $bindable()}: {
		value: string | number,
	} = $props();

	const type = typeof value === "number" ? "number" : "string";

	function convert(n: number) {
		return `${Math.floor(n / 60).toString().padStart(2, "0")}:${(n % 60).toString().padStart(2, "0")}`;
	}

	function convert_back(v: string) {
		let parts = v.split(":")
		return parseInt(parts[0]) * 60 + parseInt(parts[1]);
	}

	let visualValue: string = $state(typeof value === "number" ? convert(value) : value);

	$effect(() => {
		visualValue
		untrack(() => {
			if (type === "number") value = convert_back(visualValue);
			else value = visualValue;
		})
	})
</script>

<input type="time" bind:value={visualValue}/>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
		border: none;
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