<script lang="ts">
	import {createMapper, Mapper, type MapperInput} from "../mapper";
	import Sortable, {type SortableEvent} from "sortablejs";
	import {onMount} from "svelte";
	import Tag from "./util/Tag.svelte";

	let {value = $bindable(), options}: {
		value: string[] | string,
		options: MapperInput
	} = $props();

	let selectValue: string | undefined = $state();


	let type = typeof value === "string" ? "string" : "array";

	let visualValue = $state(typeof value === "string" ? value.split(",") : value);
	$effect(() => {value = type === "string" ? visualValue.join(",") : visualValue})


	function addLabel() {
		if (!selectValue) return;
		if (visualValue.every((x: string) => x.toLowerCase() != selectValue!.toLowerCase())) visualValue.push(selectValue);
		selectValue = undefined;
	}

	let mapper: Mapper | undefined = $state();
	let tagsDiv: HTMLDivElement;
	onMount(async () => {
		mapper = await createMapper(options);

		new Sortable(tagsDiv, {
			animation: 300,
			onSort: async (event: SortableEvent) => {
				let tmp = visualValue[event.oldIndex as number]
				visualValue[event.oldIndex as number] = visualValue[event.newIndex as number];
				visualValue[event.newIndex as number] = tmp;
			}
		})
	})

	let id = Math.random().toString();

</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->


<input type="text" list={id} bind:value={selectValue} placeholder="Add new item / search" onchange={addLabel}/>
{#if mapper}
	<datalist id={id}>
		{#each mapper.map.entries() as [key, val]}
			{#if !visualValue.includes(key)}
				<option value={key}>{val}</option>
			{/if}
		{/each}
	</datalist>
{/if}

<div bind:this={tagsDiv}>
	{#each visualValue as tag (tag)}
		<Tag label={mapper ? mapper.map.get(tag) || tag : tag} onDelete={()=>{visualValue = visualValue.filter(t => t !== tag);}}/>
	{/each}
</div>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
	}
	div {
		margin-top: 5px;
		display: flex;
		flex-wrap: wrap;
	}
</style>