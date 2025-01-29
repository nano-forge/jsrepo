<script lang="ts">
	import type {Snippet} from "svelte";

	let {children}: { children: Snippet } = $props();

</script>
<main>
	{@render children()}
</main>
<style lang="scss">
	main {
		background-color: #002c;
		backdrop-filter: blur(8px);
		border-radius: 6px;
		box-shadow: 0 0 10px rgba(0, 0, 0, .5);
		min-width: 200px;
		overflow: hidden;
		border: 1px solid #fff3;
		outline: 1px solid #002c;
		:global(hr) {
			border: none;
			border-bottom: 1px solid #fff3;
		}
	}
</style>