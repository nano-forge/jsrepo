<script lang="ts">
	let {value = $bindable(), placeholder}: {
		value: string,
		placeholder?: string
	} = $props();

	let ext = value.split('.').pop();
	let name = $state(value.split('.').slice(0, -1).join('.'));

	$effect(() => {
		value = name + '.' + ext;
	})

</script>
<main>
	<input type="text" bind:value={name} placeholder={placeholder}/><span>.{ext}</span>
</main>

<style lang="scss">
	@use "mixins" as *;
	main{
		display: flex;
		align-items: center;
		gap: 5px;
		@include input;
		padding: 0 10px 0 0;
		span{
			font-size: 12px;
			font-weight: bold;
		}
	}
	input{
		@include input;
	}
</style>