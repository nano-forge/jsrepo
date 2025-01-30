<script lang="ts">
	import {createMapper, Mapper} from "../mapper.ts";
	import Sortable, {type SortableEvent} from "sortablejs";
	import {onMount, tick, untrack} from "svelte";
	import Tag from "./util/Tag.svelte";

	let {value = $bindable(), options}: {
		value: string[] | string,
		options: any
	} = $props();

	let selectValue: string | undefined = $state("");

	let type = typeof value === "string" ? "string" : "array";

	let visualValue = $state(typeof value === "string" ? value.split(",") : value);
	$effect(() => {value = type === "string" ? visualValue.join(",") : visualValue})


	$effect(() => {
		selectValue;
		untrack(() => {
			if (!selectValue) return;
			if (!visualValue.includes(selectValue)) visualValue.push(selectValue);
			selectValue = "";
		})
	})

	let tagsDiv: HTMLDivElement;
	let mapper: Mapper | undefined = $state();
	onMount(async () => {
		mapper = await createMapper(options);
		await tick()
		new Sortable(tagsDiv, {
			animation: 300,
			onSort: async (event: SortableEvent) => {
				let tmp = visualValue[event.oldIndex as number]
				visualValue[event.oldIndex as number] = visualValue[event.newIndex as number];
				visualValue[event.newIndex as number] = tmp;
			}
		})
	})

</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
{#if mapper}
	<select bind:value={selectValue} disabled={mapper.map.size===visualValue.length}>
		<option value="" disabled selected hidden>
			{#if mapper.map.size === visualValue.length}
				No more items to add
			{:else}
				Add new item
			{/if}
		</option>
		{#each mapper.map.entries() as [key, v]}
			{#if !visualValue.includes(key)}
				<option value={key}>{v}</option>
			{/if}
		{/each}
	</select>

	<div bind:this={tagsDiv}>
		{#each visualValue as tag (tag)}
			<Tag label={mapper.map.get(tag)} onDelete={()=>visualValue = visualValue.filter(t => t !== tag)}/>
		{/each}
	</div>
{/if}



<style lang="scss">
	@use "mixins" as *;
	select {
		@include input;
	}
	div {
		display: flex;
		flex-wrap: wrap;
		margin-top: 5px;
	}
</style>