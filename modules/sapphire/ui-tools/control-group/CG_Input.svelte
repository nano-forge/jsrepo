<script lang="ts">
	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types.ts";
	import {debounce} from "../debounce.ts";

	let {value = $bindable(), placeholder = "", debounceTime, grow = false, noborder = false, label, disabled}: {
		value: string,
		placeholder?: string,
		debounceTime?: number,
		disabled?: boolean
	} & CG_SegmentProps = $props();
</script>

<CG_Segment grow={grow} noborder={noborder} label={label}>
	{#if debounceTime}
		<input type="text" disabled={disabled} use:debounce={{debounce:debounceTime, onchange:val=>value = val}} placeholder={placeholder}>
	{:else}
		<input type="text" disabled={disabled} bind:value={value} placeholder={placeholder}/>
	{/if}
</CG_Segment>

<style lang="scss">
	input {
		border: none;
		width: 100%;
		background-color: transparent;
		outline: none;
		color: var(--input-color);
		padding-left: 8px;
		&::placeholder {
			color: var(--input-placeholder-color);
		}
		&:disabled {
			color: var(--input-disabled-color);
			font-style: italic;
		}
	}
</style>