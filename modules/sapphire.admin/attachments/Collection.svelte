<script lang="ts">

	import type {AttachmentView} from "@nano-forge/hammer.common";
	import Sortable, {type SortableEvent} from 'sortablejs';
	import {getDialogManager, Icon, Multiselect} from "../../ui-tools";
	import {CollectionOptions, getAttachmentManager} from "./attachment-manager.svelte.js";
	import EditFileProps from "./EditFileProps.svelte";
	import File from "./File.svelte";
	import {SapphireCollectionView} from "./sapphire-collection-view.ts";
	import type {FileCollection} from "./types.ts";

	let {collection, options}: { collection: FileCollection, options: CollectionOptions } = $props();

	const attachmentManager = getAttachmentManager();
	const dialogManager = getDialogManager();

	let collectionView: SapphireCollectionView | undefined = $state();
	let files: FileList | undefined = $state();
	let fileDiv: HTMLDivElement | undefined = $state()
	let selectedFileIdList: string[] = $state([]);

	let accept = collection.rules.ext ? (collection.rules.ext.join(", ")) : "*/*";
	let limit = {count: collection.rules.limit.count || Infinity, size: collection.rules.limit.size || Infinity}
	let multiSelect = new Multiselect([], "id")


	$effect(() => {
		collectionView = new SapphireCollectionView($state.snapshot(collection));
		multiSelect.updateList($state.snapshot(collection).files);
	});
	$effect(() => {
		if (fileDiv) {
			Sortable.create(fileDiv, {
				draggable: ".drag",
				animation: 200,
				onSort: async (event: SortableEvent) => {
					if (event.oldIndex === event.newIndex || event.oldIndex === undefined || event.newIndex === undefined) return;
					await attachmentManager.move(collection, collectionView!.files[event.oldIndex! - 1].name, event.newIndex - 1, true);
				}
			})
		}
	});


	async function fileAction(file: AttachmentView, action: string) {
		let multi = multiSelect.isSelected(file.ref);
		switch (action) {
			case "download":
				let link = document.createElement("a")
				link.download = file.name;
				link.href = file.url;
				link.click();
				break;
			case "edit":
				let result = (await dialogManager.open(EditFileProps, {file, rename: options.rename, MetadataEditor: options.MetadataEditor})) as { name: string, metadata: Record<string, any> } | null;
				if (result) {
					await attachmentManager.saveMetadata(collection, file.name, result.metadata, result.name);
				}
				break;
			case "delete":
				if (multi > 1) {
					if (confirm(`Are you sure you want to delete these attachments? (${selectedFileIdList.length} items)?`)) {
						for (let file of multiSelect.getSelectedList()) await attachmentManager.delete(collection, file.name, true);
						await attachmentManager.load()
					}
				} else {
					await attachmentManager.delete(collection, file.name);
				}
				break;
		}
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
{#if collectionView}
	<main onclick={e=> multiSelect.select(e) }>
		<h2><b>{options.label}</b></h2>
		<div class="files" bind:this={fileDiv}>
			{#if collectionView.files.length < limit.count}
				<div class="file-input no-drag">
					<label>
						<i class={Icon.solid("folder-plus").class}></i>
						<input type="file" multiple accept={accept} bind:files onchange={()=>attachmentManager.upload(collection, files)}/>
						<span>{collectionView.files.length} / { limit.count === Infinity ? "∞" : limit.count }</span>
					</label>
				</div>
			{:else }
				<div class="file-input full no-drag">
					<i class={Icon.solid("folder-xmark", Icon.fallbackSolid("circle-xmark")).class}></i>
					<span>{collectionView.files.length} / { limit.count === Infinity ? "∞" : limit.count }</span>
				</div>
			{/if}

			{#each collectionView.files as file (Math.random())}
				<div class="file drag" onclick={e=> multiSelect.select(e, file.ref) }>
					<File action={fileAction} selected={multiSelect.isSelected(file.ref)} {file} {options}/>
				</div>
			{/each}
		</div>
	</main>
{/if}


<style lang="scss">
	main {
		h2 {
			background-color: #559;
			color: white;
			margin: 0;
			font-size: 14px;
			padding: 10px 20px;
			font-weight: 300;
		}
		div.files {
			div.file-input {
				width: 130px;
				min-height: 130px;
				border: 1px dashed #66a8;
				background-color: #fff7;
				border-radius: 10px;
				display: flex;
				align-items: center;
				justify-content: center;
				flex-direction: column;
				transition: all .2s;
				input {display: none}

				span {
					display: block;
					font-size: 10px;
					text-align: center;
				}
				i {
					font-size: 64px;
					color: #6a6;
					text-shadow: 0 0 5px #fff;
					transition: all .2s;
				}
				&.full {
					cursor: not-allowed;
					i {color: #a66;}
				}
				&:not(.full):hover {
					border: 1px dashed #66af;
					background-color: #fff;
					cursor: pointer;
					i {scale: 1.1;}
				}
			}
			padding: 20px;
			display: flex;
			gap: 10px;
			flex-wrap: wrap;
			background-color: #eef;
		}
	}
</style>