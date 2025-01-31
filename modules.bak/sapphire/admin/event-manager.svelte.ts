import {getContext, onDestroy, onMount, setContext} from "svelte";

export class EventManager {

	protected subscribers: Record<symbol, Function[]> = {}

	subscribe(name: symbol, handler: Function) {
		if (!this.subscribers[name]) this.subscribers[name] = []
		this.subscribers[name].push(handler)

	}
	unsubscribe(name: symbol, handler: Function) {
		this.subscribers[name] = this.subscribers[name].filter(h => h !== handler)
	}
	fire(event: symbol | Array<symbol>, data: any) {
		event = Array.isArray(event) ? event : [event];
		event.forEach(evt => {
			this.subscribers[evt]?.forEach(handler => handler(data))
		});
	}
	subscribeComponent(event: symbol, handler: Function) {
		onMount(() => this.subscribe(event, handler));
		onDestroy(() => this.unsubscribe(event, handler));
	}
}

let KEY = Symbol("EVENT")
export function getEventManager() {return getContext<EventManager>(KEY)}
export function createEventManager() {
	let eventManager = new EventManager()
	setContext(KEY, eventManager)
	return eventManager;
}
