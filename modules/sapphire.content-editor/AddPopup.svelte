<script lang="ts">
	import {getPopupManager, PopupMenu, PopupMenuItem} from "../ui-tools";
	import {BrickType} from "./content-manager.svelte.js";

	let popupManager = getPopupManager();

	let {data}: { data: { bank: BrickType[] } } = $props();
</script>

<PopupMenu>
	{#each data.bank as brick}
		{#if brick.legacy !== true}
			<PopupMenuItem onclick={()=>popupManager.resolve(brick)} icon={brick.icon} label={brick.label}/>
		{/if}
	{/each}
</PopupMenu>

<style lang="scss">

</style>