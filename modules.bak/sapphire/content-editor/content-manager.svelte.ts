import {type Component} from "svelte";
import type {IconType} from "modules/ui-tools";

export type BrickData<SPEC extends Record<string, any> = Record<string, any>> = { type: string, value: SPEC }
type NonTypedBrickData<SPEC extends Record<string, any> = Record<string, any>> = Omit<BrickData<SPEC>, "type"> & { type?: string };
type Content = Array<BrickData>;

export abstract class BrickType<
	VALUE extends Record<string, any> = Record<string, any>,
	OPTIONS extends Record<string, any> = Record<string, any>,
	DELEGATE extends Record<string, any> = Record<string, any>
> {
	abstract get defaultValue(): VALUE
	abstract get defaultOptions(): OPTIONS
	abstract get component(): Component<any, any, any>;
	abstract type: string;
	abstract icon: IconType;
	abstract label: string;
	protected readonly customOptions: Partial<OPTIONS>;
	modifiers: undefined | string[];

	get options() { return {...this.defaultOptions, ...this.customOptions};}

	import(value: any): VALUE { return value as VALUE;}

	constructor(
		options?: Partial<OPTIONS>,
		type?: string,
		label?: string,
		icon?: IconType,
		public readonly legacy: boolean = false
	) {
		this.customOptions = options ?? {};
		this.setup(type, label, icon);
	}

	protected setup(type?: string, label?: string, icon?: IconType) {
		if (type) this.type = type;
		if (label) this.label = label;
		if (icon) this.icon = icon;
	}
}


export class Brick<
	VALUE extends Record<string, any> = Record<string, any>,
	OPTIONS extends Record<string, any> = Record<string, any>,
	DELEGATE extends Record<string, any> = Record<string, any>,
> {
	id: `${string}-${string}-${string}-${string}-${string}`;
	type: string;
	delegate: DELEGATE = {} as DELEGATE;
	value: VALUE = $state({} as VALUE);

	get options() { return this.brickDef.options; }
	get icon() { return this.brickDef.icon; }
	get label() { return this.brickDef.label; }

	constructor(data: NonTypedBrickData<VALUE> | undefined, public brickDef: BrickType<VALUE, OPTIONS>, readonly contentManager: ContentManager) {
		this.type = brickDef.type
		if (data === undefined) data = {value: brickDef.defaultValue};
		this.brickDef = brickDef;
		this.id = crypto.randomUUID();
		this.value = brickDef.import(data.value);
	}

	next(type: string | true = true, immediate: boolean = false) { return this.contentManager.next(this.id, type, immediate);}
	prev(type: string | true = true, immediate: boolean = false) { return this.contentManager.prev(this.id, type, immediate);}
	insertAfter(item: NonTypedBrickData, type?: string) { this.contentManager.insertAfter(this.id, item, type);}
	remove() { this.contentManager.remove(this.id);}
}


export class ContentManager {

	public content: Array<{ id: string, brick: Brick }> = $state([]);

	constructor(content: Content, public bank: BrickType[]) {
		content.forEach(item => {
			let brick = this.makeBrick(item);
			this.content.push({id: brick.id, brick: brick})
		})
	}

	push(item: NonTypedBrickData, type?: string) {
		let brick = this.makeBrick(item, type);
		this.content.push({id: brick.id, brick: brick});
	}

	get value() {
		return this.content.map(item => ({type: item.brick.type, value: item.brick.value}));
	}

	makeBrick(data: NonTypedBrickData, type: string | undefined = data.type) {
		if (type === undefined) throw new Error("Brick type not defined");
		let brickDef = this.bank.find(brick => brick.type === type);
		if (brickDef === undefined) throw new Error(`Brick type ${type} not found in bank`);
		return new Brick(data, brickDef, this);
	}

	next(id: string, type: string | true = true, immediate: boolean = false) {
		let index = this.content.findIndex(item => item.id === id);
		if (index === -1) return;
		if (immediate) return this.content[index + 1] && (this.content[index + 1].brick.type === type || type === true) ? this.content[index + 1].brick : undefined;
		for (let i = index + 1; i < this.content.length; i++) {
			if ((this.content[i].brick.type === type || type === true)) return this.content[i].brick;
		}
		return undefined;
	}
	prev(id: string, type: string | true = true, immediate: boolean = false) {
		let index = this.content.findIndex(item => item.id === id);
		if (index === -1) return;
		if (immediate) return this.content[index - 1] && (this.content[index - 1].brick.type === type || type === true) ? this.content[index - 1].brick : undefined;
		for (let i = index - 1; i >= 0; i--) {
			if (this.content[i].brick.type === type || type === true) return this.content[i].brick;
		}
		return undefined;
	}

	create(brickDef: BrickType | string | undefined) {
		if (typeof brickDef === "string") brickDef = this.bank.find(brick => brick.type === brickDef);
		if (brickDef === undefined) throw new Error(`Brick type ${brickDef} not found in bank`);
		return {value: brickDef.defaultValue, type: brickDef.type};
	}

	remove(id: string) {
		const index = this.content.findIndex(item => item.id === id);
		if (index !== -1) this.content.splice(index, 1);
	}

	insertAfter(id: string, item: NonTypedBrickData, type?: string) {
		const index = this.content.findIndex(item => item.id === id);
		if (index !== -1) {
			let brick = this.makeBrick(item, type);
			this.content.splice(index + 1, 0, {id: brick.id, brick: brick});
		}
	}
}