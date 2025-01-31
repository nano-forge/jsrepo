<script lang="ts">
	import {getPopupManager, Icon, PopupMenu, PopupMenuItem} from "modules/ui-tools";

	let popupManager = getPopupManager();

	let {data}: { data: { edit: boolean, download: boolean } } = $props();
</script>

<PopupMenu>
	{#if data.edit}
		<PopupMenuItem onclick={()=>popupManager.resolve("edit")} icon={Icon.solid("user")} label="Edit"/>
	{/if}
	{#if data.download}
		<PopupMenuItem onclick={()=>popupManager.resolve("download")} icon={Icon.solid("user")} label="Download"/>
	{/if}
	<PopupMenuItem onclick={()=>popupManager.resolve("delete")} icon={Icon.solid("trash-can-xmark", Icon.fallbackSolid("trash")).color("red")} label="Delete"/>
</PopupMenu>

<style lang="scss">

</style>