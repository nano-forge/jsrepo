<script lang="ts">
	import MarkDownViewer from "./util/MarkDownViewer.svelte";
	import {onMount} from "svelte";
	import autosize from "svelte-autosize";

	let {
		value = $bindable(),
		placeholder = "",
		markdown = false,
		code = false,
		textarea = $bindable(undefined)
	}: ({ markdown?: false, code?: false } | { markdown: true, code?: false } | { code: true, markdown?: false }) & {
		value: string,
		placeholder?: string,
		textarea?: HTMLTextAreaElement
	} = $props()

	const type = markdown ? "markdown" : code ? "code" : "text";

	let codeArea: HTMLTextAreaElement;
	let previewArea: HTMLElement;

	onMount(() => {
		textarea = codeArea;
		codeArea.addEventListener('keydown', (e) => {
			if (e.key == 'Tab') {
				e.preventDefault();
				let start = codeArea.selectionStart;
				let end = codeArea.selectionEnd
				codeArea.value = codeArea.value.substring(0, start) + "\t" + codeArea.value.substring(end);
				codeArea.selectionStart = codeArea.selectionEnd = start + 1;
			}
		})
	})

	function codeAreaScroll() {
		if (!previewArea) return;
		let codeAreaHeight = codeArea.scrollHeight - codeArea.clientHeight;
		let previewAreaHeight = previewArea.scrollHeight - previewArea.clientHeight;
		let ratio = previewAreaHeight / codeAreaHeight;
		previewArea.scrollTop = codeArea.scrollTop * ratio;
	}

</script>
<main>
	<textarea
		class:code={type==="markdown" || type==="code"}
		bind:this={codeArea}
		{placeholder}
		bind:value={value}
		onscroll={() => codeAreaScroll()}
	></textarea>
	{#if type === "markdown"}
		<article
			bind:this={previewArea}
		>
			<MarkDownViewer value={value}/>
		</article>
	{/if}
</main>

<style lang="scss">
	@use "mixins" as *;
	main {
		display: flex;
		align-items: stretch;
		gap: 8px;
		width: 100%;
		max-width: 100%;

		&:has(textarea:focus) {
			max-height: 60vh !important;
			overflow: hidden;
			* {
				max-height: 60vh !important;
				overflow: auto;
			}
		}

		&:has(textarea:not(:focus)) {
			max-height: 150px !important;
			overflow: hidden;
			* {
				max-height: 150px !important;
				overflow: auto;
			}
		}

		article {
			border-radius: 5px;
			padding: 0 10px;
			background-color: #fff9;
			overflow-y: auto;

			width: 100%;
			overflow-wrap: break-word;
			word-break: break-word;
		}

		textarea {
			@include input;
			width: 100%;
			resize: none !important;
			word-break: break-word;
			field-sizing: content;
			&.code {
				font-family: var(--mono-font), Courier, monospace !important;
			}
			overflow-y: auto !important;
			transition: height .3s;
			line-height: 16px;
			tab-size: 4;
		}
	}

</style>