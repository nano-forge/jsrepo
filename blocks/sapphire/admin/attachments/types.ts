export type Attachment = {
	name: string,
	size: number,
	ref: string,
	metadata: Record<string, any>
}

export type MetaField = {
	name: string,
} & ({ type: "string" } | { type: "enum", options: string[] })

export type FileCollection = {
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