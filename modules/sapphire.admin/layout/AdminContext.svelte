<script lang="ts">
	import type {Snippet} from "svelte";
	import {DialogContainer, PopupContainer, ToastContainer, ToolTipContainer} from "@nano-forge/ui-tools";
	import {DrawerContainer} from "../drawer/DrawerContainer.svelte";
	import {getEventManager} from "../event-manager.svelte";
	import {keyStrokeHandler} from "../key-stroke-handler";
	let {children}: { children: Snippet } = $props();
	let eventManager = getEventManager()
</script>

<svelte:window onkeydown={e => keyStrokeHandler(e, eventManager)}/>

<main>
	<DrawerContainer/>
	<ToolTipContainer/>
	<ToastContainer/>
	<DialogContainer/>
	<PopupContainer/>
	{@render children()}
</main>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: admin;

	:global(body) {
		@include set-var(font, v(font, "Inter, system-ui, sans-serif"));
		@include set-var(mono-font, v(mono-font, "Red Hat Mono, monospace"));
		margin: 0
	}
	:global(*) {box-sizing: border-box}
	:global(::-webkit-scrollbar) { width: 4px; height: 4px; position: absolute}
	:global(::-webkit-scrollbar-track) { padding-left: 2px; background: transparent; }
	:global(::-webkit-scrollbar-thumb) { background: transparent;border-left: 3px solid v(scroll-color, #f90);}
	:global(::-webkit-scrollbar-corner) {display: none}

	main {
		:global(*:not(.fal):not(.fas):not(.far):not(.fa-thin):not(.fa-light):not(.fa-regular):not(.fa-duotone):not(.fa-brands):not(.fa-regular):not(.fa-solid)) {
			font-family: var(--font), system-ui;
		}
		height: 100vh;
		overflow: hidden;
	}
</style>