<script lang="ts">

	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types";

	let {
		value = $bindable(),
		placeholder = "",
		options,
		grow = false, noborder = false, label
	}: {
		value: string,
		options: Map<string | number, string>
		placeholder?: string
	} & CG_SegmentProps = $props();
</script>

<CG_Segment grow={grow} noborder={noborder} label={label}>
	<select bind:value={value}>
		{#if placeholder}
			<option disabled selected value="">{placeholder}</option>
		{/if}
		{#each options as entry}
			<option value={entry[0]}>{entry[1]}</option>
		{/each}
	</select>
</CG_Segment>

<style lang="scss">
	select {
		border: none;
		width: 100%;
		background-color: transparent;
		outline: none;
		color: #aae;
		padding: 0;
		margin-right: 10px;
	}
</style>