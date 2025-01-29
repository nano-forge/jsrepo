<script lang="ts">
	import {Menu} from "../../../ui-tools";
	import {getListManager} from "../../list-manager.svelte.ts";

	const listManager = getListManager();
	let {label, icon, list}: {
		label: string,
		icon?: string,
		list: string | symbol
	} = $props();
</script>

<Menu {label} {icon} onclick={()=>listManager.open(list)}/>
