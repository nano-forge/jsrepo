<script lang="ts">

	import {cssVarsString} from "../css-var.ts";
	import {getToolTipManager} from "./tooltip-manager.svelte.js";
	import {scale} from "svelte/transition";

	let toolTipManager = getToolTipManager()
	let x = $state(0);
	let y = $state(0);
	let h = $state("left");
	let v = $state("top");

	function mousemoveHandler(event: MouseEvent) {
		if (toolTipManager.label) {
			h = x > window.innerWidth / 2 ? "right" : "left";
			v = y > window.innerHeight / 2 ? "bottom" : "top";
			x = event.pageX;
			y = event.pageY;
		}
	}

</script>
<svelte:window onmousemove={e=>mousemoveHandler(e)}/>

{#if toolTipManager.label}
	<main transition:scale style={cssVarsString({x,y})} class="{h} {v}">
		<div>{@html toolTipManager.label}</div>
	</main>
{/if}

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: tooltip;

	main {
		position: absolute;
		width: 1px;
		left: var(--x);
		top: var(--y);

		&.left div { left: 10px;}
		&.right div { right: 10px; text-align: right}
		&.top div { top: 10px;}
		&.bottom div { bottom: 10px;}
		&.top.left div {border-top-left-radius: 0; }
		&.top.right div {border-top-right-radius: 0; }
		&.bottom.left div {border-bottom-left-radius: 0; }
		&.bottom.right div {border-bottom-right-radius: 0; }
		div {
			position: absolute;
			white-space: nowrap;
			color: v(color, #000e);
			background-color: v(bg-color, #f90);
			font-weight: 500;
			padding: 5px 10px;
			font-size: 11px;
			border-radius: 10px;
			box-shadow: v(shadow, 0 0 4px rgba(0, 0, 0, .5));
			z-index: v(z-index, 9500);
			backdrop-filter: blur(3px);
		}
	}
</style>