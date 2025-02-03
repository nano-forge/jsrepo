import {Icon} from "../icon";
import {getContext, onDestroy, setContext} from "svelte";

type Toast = {
	id: string,
	icon?: Icon | string,
	title: string,
	details?: string,
	type: "info" | "warning" | "error" | "success"
}

function makeId(length: number): string {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

class ToastManager {
	public toasts: Array<Toast> = $state([]);
	protected toastToTimeoutMap = new Map<string, Timer>();

	constructor(protected durationMS?: number) {
		if (this.durationMS === undefined) this.durationMS = 5000;
		onDestroy(() => {
			this.toasts.forEach(toast => this.close(toast.id));
		});
	}

	protected open(title: string, type: "info" | "warning" | "error" | "success", details?: string, icon?: Icon, durationMs?: number) {
		if (durationMs === undefined) durationMs = this.durationMS;
		let id = makeId(32); //crypto.randomUUID();
		this.toasts.push({icon, title, details, type, id});
		this.toastToTimeoutMap.set(
			id,
			setTimeout(() => this.close(id), durationMs)
		);
	}

	info(title: string, details?: string, icon?: Icon, durationMs?: number) {this.open(title, "info", details, icon ?? Icon.solid("info-circle"), durationMs)}
	warning(title: string, details?: string, icon?: Icon, durationMs?: number) {this.open(title, "warning", details, icon ?? Icon.solid("exclamation-triangle"), durationMs)}
	error(title: string, details?: string, icon?: Icon, durationMs?: number) {this.open(title, "error", details, icon ?? Icon.solid("times-circle"), durationMs)}
	success(title: string, details?: string, icon?: Icon, durationMs?: number) {this.open(title, "success", details, icon ?? Icon.solid("check-circle"), durationMs)}

	close(id: string) {
		let timeout = this.toastToTimeoutMap.get(id);
		if (timeout) {
			clearTimeout(timeout);
			this.toastToTimeoutMap.delete(id);
		}
		this.toasts = this.toasts.filter(toast => toast.id !== id);
	}
}

const KEY = Symbol();
export function createToastManager(durationMs?: number) { setContext(KEY, new ToastManager(durationMs));}
export function getToastManager() { return getContext<ToastManager>(KEY);}