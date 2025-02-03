<script lang="ts">
	import type {AttachmentView} from "@nano-forge/hammer.common";
	import {Field} from "@nano-forge/sapphire.admin";
	import {SelectField} from "@nano-forge/ui-tools";

	import ImageFocusEditor from "./ImageFocusEditor.svelte";

	let {metadata = $bindable(), file}: { metadata: Record<string, any>, file: AttachmentView } = $props();

</script>

<Field>
	<SelectField bind:value={metadata.crop} options="left,right,center,manual,bottom,top,attention,entropy"/>
</Field>

<ImageFocusEditor {metadata} {file}/>