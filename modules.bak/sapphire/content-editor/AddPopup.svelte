<script lang="ts">
	import {getPopupManager, PopupMenu, PopupMenuItem} from "modules/ui-tools";
	import {BrickType} from "./content-manager.svelte";

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