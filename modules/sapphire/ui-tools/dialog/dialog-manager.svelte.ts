import {type Component, getContext, setContext} from "svelte";

type Dialog = {
	component: Component<any, any, any>,
	data: any,
	resolver: (result: any) => void
}

class DialogManager {
	dialogs: Array<Dialog> = $state([]);

	open<PROPS extends Record<string, any>>(dialog: Component<PROPS, any, any>, data?: PROPS) {
		let resolver: (result: any) => void = () => {};
		let promise = new Promise((resolve) => { resolver = resolve;});
		this.dialogs.push({component: dialog, data: data, resolver});
		return promise;
	}
	close(result?: any) {
		let dialog = this.dialogs.pop();
		if (dialog) dialog.resolver(result);
	}
}

const DIALOG_KEY = Symbol("DIALOG");
export function createDialogManager() { setContext(DIALOG_KEY, new DialogManager());}
export function getDialogManager() { return getContext<DialogManager>(DIALOG_KEY);}