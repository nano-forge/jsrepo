<script lang="ts">
	import {cssVarsString} from "../css-var.ts";
	import {getPopupManager} from "./popup-manager.svelte.js";

	let {children}: { children: any } = $props();
	let popupManager = getPopupManager();

	let x = popupManager.popup!.event.pageX;
	let y = popupManager.popup!.event.pageY;
	let h = x > window.innerWidth / 2 ? "right" : "left";
	let v = y > window.innerHeight / 2 ? "bottom" : "top";
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main style={cssVarsString({x,y})} class="{h} {v}">
	<div onclick={()=>popupManager.cancelClose()} oncontextmenu={()=>popupManager.cancelClose()}>
		{@render children()}
	</div>
</main>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: popup;

	main {
		z-index: v(z-index, 9999);
		position: absolute;
		top: var(--y);
		left: var(--x);
		& > div {position: absolute;}
		&.left > div { left: 0px;}
		&.right > div { right: 0px;}
		&.bottom > div { bottom: 0px;}
		&.top > div { top: 0px;}
	}

</style>