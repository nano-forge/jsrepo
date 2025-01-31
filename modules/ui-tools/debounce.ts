export function debounce(node: HTMLInputElement, debounce: number): { update: (newTime: number) => void, destroy: () => void };
export function debounce(node: HTMLInputElement, options: { debounce: number, onchange?: (value: any) => void }): { update: (newTime: number) => void, destroy: () => void };
export function debounce(node: HTMLInputElement, options: number | { debounce: number, onchange?: (value: any) => void }): { update: (newTime: number) => void, destroy: () => void } {
	let timeout: ReturnType<typeof setTimeout> | null = null;
	if (typeof options === "number") options = {debounce: options};
	let {debounce} = options;
	if (options.onchange === undefined) options.onchange = () => node.dispatchEvent(new Event("change", {bubbles: true}));
	let value = node.value;
	const handleInput = () => {
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(() => {
			if (node.value !== value) {
				value = node.value;
				options.onchange!(node.value);
			}
		}, debounce);
	};
	node.addEventListener('input', handleInput);
	return {
		update(newTime: number) { debounce = newTime;},
		destroy() {
			if (timeout) clearTimeout(timeout);
			node.removeEventListener('input', handleInput);
		}
	};
}