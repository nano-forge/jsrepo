<script lang="ts">
	import {Menu} from "@nano-forge/ui-tools";
	import {getListManager} from "../../list-manager.svelte";

	const listManager = getListManager();
	let {label, icon, list}: {
		label: string,
		icon?: string,
		list: string | symbol
	} = $props();
</script>

<Menu {label} {icon} onclick={()=>listManager.open(list)}/>
