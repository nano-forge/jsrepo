<script lang="ts">
	import {getListManager} from "../list-manager.svelte";

	let {name, children}: { name: string | symbol, children: any } = $props();

	let listManager = getListManager();
	let initialised = $state(false);
	let visible = $state(false);
	$effect(() => {
		visible = listManager.list === name;
		if (visible) initialised = true;
	})
</script>

<div class:hidden={!visible}>
	{#if initialised}{@render children()}{/if}
</div>

<style lang="scss">
	div {
		height: 100%;
		&.hidden { display: none; }
	}
</style>