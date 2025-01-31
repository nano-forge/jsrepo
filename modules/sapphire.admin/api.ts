type Attachment = {
	name: string,
	size: number,
	ref: string,
	metadata: Record<string, any>
}

type MetaField = {
	name: string,
} & ({ type: "string" } | { type: "enum", options: string[] })

type FileCollection = {
	id: number
	collection: string,
	files: Attachment[],
	publicMetaFields: Array<MetaField>
	rules: {
		limit: {
			size: number
			count: number
		},
		mime: undefined | Array<string>
		ext: undefined | Array<string>
	}
}

type ApiError = {
	status: number
	response: Response
}

/**
 * @throws ApiError
 */
type CmdFn = (cmd: string, body?: any | FormData, headers?: Record<string, string>) => Promise<any>;
function apiErrorHandler(e: any) {
	if (e.status !== undefined && e.response instanceof Response) throw new Api.ApiException(e.status, e.response);
	else throw e;
}


export namespace Api {
	/**
	 * Class representing an API exception.
	 * @extends {Error}
	 */
	export class ApiException extends Error {
		/**
		 * Create an API exception.
		 * @param {number} status - The HTTP status code.
		 * @param {Response} response - The response object.
		 */
		constructor(status: number, public response: Response) {
			super(`${status} ${response.statusText}`);
		}
	}

	/**
	 * Create a new API instance.
	 * @template ITEM - The type of the item.
	 * @template LIST - The type of the list, defaults to List<ITEM>.
	 * @param {string} endpointBase - The base endpoint URL.
	 * @param {CmdFn} call - The function to call the API.
	 * @returns {Api<ITEM, LIST>} A new API instance.
	 */
	export function create<ITEM_DATA extends Record<string, any>, LIST_DATA extends Record<string, any> = ITEM_DATA>(endpointBase: string, call: CmdFn): Api<Item<ITEM_DATA>, List<LIST_DATA>> {
		return new Api<Item<ITEM_DATA>, List<LIST_DATA>>(endpointBase, call);
	}

	/**
	 * Class representing an API.
	 * @template ITEM - The type of the item.
	 * @template LIST - The type of the list.
	 */
	class Api<ITEM extends AnyItem, LIST extends AnyList> {
		/**
		 * Create an API instance.
		 * @param {string} endpointBase - The base endpoint URL.
		 * @param {CmdFn} call - The function to call the API.
		 */
		constructor(protected endpointBase: string, protected call: CmdFn) {}

		/**
		 * Get the full endpoint URL for a command.
		 * @param {string} command - The command to append to the endpoint base.
		 * @returns {string} The full endpoint URL.
		 */
		endpoint(command: string): string {
			return this.endpointBase + "." + command;
		}

		/**
		 * Delete an item by ID.
		 * @param {string | number | null} id - The ID of the item to delete.
		 * @returns {Promise<void>} A promise that resolves when the item is deleted.
		 */
		async delete(id: string | number | null): Promise<void> {
			await this.call(this.endpoint("item.delete"), { id }).catch(apiErrorHandler);
		}

		/**
		 * Save an item.
		 * @param {ITEM} item - The item to save.
		 * @returns {Promise<ITEM>} A promise that resolves with the saved item.
		 */
		async save(item: ITEM): Promise<ITEM> {
			if (item === undefined) return item;
			let id = await this.call(this.endpoint("item.save"), { id: item.data.id, values: item.data }).catch(apiErrorHandler);
			return await this.getItem(id);
		}

		/**
		 * Get an item by ID.
		 * @param {string | number | null} id - The ID of the item to get.
		 * @param {Record<string, any>} [values] - Additional values to pass with the request.
		 * @returns {Promise<ITEM>} A promise that resolves with the item.
		 */
		async getItem(id: string | number | null, values?: Record<string, any>): Promise<ITEM> {
			return await this.call(this.endpoint("item.get"), { id, values: values ?? null }).catch(apiErrorHandler);
		}

		/**
		 * Get a list of items.
		 * @param {number} [page=0] - The page number to retrieve.
		 * @param {number} [pageSize=50] - The number of items per page.
		 * @param {ListOptions} [options] - Additional options for the list retrieval.
		 * @returns {Promise<LIST>} A promise that resolves with the list of items.
		 */
		async getList(page: number = 0, pageSize: number = 50, options?: ListOptions): Promise<LIST> {
			return await this.call(this.endpoint("list.get"), {
				page: page,
				pageSize: pageSize,
				search: options?.search ?? "",
				filter: options?.filter ?? null,
				order: options?.order ?? null
			}).catch(apiErrorHandler);
		}


		/**
		 * Get attachments for an item by ID.
		 * @param {number} id - The ID of the item.
		 * @returns {Promise<FileCollection[]>} A promise that resolves with the attachments.
		 */
		async getAttachments(id: number): Promise<FileCollection[]> {
			return await this.call(this.endpoint("attachment.get"), { id }).catch(apiErrorHandler);
		}

