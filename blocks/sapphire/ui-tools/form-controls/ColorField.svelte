<script lang="ts">
	let {value = $bindable()}: { value: string, } = $props();
</script>
<main>
	<input type="color" bind:value={value}/>
	<span>{value}</span>
</main>

<style lang="scss">
	@use "mixins" as *;

	main {
		display: flex;
		gap: 5px;
		align-items: center;
		span {
			@include input;
			color: #555599;
		}
	}

	input {
		@include input;
		margin: 3px;
		padding: 0;
		cursor: pointer;
		max-width: 32px;
		outline: 3px solid white;
		border: 3px solid #559;
		border-radius: 8px;
		flex-shrink: 4;
	}
	::-webkit-color-swatch {
		border-radius: 5px;
		outline: none;
		border: none;
	}
	::-webkit-color-swatch-wrapper {
		padding: 0;
	}
</style>