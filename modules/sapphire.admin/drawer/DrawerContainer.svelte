<script lang="ts">
	import {getDrawerManager} from "./drawer-manager.svelte";
	import Drawer from "./Drawer.svelte";

	let drawerManager = getDrawerManager()
	function resolve(data: any) {
		drawerManager.close(data);
	}
</script>
{#if drawerManager.drawer}
	<Drawer>
		<svelte:component this={drawerManager.drawer.component} data={drawerManager.drawer.data} resolve={resolve}/>
	</Drawer>
{/if}

<style lang="scss">
</style>

