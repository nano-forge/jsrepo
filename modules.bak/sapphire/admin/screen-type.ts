import type {Component} from "svelte";

export abstract class ScreenType {
	readonly uuid = crypto.randomUUID();
	constructor(
		readonly component: Component<any, any, any>,
	) {}
	getScreenId(data: any): string {return `${this.uuid}(${this.createScreenId(data)})`;}
	abstract createScreenId(data: any): string;
	data(...args: any[]): [ScreenType, Record<string, any>] { return [this, {}]}
}

/**
 * At most one of this kind can be opened
 */
export class ScreenTypeSingle extends ScreenType {
	createScreenId(data?: any): string { return ""}
}

/**
 * Whenever you open it, it will be new, unique
 */
export class ScreenTypeUnique extends ScreenType {
	createScreenId(data?: any): string { return `${crypto.randomUUID()}`}
}

export class ScreenTypeIdBased extends ScreenType {
	createScreenId(data: { id: number }): string { return `${data.id}`}
	data(id: number | string): [ScreenType, Record<string, any>] { return [this, {id}]}
}