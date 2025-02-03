<script lang="ts">
	import CG_Segment from "./CG_Segment.svelte";
	import type {CG_SegmentProps} from "./types";
	import {Icon} from "../icon";

	let {icon, grow = false, noborder = false, label}: { icon: Icon } & CG_SegmentProps = $props();


</script>

<CG_Segment grow={grow} noborder={noborder} label={label}>
	<main>
		<i class={icon.with(Icon.FW).class} style={icon.style}></i>
	</main>
</CG_Segment>


<style lang="scss">
	main {
		display: flex;
		align-items: center;
		padding: 0 5px;
	}
	i {
		font-size: calc(var(--isSmall) * 14px + var(--isLarge) * 16px);
	}
</style>