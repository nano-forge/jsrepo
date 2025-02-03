<script lang="ts">
	import {getScreenManager} from "../screen-manager.svelte";
	import {Screen} from "../screen.svelte";
	import {Icon} from "@nano-forge/ui-tools";
	import {blur, fade} from "svelte/transition";

	let screenManager = getScreenManager();
	let {screen}: { screen: Screen } = $props();
</script>

<a transition:blur
   href={undefined}
   class:selected={screen.selected}
   data-screen-id={screen.id}
   onclick={()=>screenManager.focus(screen.id)}
>
	{#if screen.changed}
		<div transition:fade class="changed"></div>
	{/if}
	{#if screen.loading}
		<i class={Icon.duotone("spinner").with("icon", Icon.FW,Icon.ANIM_PULSE).class}></i>
	{:else}
		<i class={screen.icon.with("icon", Icon.FW).class}></i>
	{/if}
	<div class="label">
		<div class="info">{screen.info}</div>
		<div class="title">{screen.title}</div>
	</div>
	{#if screen.closeable}
		<button onclick={()=>screenManager.close(screen.id)}><i class={Icon.light("times").with(Icon.FW, "close").class}></i></button>
	{/if}
</a>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: tab;
	a {
		transition: all .2s;
		border: 1px solid v(border-color, transparent);
		border-radius: 5px;
		padding: 5px;
		display: flex;
		gap: 5px;
		cursor: pointer;
		position: relative;
		background-color: v(bg-color, #fff1);
		i.icon {color: v(icon-color, #fffc);}
		i.close { color: v(close-icon-color, #fffc);}
		div.title {color: v(title-color, #fffc);}
		div.info {color: v(info-color, #fff9);}

		div.changed {
			position: absolute;
			border-radius: 3px;
			top: 2px;
			left: 2px;
			width: 0;
			height: 0;
			border-top: 5px solid;
			border-left: 5px solid;
			border-color: v(change-marker-color, #F90C);
			border-right: 5px solid transparent !important;
			border-bottom: 5px solid transparent !important;
		}
		i.icon {
			flex-shrink: 0;
			align-self: center;
		}
		button {
			@include button-reset;
			flex-shrink: 0;
			transition: all .2s;
			align-self: flex-start;
			&:hover { rotate: 90deg;}
		}
		div.label {
			flex-grow: 1;
			overflow: hidden;
			div.title {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 12px;
				font-weight: 500;
				line-height: 16px;
			}
			div.info {
				white-space: nowrap;
				text-overflow: ellipsis;
				overflow: hidden;
				font-size: 10px;
				font-weight: 200;
			}
		}
		&:hover {
			background-color: v(bg-color-hover, #fff2);
			border-color: v(border-color-hover, #fff1);
			div.changed {border-color: v(change-marker-color-hover, #F90);}
			i.icon {color: v(icon-color-hover, #fff);}
			i.close { color: v(close-icon-color-hover, #fff);}
			div.title {color: v(title-color-hover, #fff);}
			div.info {color: v(info-color-hover, #fffb);}
			div.label div.title { white-space: wrap;}
		}
		&.selected {
			border-color: v(border-color-selected, #fff3);
			background-color: v(bg-color-selected, #fff2);
			div.info {color: v(info-color-selected, #fffb);}
			div.title {color: v(title-color-selected, #fff);}
			i.icon {color: v(icon-color-selected, #fff);}
			i.close {color: v(close-icon-color-selected, #fffb);}
			div.changed {border-color: v(change-marker-color-selected, #F90);}
		}
	}
</style>
