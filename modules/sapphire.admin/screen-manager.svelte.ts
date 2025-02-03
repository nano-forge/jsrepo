import {EventManager} from "./event-manager.svelte";
import {ScreenType} from "./screen-type";
import {Screen} from "./screen.svelte";
import {getContext, setContext} from "svelte";


export class ScreenManager {

	public screens: Array<Screen> = $state([]);
	static events = {
		OPEN_SCREEN: Symbol(),
		FOCUS_SCREEN: Symbol(),
		CLOSE_SCREEN: Symbol(),
	}
	constructor(readonly eventManager: EventManager) {
	}
	get activeScreen(): Screen | undefined { return this.screens.find(screen => screen.selected)}

	open(screenOpen: [ScreenType, data?: any]): void ;
	open(screenType: ScreenType, data?: any): void ;
	open(...args: any[]): void {

		if (Array.isArray(args[0])) {
			args[1] = args[0][1];
			args[0] = args[0][0];
		}

		let screenType = args[0];
		let data = args[1];

		const id = screenType.getScreenId(data);
		let found = this.screens.find(screen => screen.id === id);
		if (found === undefined) {
			const screen = new Screen(this, screenType, data, id);
			this.screens.push(screen);
			this.eventManager.fire(ScreenManager.events.OPEN_SCREEN, screen);
		}
		this.focus(id)
	}
	focus(id?: string) {
		if (id === undefined) return;
		let found = this.screens.find(screen => screen.id === id);
		if (found === undefined) return;
		this.eventManager.fire(ScreenManager.events.FOCUS_SCREEN, found)
		for (const screen of this.screens) { screen.selected = found === screen; }
	}
	close(id: string, force: boolean = false) {
		let found = this.screens.find(screen => screen.id === id);
		if (found === undefined) return;
		if (!force && found.onClose && !found.onClose()) return;
		if (found.selected) {
			const index = this.screens.indexOf(found);
			if (index < this.screens.length - 1) this.focus(this.screens[index + 1].id)
			else if (index > 0) this.focus(this.screens[index - 1].id)
		}
		this.screens = this.screens.filter(screen => screen !== found);
		this.eventManager.fire(ScreenManager.events.CLOSE_SCREEN, found)
	}
}


let KEY = Symbol()
export function getScreenManager() {return getContext<ScreenManager>(KEY)}
export function createScreenManager(eventManager: EventManager) {
	let screenManager = new ScreenManager(eventManager)
	setContext(KEY, screenManager)
	return screenManager;
}
