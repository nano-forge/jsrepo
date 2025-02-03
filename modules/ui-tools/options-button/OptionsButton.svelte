<script lang="ts">

	import {cssVarsString} from "../css-var";
	import {Icon} from "../icon";
	import type {ToString} from "@nano-forge/util";

	let {icon, onclick, dark = false, pos = {top: 12, right: 12}, alwaysVisible = false}: {
		icon?: ToString<Icon>,
		onclick: (event: MouseEvent) => void,
		dark?: boolean,
		pos?: ({ top: number } | { bottom: number }) & ({ left: number } | { right: number }),
		alwaysVisible?: boolean,
	} = $props();

	if (icon === undefined) {icon = Icon.solid("ellipsis-vertical")}
</script>

<button class="OptionsButton" class:dark class:alwaysVisible style={cssVarsString(pos)} onclick={event=>onclick(event)}><i class={icon.class}></i></button>

<style lang="scss">
	button.OptionsButton {
		position: absolute;
		top: var(--top);
		right: var(--right);
		bottom: var(--bottom);
		left: var(--left);
		transition: all .3s;
		background-color: #fff;
		color: #66a;
		outline: 1px solid #0005;
		border: 0;
		border-radius: 3px;
		font-size: 12px;
		cursor: pointer;
		box-shadow: -4px 4px 4px #0003;
		&.dark {
			background-color: #226;
			color: #eef;
			outline-color: #66a;
		}
		@media (hover: hover) { opacity: 0;}
		&.alwaysVisible { opacity: 1;}
		&:hover {
			box-shadow: 0px 0px 0px transparent;
			scale: 1.5;
			outline-width: .66px;
			border-radius: 2px;
		}
	}
</style>