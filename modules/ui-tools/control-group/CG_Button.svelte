<script lang="ts">
	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types";
	import type {Icon} from "../icon";

	let {label = "", icon, disabled, onclick, pressed = false, grow = false, noborder = false, highlighted}: {
		label?: string,
		icon: Icon,
		disabled?: boolean,
		highlighted?: boolean,
		onclick: (e?: MouseEvent) => void,
		pressed?: boolean
	} & CG_SegmentProps = $props();
</script>
<CG_Segment grow={grow} noborder={noborder} label={label}>
	<button class:pressed disabled={disabled} class:highlighted={highlighted} onclick={(e)=>onclick(e)}><i class="fa-fw {icon}" style={icon.style}></i></button>
</CG_Segment>
<style lang="scss">
	button {
		background-color: transparent;
		color: var(--button-default-color);
		border: none;
		padding: calc(var(--isSmall) * 5px + var(--isLarge) * 10px);
		text-align: center;
		cursor: pointer;
		transition: all .2s;
		i {
			font-size: calc(var(--isSmall) * 14px + var(--isLarge) * 16px);
			transition: all .2s;
			opacity: .8;
		}
		&.pressed {
			background-color: var(--button-pressed-bg-color);
		}
		&:hover {
			background-color: var(--button-hover-bg-color);
			i {
				opacity: 1;
				translate: 0 -1.5px;
				//text-shadow: 0 5px 4px #000;
			}
		}
		&.highlighted {
			background-color: var(--button-hover-bg-color);
		}
	}
</style>