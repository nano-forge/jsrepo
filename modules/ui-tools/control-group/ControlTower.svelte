<script lang="ts">
	import type {Snippet} from "svelte";

	let {children}: { children: Snippet } = $props();
</script>
<main class="control-tower">
	{@render children()}
</main>


<style lang="scss">
	main {

		display: flex;
		flex-direction: column;
		gap: 0;
		//border: 2px solid red;
	}
	:global(main.control-tower>main.control-group) {
		border-radius: 0 !important;
		border-bottom-width: 0;
		&:first-child {
			border-top-left-radius: 5px !important;
			border-top-right-radius: 5px !important;
		}

		&:last-child {
			border-bottom-left-radius: 5px !important;
			border-bottom-right-radius: 5px !important;
			border-bottom-width: 1px;
		}
	}

</style>