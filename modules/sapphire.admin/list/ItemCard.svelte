<script lang="ts">
	import type {Snippet} from "svelte";

	let {children}: { children: Snippet } = $props();
</script>

<main>{@render children()}</main>

<style lang="scss">
	//main {
	//	font-size: 14px;
	//	background-color: #004;
	//	border-radius: 10px;
	//	color: white;
	//	border: 1px solid #448;
	//	box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
	//	transition: all .3s;
	//	&:hover {
	//		background-color: #004;
	//		box-shadow: 0 0 4px #99d;
	//	}
	//}
	main {
		border-bottom: 1px solid #dde;
		transition: all .15s;
		&:hover {
			background-color: #fff;
			box-shadow: 0 4px 13px -5px rgba(0, 0, 0, 0.3);
		}
	}
</style>