import {getContext, setContext} from "svelte";
import type {EventManager} from "./event-manager.svelte";


export class ListManager {
	public list: string | symbol | undefined = $state(undefined);

	static events = {
		OPEN_LIST: Symbol()
	}

	constructor(private eventManager: EventManager) {}
	open(name: string | symbol) {
		this.list = name;
		this.eventManager.fire(ListManager.events.OPEN_LIST, {name})
	}
}


let KEY = Symbol()
export function getListManager() {return getContext<ListManager>(KEY)}
export function createListManager(eventManager: EventManager) {
	let listManager = new ListManager(eventManager)
	setContext(KEY, listManager)
	return listManager;
}