<script lang="ts">
	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types.ts";

	let {value = $bindable(), min, max, grow = false, noborder = false, label, disabled}: {
		value: number,
		min: number,
		max: number,
		disabled?: boolean
	} & CG_SegmentProps = $props();
</script>

<CG_Segment grow={grow} noborder={noborder} label={label}>
	<input type="range" disabled={disabled} bind:value {min} {max}>
</CG_Segment>

<style lang="scss">
	input {
		border: none;
		outline: none;
		margin: 0 8px;
	}
</style>