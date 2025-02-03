<script lang="ts">
	import {Menu} from "@nano-forge/ui-tools";
	import {getScreenManager} from "../../screen-manager.svelte";
	import type {ScreenType} from "../../screen-type";

	const screenManager = getScreenManager();
	let {label, icon, screen}: {
		label: string,
		icon?: string,
		screen: ScreenType
	} = $props();
</script>

<Menu {label} {icon} onclick={()=>screenManager.open(screen)}/>