		/**
		 * Upload files for an item.
		 * @param {number} id - The ID of the item.
		 * @param {string} collectionName - The name of the file collection.
		 * @param {FileList} fileList - The list of files to upload.
		 * @returns {Promise<boolean>} A promise that resolves with the success status.
		 */
		async upload(id: number, collectionName: string, fileList: FileList): Promise<boolean> {
			let form = new FormData();
			for (let file of Array.from(fileList)) form.append("files[]", file, file.name);
			form.append("id", id.toString());
			form.append("collectionName", collectionName);
			return await this.call(this.endpoint("attachment.upload"), form).catch(apiErrorHandler);
		}

		/**
		 * Delete a file from an item.
		 * @param {number} id - The ID of the item.
		 * @param {string} collectionName - The name of the file collection.
		 * @param {string} fileName - The name of the file to delete.
		 * @returns {Promise<boolean>} A promise that resolves with the success status.
		 */
		async deleteFile(id: number, collectionName: string, fileName: string): Promise<boolean> {
			return await this.call(this.endpoint("attachment.delete"), {
				id,
				collectionName,
				fileName
			}).catch(apiErrorHandler);
		}

		/**
		 * Save metadata for a file.
		 * @param {number} id - The ID of the item.
		 * @param {string} collectionName - The name of the file collection.
		 * @param {string} fileName - The name of the file.
		 * @param {any} newMetaData - The new metadata for the file.
		 * @param {string} newName - The new name for the file.
		 * @returns {Promise<void>} A promise that resolves when the metadata is saved.
		 */
		async saveMetaData(id: number, collectionName: string, fileName: string, newMetaData: any, newName: string): Promise<void> {
			return await this.call(this.endpoint("attachment.update-file-data"), {
				id,
				collectionName,
				fileName,
				newMetaData,
				newName
			}).catch(apiErrorHandler);
		}

		/**
		 * Change the order of a file in a collection.
		 * @param {number} id - The ID of the item.
		 * @param {string} collectionName - The name of the file collection.
		 * @param {string} fileName - The name of the file.
		 * @param {number} position - The new position of the file.
		 * @returns {Promise<void>} A promise that resolves when the file order is changed.
		 */
		async changeFileOrder(id: number, collectionName: string, fileName: string, position: number): Promise<void> {
			return await this.call(this.endpoint("attachment.change-file-position"), {
				id,
				collectionName,
				fileName,
				position
			}).catch(apiErrorHandler);
		}

		/**
		 * Execute a custom command.
		 * @template RESULT
		 * @param {string} command - The command to execute.
		 * @param {any} [params] - The parameters for the command.
		 * @returns {Promise<RESULT>} A promise that resolves with the result of the command.
		 */
		async command<RESULT = any>(command: string, params?: any): Promise<RESULT> {
			let body: any = null;
			if (typeof params === "function") body = await params();
			if (typeof params === undefined) body = await params;

			return await this.call(this.endpoint(command), body).catch(apiErrorHandler);
		}
	}

	/**
	 * Options for listing items.
	 * @property {string} [search] - The search query.
	 * @property {Record<string, any>} [filter] - The filter criteria.
	 * @property {string} [order] - The order criteria.
	 */
	export type ListOptions = {
		search?: string,
		filter?: Record<string, any>,
		order?: string
	}

	/**
	 * Represents an item.
	 * @template DATA
	 * @property {DATA} data - The data of the item.
	 * @property {string} type - The type of the item.
	 */
	export type Item<DATA> = {
		data: DATA,
		type: string
	}

	/**
	 * Represents a list of items.
	 * @template DATA
	 * @property {number} page - The current page number.
	 * @property {number} count - The total number of items.
	 * @property {Array<Item<DATA>>} items - The list of items.
	 */
	export type List<DATA> = {
		page: number,
		count: number,
		items: Array<Item<DATA>>
	}

	/** Represents any item. */
	export type AnyItem = Item<Record<string, any>>;
	/** Represents any list. */
	export type AnyList = List<Record<string, any>>;
	/** Represents any API. */
	export type AnyApi = Api<AnyItem, AnyList>;
	/**
	 * Extracts the item type from an API instance.
	 * @template API - The type of the API instance.
	 */
	export type ItemOf<API extends Api<any, any>> = API extends Api<infer ITEM, any> ? ITEM : never;
	/**
	 * Extracts the list type from an API instance.
	 * @template API - The type of the API instance.
	 */
	export type ListOf<API extends Api<any, any>> = API extends Api<any, infer LIST> ? LIST : never;
	/**
	 * Extracts the item type from the list type of an API instance.
	 * @template API - The type of the API instance.
	 */
	export type ListItemOf<API extends Api<any, any>> = ListOf<API> extends List<infer DATA> ? Item<DATA> : never;

}
