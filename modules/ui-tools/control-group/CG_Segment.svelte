<script lang="ts">
	import type {CG_SegmentProps} from "./types";
	import {cssVarsString} from "../css-var";
	import {tooltip} from "../tooltip/tooltip-action.svelte";
	import type {Snippet} from "svelte";
	import {slide} from "svelte/transition";


	let {
		children,
		grow = false,
		noborder = false,
		label
	}: {
		children: Snippet,
	} & CG_SegmentProps = $props();


	grow = typeof grow === "number" ? grow : (grow ? 1 : 0);
</script>

<main style="flex-grow: {grow ? 1 : 0}; {cssVarsString({border: noborder ? 0 : 1})}" use:tooltip={label} data-tooltip={label} transition:slide={{axis: "x"}}>
	{@render children()}
</main>

<style lang="scss">
	main {
		display: flex;
		&:not(:last-child) {
			border-right: var(--border) solid var(--border-color);
		}
	}
</style>