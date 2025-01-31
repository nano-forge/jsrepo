<script lang="ts">
	import {marked} from "marked";

	let {value}: { value: string } = $props();
</script>
<div class="markdown-body">
	{@html marked(value ?? "", {breaks: true})}
</div>

<style>

	:global(.markdown-body) {
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		margin: 0;
		padding: 0;
		color: #24292f;
		font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji";
		font-size: 13px;
		line-height: 1.3;
		word-wrap: break-word;
	}

	:global(.markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4, .markdown-body h5, .markdown-body h6) {
		color: #0366d6;
		font-weight: 600;
		margin-top: 0.7em;
		margin-bottom: 0.4em;
		line-height: 1.2;
	}

	:global(.markdown-body h1) {
		font-size: 1.6em;
	}

	:global(.markdown-body h2) {
		font-size: 1.4em;
	}

	:global(.markdown-body h3) {
		font-size: 1.2em;
	}

	:global(.markdown-body h4) {
		font-size: 1.1em;
	}

	:global(.markdown-body h5) {
		font-size: 1em;
	}

	:global(.markdown-body h6) {
		font-size: 0.9em;
	}

	:global(.markdown-body p) {
		margin-bottom: 0.6em;
		color: #1f2328;
	}

	:global(.markdown-body strong) {
		font-weight: 700;
		color: #24292f;
	}

	:global(.markdown-body em) {
		font-style: italic;
		color: #24292f;
	}

	:global(.markdown-body ul, .markdown-body ol) {
		margin-top: 0;
		margin-bottom: 0.8em;
		padding-left: 1.2em;
		list-style-type: none; /* Removes default list markers */
	}

	:global(.markdown-body ul li) {
		position: relative;
		margin-bottom: 0.4em;
	}

	:global(.markdown-body ul li::before) {
		content: "•";
		position: absolute;
		left: -1.2em;
		color: #0366d6;
		font-weight: bold;
	}

	:global(.markdown-body ol li) {
		counter-increment: list-counter;
		position: relative;
		margin-bottom: 0.4em;
	}

	:global(.markdown-body ol li::before) {
		content: counter(list-counter) ".";
		position: absolute;
		left: -1.2em;
		color: #0366d6;
		font-weight: bold;
	}

	:global(.markdown-body blockquote) {
		margin: 0 0 0.6em;
		padding: 0.4em 0.8em;
		color: #6a737d;
		border-left: 3px solid #0366d6;
		background-color: #f6f8fa;
		font-size: 0.9em;
		line-height: 1.2;
	}

	:global(.markdown-body table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1em 0;
	}

	:global(.markdown-body th, .markdown-body td) {
		border: 1px solid #e1e4e8;
		padding: 0.6em;
		text-align: left;
		color: #24292f;
	}

	:global(.markdown-body th) {
		background-color: #f6f8fa;
		font-weight: 600;
		color: #0366d6;
	}

	:global(.markdown-body tr:nth-child(even) td) {
		background-color: #f9f9f9;
	}

	:global(.markdown-body tr:hover td) {
		background-color: #f1f1f1;
	}

	:global(.markdown-body caption) {
		margin: 0.5em 0;
		font-size: 0.9em;
		color: #6a737d;
	}


</style>