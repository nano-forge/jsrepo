import type {EventManager} from "./event-manager.svelte";

export let KeyStrokeEvents = {
	SAVE_KEYSTROKE: Symbol(),
	ESCAPE: Symbol(),
	CONTROL_SPACE: Symbol(),
}

export function keyStrokeHandler(e: KeyboardEvent, eventManager: EventManager) {
	if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
		e.preventDefault()
		console.log("ITTTTT")
		eventManager.fire(KeyStrokeEvents.SAVE_KEYSTROKE, {all: e.shiftKey})
	}
	if (e.key.toLowerCase() === "escape") {
		e.preventDefault();
		eventManager.fire(KeyStrokeEvents.ESCAPE, {all: e.shiftKey})
	}
	if ((e.ctrlKey || e.metaKey) && e.key === " ") {
		e.preventDefault();
		eventManager.fire(KeyStrokeEvents.CONTROL_SPACE, {all: e.shiftKey});
	}
}