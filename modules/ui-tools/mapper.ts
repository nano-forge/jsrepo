import type {MaybePromise} from "@nano-forge/util";

export type MapperOptions = undefined | {
	separator: string,
} | {
	labelProperty: string,
	keyProperty: string
} | {
	parser: (d: Record<string, any>) => [any, any]
}


export type MapperInput = Map<any, any> | Record<any, any> | string[] | Array<Record<string, any>> | string;

export function createMapper(data: MapperInput): Mapper;
export function createMapper(data: Map<any, any> | Record<any, any> | string[]): Mapper;
export function createMapper(data: Map<any, any> | Record<any, any> | string[], _: undefined | MapperOptions): Mapper;
export function createMapper(data: string, options?: { separator: string }): Mapper;
export function createMapper(data: Array<Record<string, any>>, options: { labelProperty: string, keyProperty: string }): Mapper;
export function createMapper(data: Array<Record<string, any>>, options: { parser: (d: Record<string, any>) => [any, any] }): Mapper;
export function createMapper(data: () => MaybePromise<any>, options?: { separator: string }): Promise<Mapper>;
export function createMapper(data: any, options?: MapperOptions): MaybePromise<Mapper> {
	if (typeof data === "function") {
		return new Promise(async (resolve) => {
			resolve(new Mapper(await data(), options));
		})
	} else {
		return new Mapper(data, options)
	}
}


export class Mapper {
	type: "map" | "record" | "stringArray" | "objectArray" | "string" | undefined;
	options: Record<string, any> = {};
	#map: Map<any, any> = new Map();
	constructor(data: any, options?: MapperOptions & Record<string, any>) {
		if (typeof data === "string") {
			this.type = "string";
			this.options.separator = options?.separator ?? ",";
		}
		if (data instanceof Map) this.type = "map";
		if (Array.isArray(data)) {
			if (!options) this.type = "stringArray";
			else {
				this.type = "objectArray";
				if (options!.parser) this.options.parser = options.parser
				else this.options.parser = (d: Record<string, any>) => [d[options.keyProperty], d[options.valueProperty]]
			}
		}
		if (typeof data === "object") this.type = "record";

		switch (this.type) {
			case undefined:
				throw new Error(`Unknown type for ${JSON.stringify(data)}`);
			case "map":
				this.#map = data;
				break;
			case "record":
				Object.entries(data).forEach(([key, value]) => {this.#map.set(key, value)});
				break;
			case "stringArray":
				data.forEach((item: string) => {this.#map.set(item, item)})
				break;
			case "objectArray":
				data.forEach((item: Record<string, any>) => {this.#map.set(...(this.options.parser(item) as [any, any]))})
				break;
			case "string":
				data.split(this.options.separator).forEach((item: string) => {this.#map.set(item.trim(), item.trim())});
				break;
		}
	}

	get map(): Map<any, any> {
		return this.#map;
	}

	get data(): any {
		switch (this.type) {
			case "map":
				return this.#map;
			case "record":
				let result: Record<string, any> = {};
				this.#map.forEach((value, key) => {result[key] = value});
				return result;
			case "stringArray":
				return this.#map.keys();
			case "objectArray":
				throw new Error(`Cannot return data for ${JSON.stringify(this.type)}`);
			case "string":
				return [...this.#map.keys()].join(this.options.separator);
		}
	}

}