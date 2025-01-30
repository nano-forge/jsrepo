<script lang="ts">
	import {Menu} from "../../../ui-tools";
	import {getScreenManager} from "../../screen-manager.svelte.ts";
	import type {ScreenType} from "../../screen-type.ts";

	const screenManager = getScreenManager();
	let {label, icon, screen}: {
		label: string,
		icon?: string,
		screen: ScreenType
	} = $props();
</script>

<Menu {label} {icon} onclick={()=>screenManager.open(screen)}/>
