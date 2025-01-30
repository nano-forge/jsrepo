<script lang="ts">

	import {getEventManager} from "../../admin/event-manager.svelte.js";
	import {ScreenManager} from "../../admin/screen-manager.svelte.js";
	import {ScreenTypeSingle} from "../../admin/screen-type.ts";
	import {Screen, setScreen} from "../../admin/screen.svelte.js";
	import {getDrawerManager} from "./drawer-manager.svelte.js";
	import type {Component} from "svelte";

	let drawerManager = getDrawerManager();
	let {data}: {
		data: {
			component: Component,
			data: Record<string, any>
		}
	} = $props();

	class DrawerScreenManager extends ScreenManager {
		close(...args: any) {
			drawerManager.close();
		}
	}

	let eventManager = getEventManager();

	setScreen(new Screen(new DrawerScreenManager(eventManager), new ScreenTypeSingle(data.component), {...data.data}, ""));

	let DrawerComponent = data.component
</script>


<DrawerComponent {...data.data}/>