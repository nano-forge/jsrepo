import {getToolTipManager} from "./tooltip-manager.svelte.js";


export function tooltip(node: HTMLElement, label: string | undefined): ({ destroy: () => void }) {
	let toolTipManager = getToolTipManager();
	let mouseEnterHandler = (e: any) => {
		if (node.dataset["tooltip"]) {
			label = node.dataset["tooltip"];
		}
		toolTipManager.show(label!);
	}
	let mouseLeaveHandler = (e: any | null) => {
		toolTipManager.hide();
	}


	if (label) {
		node.addEventListener('beforeRemove', mouseEnterHandler);
		node.addEventListener('focusout', mouseLeaveHandler);
		node.addEventListener('mouseleave', mouseLeaveHandler);
		node.addEventListener('mouseenter', mouseEnterHandler);
	}
	return {
		destroy() {
			mouseLeaveHandler(null);
			node.removeEventListener('focusout', mouseLeaveHandler);
			node.removeEventListener('mouseenter', mouseEnterHandler);
			node.removeEventListener('mouseleave', mouseLeaveHandler);
		}
	};
}