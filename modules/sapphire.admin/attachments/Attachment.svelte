<script lang="ts">
	import {onMount} from "svelte";
	import {Dialog} from "@nano-forge/ui-tools";
	import {AttachmentManager, setAttachmentManager} from "./attachment-manager.svelte.js";
	import Collection from "./Collection.svelte";

	let {attachmentManager}: { attachmentManager: AttachmentManager } = $props();
	setAttachmentManager(attachmentManager);

	onMount(() => { attachmentManager.load()});
</script>


<Dialog title="Attachment">
	{#each attachmentManager.options as collectionOptions}
		{@const collection = attachmentManager.getCollection(collectionOptions)}
		{#if collection}
			<Collection collection={collection} options={collectionOptions}/>
		{/if}
	{/each}
</Dialog>


<style lang="scss">

</style>