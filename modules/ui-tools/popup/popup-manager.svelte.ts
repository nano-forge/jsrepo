import {type Component, getContext, setContext} from "svelte";

type Popup = {
	component: Component<any, any, any>,
	data: any,
	resolver: (result: any) => void,
	event: MouseEvent
}

export type PopupResolver = (result: any) => void;

class PopupManager {
	popup: Popup | undefined = $state(undefined);

	closeTimeout: Timer | null = null;

	cancelClose() {
		if (this.closeTimeout) {
			clearTimeout(this.closeTimeout);
			this.closeTimeout = null;
		}
	}

	open(popup: Component<any, any, any>, data?: any, event?: any): Promise<any> {
		let resolver: (result: any) => any = () => {};
		let promise = new Promise((resolve) => { resolver = resolve;});
		setTimeout(() => this.popup = {component: popup, data: data, resolver, event}, 20);
		return promise;
	}
	close() {
		if (this.popup && this.closeTimeout === null) {
			this.closeTimeout = setTimeout(() => {
				this.popup?.resolver(undefined)
				this.popup = undefined;
				this.closeTimeout = null;
			}, 10);
		}
	}
	resolve(result?: any) {
		this.popup?.resolver(result)
		this.popup = undefined;
		this.closeTimeout = null;
	}
}

const KEY = Symbol();
export function setPopupManager(popupManager: PopupManager) { setContext(KEY, popupManager);}
export function getPopupManager() { return getContext<PopupManager>(KEY);}
export function createPopupManager() {
	let popupManager = new PopupManager();
	setPopupManager(popupManager);
	return popupManager;
}