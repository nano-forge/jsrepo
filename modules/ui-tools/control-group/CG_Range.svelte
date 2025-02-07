<script lang="ts">
	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types";

	let {value = $bindable(), min, max, grow = false, noborder = false, label, disabled}: {
		value: number,
		min: number,
		max: number,
		disabled?: boolean
	} & CG_SegmentProps = $props();
</script>

<CG_Segment grow={grow} noborder={noborder} label={label}>
	<div class="range">
		<input type="range" disabled={disabled} bind:value {min} {max}>
	</div>
</CG_Segment>

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: cg_range;
	div.range {
		background-color: v(range-bg-color, #FFF3);
		border-radius: 15px;
		padding: 3px;
		align-self: center;
		margin: 0 5px;
		input {
			background-color: transparent;
			cursor: pointer;
			appearance: none;
			display: flex;
			padding: 0;
			width: 100%;
			margin: 0;
			&::-webkit-slider-runnable-track {
				border-radius: 2rem;
				height: 10px;
			}
			&::-webkit-slider-thumb {
				-webkit-appearance: none;
				background: v(range-thumb-color, #fff);
				width: 15px;
				height: 10px;
				border-radius: 10px;
				&:hover {
					background: v(range-thumb-hover-color, #F90);
				}
			}
			&:disabled {
				opacity: v(range-disabled-opacity, 0.4);
			}
		}
	}
</style>