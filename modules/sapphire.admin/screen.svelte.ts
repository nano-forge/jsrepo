import type {ScreenManager} from "./screen-manager.svelte";
import {ScreenType} from "./screen-type";
import {Icon} from "@nano-forge/ui-tools";
import {getContext, setContext} from "svelte";

export class Screen {
	public icon: Icon = $state(Icon.solid("circle-exclamation"));
	public title: string = $state("");
	public info: string = $state("");
	public changed: boolean = $state(false);
	public closeable: boolean = $state(true);
	public selected: boolean = $state(false);
	public showTab: boolean = $state(true);
	public loading: boolean = $state(false);
	public id: string = $state("");
	public onClose: (() => boolean) | undefined = $state(undefined);

	#data: any;

	constructor(
		readonly controller: ScreenManager,
		readonly screenType: ScreenType,
		data: any,
		id: string
	) {
		this.id = id;
		this.title = id;
		this.info = id;
		this.icon = Icon.solid("circle-exclamation");
		this.#data = data;
	}

	get data() {return this.#data}
	set data(data: any) {
		this.#data = data;
		this.id = this.screenType.getScreenId(data);
	}

	close(force: boolean = false) {this.controller.close(this.id, force);}
}

let KEY = Symbol()
export function setScreen(screen: Screen) {setContext(KEY, screen)}
export function getScreen() {return getContext<Screen>(KEY)}