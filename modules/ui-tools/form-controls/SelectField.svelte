<script lang="ts">

	import {createMapper, Mapper, type MapperOptions} from "../mapper";
	import {onMount} from "svelte";

	let {value = $bindable(), options, convertOptions, placeholder}: {
		value: string,
		options: any,
		convertOptions?: MapperOptions,
		placeholder?: string
	} = $props();


	let mapper: Mapper | undefined = $state();
	onMount(async () => {
		mapper = await createMapper(options, convertOptions);
	})
</script>


<select bind:value={value}>
	{#if placeholder}
		<option value="" disabled selected hidden>Add new item / search</option>
	{/if}
	{#if mapper}
		{#each mapper.map.entries() as [key, value]}
			<option value={key}>
				{value}
			</option>
		{/each}
	{/if}
</select>

<style lang="scss">
	@use "mixins" as *;
	select {
		@include input;
	}
</style>