import {getContext, setContext} from "svelte";

class ToolTipManager {
	label: string | undefined = $state();
	show(label: string) { setTimeout(() => this.label = label, 1); }
	hide() { setTimeout(() => this.label = undefined, 0);}
}

const KEY = Symbol();
export function createToolTipManager() { setContext(KEY, new ToolTipManager());}
export function getToolTipManager() { return getContext<ToolTipManager>(KEY);}