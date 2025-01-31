<script lang="ts">

	let {value = $bindable(), disabled = false, type = "int", min = -Infinity, max = Infinity, placeholder = ""}: {
		value: string | number | undefined | null,
		disabled?: boolean,
		type?: "int" | "float",
		min?: number,
		max?: number,
		placeholder?: string
	} = $props();

	if (value === undefined) value = 0;
	if (typeof value === "string") {
		if (type === "int") value = parseInt(value.toString());
		if (type === "float") value = parseFloat(value.toString());
	}
	if ((value as number) < min) value = min;
	if ((value as number) > max) value = max;

	function onInputHandler() {
		if (value === undefined || value === null) value = 0;
		if (type === "int") value = parseInt(value.toString());
		if (type === "float") value = parseFloat(value.toString());
		if ((value as number) < min) value = min;
		if ((value as number) > max) value = max;
	}

</script>
<input type="number" bind:value={value} {placeholder} {disabled} onkeyup={()=>onInputHandler()} oninput={()=>onInputHandler()}/>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
		font-family: var(--mono-font), monospace;
		&:disabled {
			background-color: #fff8;
			color: #bcbcd1;
		}
		&::-webkit-outer-spin-button,
		&::-webkit-inner-spin-button {
			-webkit-appearance: none;
			margin: 0;
		}
	}
</style>