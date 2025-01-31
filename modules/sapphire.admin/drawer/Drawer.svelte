<script lang="ts">
	import {getDrawerManager} from "./drawer-manager.svelte.js";
	import {onMount} from "svelte";

	let {children, onCloseData}: { children: any, onCloseData?: any } = $props();

	let drawerManager = getDrawerManager()

	function close() {
		isOpen = false;
		setTimeout(() => drawerManager.close(), 300)
	}

	let isOpen: boolean = $state(false);

	onMount(() => {
		setTimeout(() => {
			isOpen = true;
		}, 10)
	})
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<div class:open={isOpen} class="wrapper" onclick={(e)=>close(e)} oncontextmenu={e=>close(e)}>
	<main class:open={isOpen} onclick={e=>e.stopPropagation()}>
		{@render children()}
	</main>
</div>

<style lang="scss">
	.wrapper {
		position: fixed;
		transition: all .3s;
		top: 0;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 9000;
		overflow: hidden;
		&.open {
			backdrop-filter: blur(1.5px);
			background-color: #0004;
		}
		main {
			transition: all .3s;
			right: -100%;
			position: fixed;
			top: 0;
			bottom: 0;
			width: 400px;
			box-shadow: 0 0 25px rgba(0, 0, 0, 0.4);
			&.open {
				right: 0;
			}
		}
	}


</style>