<script lang="ts">
	import type {AttachmentView} from "@nano-forge/hammer.common";
	import {getPopupManager, OptionsButton, tooltip} from "modules/ui-tools";
	import type {CollectionOptions} from "./attachment-manager.svelte.js";
	import FilePopup from "./FilePopup.svelte";
	import {SapphireCollectionView} from "./sapphire-collection-view.ts";


	let {selected = 0, file, action, options}: {
		selected?: number;
		file: AttachmentView,
		action: (file: AttachmentView, action: string) => Promise<void>,
		options: CollectionOptions
	} = $props();

	let popupManager = getPopupManager();

	async function menu(event: MouseEvent) {
		event.preventDefault();
		let option: string = await popupManager.open(FilePopup, {edit: selected < 2 && (options.rename || options.MetadataEditor), download: selected < 2}, event)
		if (option) await action(file, option)
	}
</script>

<main oncontextmenu={(event)=>menu(event)} class:selected={selected}>
	<OptionsButton onclick={(event:MouseEvent)=>menu(event)}/>
	<div class="preview" class:img={file.isImage}>
		{#if file.isImage}
			<img width="100%" height="100%" src={file.img("sapphire").x2.webp } alt="">
		{:else}
			<i class={SapphireCollectionView.getIcon(file).class}></i>
		{/if}
	</div>
	<div class="name" use:tooltip={file.name}>{file.name}</div>
</main>

<style lang="scss">
	main {
		width: 130px;
		background-color: #fff;
		border-radius: 10px;
		overflow: hidden;
		text-align: center;
		position: relative;
		box-shadow: 0 0 10px #0002;
		transition: all .2s;
		cursor: pointer;
		&.selected {
			background-color: #66a;
			color: white;
			div.preview.img {
				background: #66a;
			}
		}
		&:hover {
			box-shadow: 0 0 15px #0004;
			scale: 1.05;
		}
		div.preview {
			overflow: hidden;
			border-radius: 5px;
			width: 120px;
			height: 120px;
			margin: 5px;
			background-color: white;
			display: flex;
			justify-content: center;
			align-items: center;
			&.img { background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="10" height="10" fill="white"/><rect x="10" y="10" width="10" height="10" fill="white"/><rect x="10" width="10" height="10" fill="lightgray"/><rect y="10" width="10" height="10" fill="lightgray"/></svg>') repeat;}
			img { display: block;}
			i {
				font-size: 64px;
				color: #559;
			}
		}
		div.name {
			padding: 5px 10px;
			font-size: 12px;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
		}
		//&:global(:hover .OptionsButton){ opacity: 1;}
	}
</style>