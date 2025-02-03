<script module lang="ts">
	import {Icon} from "@nano-forge/ui-tools";
	import {BrickType} from "./content-manager.svelte";
	import Component from "./TextBrick.svelte";

	type OPTIONS = { markdown?: boolean };
	type VALUE = { text: string };
	type DELEGATE = { focusStart: () => void, focusEnd: () => void };

	export class TextBrickType extends BrickType<VALUE, OPTIONS, DELEGATE> {
		type = "text"
		icon = Icon.solid("text")
		label = "Text"
		defaultValue = {text: "blank text"}
		defaultOptions = {markdown: true}
		component = Component
	}
</script>

<script lang="ts">
	import {onMount, tick} from "svelte";
	import {TextAreaField} from "@nano-forge/ui-tools";
	import {Brick} from "./content-manager.svelte"

	const {brick}: { brick: Brick<VALUE, OPTIONS, DELEGATE> } = $props();
	const TYPE = brick.type;
	let textarea: HTMLTextAreaElement;

	async function keydown(e: KeyboardEvent) {
		const textarea = e.target as HTMLTextAreaElement;
		const cursor = textarea.selectionStart;

		if (e.key === "Enter" && e.shiftKey === true) {
			e.preventDefault();
			let [val1, val2] = [brick.value.text.slice(0, cursor), brick.value.text.slice(cursor)];
			brick.value.text = val1.trim();
			brick.insertAfter({value: {text: val2.trim()}}, TYPE)
			await tick();
			brick.next()?.delegate.focusStart();
		}

		if (e.key === "Backspace" && cursor === 0) {
			e.preventDefault();
			const prev = brick.prev(TYPE, true);
			if (!prev) return;
			const cursor = prev.value.text.length;
			brick.value.text = prev.value.text + "\n" + brick.value.text;
			prev.remove();
			await tick();
			textarea.focus();
			textarea.setSelectionRange(cursor, cursor);
		}

		if (e.key === "Delete" && cursor === textarea.value.length) {
			e.preventDefault();
			const next = brick.next(TYPE, true);
			if (!next) return;
			const cursor = brick.value.text.length;
			brick.value.text = brick.value.text + "\n" + next.value.text;
			next.remove()
			await tick();
			textarea.focus();
			textarea.setSelectionRange(cursor, cursor);
		}

		if ((e.key === "ArrowDown" || e.key === "ArrowRight") && cursor === textarea.value.length) {
			e.preventDefault();
			const next = brick.next(TYPE, false);
			if (next) {
				next.delegate.focusStart()
			}
		}

		if ((e.key === "ArrowUp" || e.key === "ArrowLeft") && cursor === 0) {
			e.preventDefault();
			const prev = brick.prev(TYPE, false);
			if (prev) {
				prev.delegate.focusEnd();
			}
		}
	}

	onMount(() => {
		textarea.addEventListener('keydown', (e) => keydown(e))
		brick.delegate = {
			focusEnd() {
				textarea!.focus();
				textarea!.setSelectionRange(textarea!.value.length, textarea!.value.length);
			},
			focusStart() {
				textarea!.focus();
				textarea!.setSelectionRange(0, 0);
			}
		}
	})
</script>

<TextAreaField bind:value={brick.value.text} code={false} markdown={brick.brickDef.options.markdown} bind:textarea={textarea}/>

<style lang="scss">
</style>