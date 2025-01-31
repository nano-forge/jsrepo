<script lang="ts">
	import {Icon} from "../icon.ts";
	import MenuGroup from "./MenuGroup.svelte";

	let {label, icon, children, onclick, open}: {
		label: string,
		icon?: string,
		children?: any,
		onclick?: () => void,
		open?: boolean
	} = $props();

	let opened = $state(open ?? false);
	let hasChildren = children !== undefined;
	icon = icon ?? Icon.solid("circle-exclamation")
	function action() {
		if (hasChildren) opened = !opened;
		if (onclick) onclick();
	}
</script>
<button class:opened class:hasChildren onclick={action}>
	<i class="fa-fw {icon} icon"></i>
	<span>{label}</span>
	{#if hasChildren}
		<i class={Icon.light("chevron-left").with("sub-marker", Icon.FW).class}></i>
	{/if}
</button>

{#if hasChildren}
	<MenuGroup sub={true} open={opened}>
		{@render children()}
	</MenuGroup>
{/if}
<style lang="scss">
	@use "../mixins" as *;
	$var-scope: menu;

	button {
		color: v(color, #FFFC);
		@include button-reset;
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		transition: all .2s;
		width: 100%;
		display: flex;
		padding: 7.5px 10px;
		border-radius: 5px;
		cursor: pointer;
		font-size: v(font-size, 12px);
		i {flex-shrink: 0;}
		span { flex-grow: 1; }
		&.hasChildren {
			font-weight: 700;
			color: v(with-submenu-color, #FFFD);
		}
		&:hover {
			background-color: v(hover-bg-color, #FFF3);
			color: v(hover-color, #FFF);
		}
		.icon {margin-right: 10px;}
		.sub-marker { transition: all .3s; font-size: v(font-size, 12px);}
		&.opened .sub-marker { rotate: -90deg}
	}


</style>