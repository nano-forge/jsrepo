<script lang="ts">
	import type {NonEmptyArray} from "@nano-forge/util";
	import {dragHandleZone} from "svelte-dnd-action";
	import Brick from "./BrickWrapper.svelte";
	import {type BrickData, BrickType, ContentManager} from "./content-manager.svelte.js";

	let {value = $bindable(), bank, blank}: { value: Array<BrickData>, bank: BrickType[], blank: NonEmptyArray<BrickData> } = $props();
	if (value.length === 0) value.push(...blank);
	let contentManager = new ContentManager(value, bank)

	$effect(() => {
		if (contentManager.content.length === 0) blank.forEach(b => contentManager.push(b, b.type))
		value = contentManager.value
	})

	function handleDndConsider(e: any) {contentManager.content = e.detail.items;}

	function handleDndFinalize(e: any) {
		if (e.detail.info.trigger === "droppedOutsideOfAny") contentManager.remove(e.detail.info.id);
		else contentManager.content = e.detail.items;
	}

	function copy() {
		navigator.clipboard.writeText("SAPPHIRE-CONTENT-EDITOR:" + JSON.stringify(contentManager.value));
	}
</script>

<section use:dragHandleZone="{{items: contentManager.content}}" onconsider={e=>handleDndConsider(e)} onfinalize={(e)=>handleDndFinalize(e)}>
	{#each contentManager.content as brick (brick.id)}
		<Brick brick={brick.brick}/>
	{/each}
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		gap: 5px;
		border-radius: 8px;
		border: 2px solid #5993;
		padding: 10px;
		background-color: #f8f8ff;
	}
</style>