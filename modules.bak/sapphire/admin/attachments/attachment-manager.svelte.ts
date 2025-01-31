import {type Component, getContext, setContext} from "svelte";
import {Api} from "../api.ts";
import type {FileCollection} from "./types.ts";

export class CollectionOptions {
	public label: string
	constructor(
		public readonly collection: string,
		label?: string,
		public readonly rename: boolean = true,
		public readonly MetadataEditor?: Component<any, any, any>
	) {
		this.label = label || collection;
	}
}

export class AttachmentManager {
	collections: FileCollection[] = $state([])

	public readonly options: CollectionOptions[] = $state([]);

	constructor(protected api: Api.AnyApi, readonly id: number) {}

	static create(api: Api.AnyApi, id: number) { return new AttachmentManager(api, id);}

	addCollection(
		collection: string,
		label?: string,
		MetadataEditor?: Component<any, any, any>,
		rename: boolean = true,
	) {
		this.options.push(new CollectionOptions(collection, label || collection, rename, MetadataEditor));
		return this;
	}

	getCollection(options: CollectionOptions) { return this.collections.find(c => c.collection === options.collection);}

	async load() {this.collections = await this.api.getAttachments(this.id);}

	async upload(collection: FileCollection, files: FileList | undefined) {
		if (files) {
			await this.api.upload(collection.id, collection.collection, files)
			await this.load();
		}
	}

	async saveMetadata(collection: FileCollection, filename: string, metadata: Record<string, any>, newFileName: string, reload = true) {
		await this.api.saveMetaData(collection.id, collection.collection, filename, metadata, newFileName)
		if (reload) await this.load()
	}

	async delete(collection: FileCollection, filename: string, reload = true) {
		await this.api.deleteFile(collection.id, collection.collection, filename)
		if (reload) await this.load()
	}

	async move(collection: FileCollection, fileName: string, position: number, reload = true) {
		await this.api.changeFileOrder(collection.id, collection.collection, fileName, position)
		if (reload) await this.load();
	}
}

let KEY = Symbol();

export function setAttachmentManager(manager: AttachmentManager) {
	setContext(KEY, manager);
	return manager;
}

export function getAttachmentManager() {
	return getContext<AttachmentManager>(KEY);
}
