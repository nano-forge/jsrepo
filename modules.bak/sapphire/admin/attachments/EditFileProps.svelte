<script lang="ts">
	import {AttachmentView} from "@nano-forge/hammer.common";
	import {type Component} from "svelte";
	import {Dialog, FileNameField, getDialogManager} from "modules/ui-tools";
	import {Field} from "../index.ts";

	let dialogManager = getDialogManager();

	let {file, rename, MetadataEditor}: { file: AttachmentView, rename: boolean, MetadataEditor: Component | undefined } = $props();

	let fileCopy = $state.raw(structuredClone(file));
</script>

<Dialog title={fileCopy.name}>
	<main>
		{#if rename}
			<Field label="File name" column>
				<FileNameField bind:value={fileCopy.name}/>
			</Field>
		{/if}
		<MetadataEditor bind:metadata={fileCopy.metadata} file={file}></MetadataEditor>
	</main>

	{#snippet buttons()}
		<button onclick={()=>dialogManager.close(null)}>Close</button>
		<button onclick={()=>dialogManager.close(fileCopy)}>Save Changes</button>
	{/snippet}
</Dialog>

<style lang="scss">
	main {
		background-color: #eef;
		padding: 20px;
	}
</style>