<script lang="ts">
	import {Icon} from "../icon";

	let {icon, label, onclick, disabled = false}: { icon?: Icon, label: string, onclick: () => void, disabled?: boolean } = $props();
</script>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main onclick={()=>!disabled && onclick()} class:disabled>
	{#if icon}<i class={icon.with(Icon.FW).class}></i>{/if} {label}
</main>
<style lang="scss">
	main {
		font-weight: 500;
		font-size: 12px;
		margin: 4px;
		border-radius: 2px;
		padding: 5px 5px;
		cursor: pointer;
		color: #ccf;
		transition: all .1s;
		white-space: nowrap;
		user-select: none;
		&.disabled {
			cursor: not-allowed;
			opacity: .5;
		}
		&:last-child {border: 0;}
		&:not(.disabled):hover {
			background-color: #FB0;
			color: #002;
		}
		&.disabled:hover {
			outline: 1px dashed #FB08;
		}
		i {
			font-size: 12px;
			margin-right: 5px;
			opacity: .7;
		}
	}
</style>