<script lang="ts">
	import {MenuGroup} from "@nano-forge/ui-tools";
	import {getConfig} from "../config-context";
	import ImmersiveBar from "./ImmersiveBar.svelte";
	import Screen from "./Screen.svelte";
	import Tab from "./Tab.svelte";
	import {getListManager} from "../list-manager.svelte";
	import {getScreenManager} from "../screen-manager.svelte";
	import {type Snippet} from "svelte";
	import {slide} from "svelte/transition";

	let listManager = getListManager();
	let screenManager = getScreenManager();
	let config = getConfig()


	let {
		Nav,
		Header,
		Footer,
		Lists,
	}: {
		Nav: Snippet,
		Header: Snippet,
		Footer: Snippet,
		Lists: Snippet,
	} = $props();

	let immersiveStatus = $state(false);


</script>

<main class:immersive={immersiveStatus} class="immersive-bar-{config.immersiveMode}">
	<!--	NAVIGATION BAR-->
	<div class="nav">
		<header>{@render Header()}</header>
		<div class="menu">
			<MenuGroup open>{@render Nav()}</MenuGroup>
		</div>
		<footer class="credits">{@render Footer()}</footer>
	</div>

	<!--	LISTS-->
	{#if listManager.list !== undefined}
		<div transition:slide={{axis: 'x'}} class="list">
			<div>
				{@render Lists()}
			</div>
		</div>
	{/if}

	<!--	TABS-->
	{#if screenManager.screens.filter(screen => screen.showTab).length}
		<div transition:slide={{axis: 'x'}} class="tabs">
			{#each screenManager.screens.filter((screen) => screen.showTab) as screen (screen.id)}
				<Tab screen={screen}/>
			{/each}
		</div>
	{/if}

	<!--	SCREENS-->
	<div class="screen">
		{#each screenManager.screens as screen (screen.id)}
			<Screen screen={screen}/>
		{/each}
	</div>

	<!--	IMMERSIVE BAR-->
	{#if config.immersiveMode === "always" || (immersiveStatus && config.immersiveMode === "auto")}
		<div transition:slide={{axis: 'x'}} class="immersive-bar">
			<ImmersiveBar bind:immersiveStatus={immersiveStatus}/>
		</div>
	{/if}

</main>

<style lang="scss">

	@use "../mixins" as *;
	$var-scope: layout;

	main {
		width: 100%;
		height: 100%;
		display: flex;
		flex-direction: row;
		background-color: v(bg-color, #448);
		> * { overflow: hidden;}
		.nav, .list, .tabs {
			transition: all .3s;
			height: 100%;
		}

		.nav {
			background-color: v(menu-bg-color, #225);
			min-width: v(menu-width, 200px);
			width: v(menu-width, 200px);
			display: flex;
			flex-direction: column;
			//box-shadow: var(--panel-shadow);
			.menu {
				overflow: auto;
				:global(hr) {
					width: calc(100% - 20px);
					border: 0;
					border-top: 1px dashed v(menu-hr-color, #fff3);
				}
			}
			footer {
				flex-grow: 1;
				align-content: end;
			}
		}
		.list {
			background-color: v(list-bg-color, #448);
			min-width: v(list-width, 350px);
			max-width: v(list-width, 350px);
			display: block;
			//box-shadow: var(--panel-shadow);
			padding: 10px 0;
			margin-left: 10px;
			div {
				//margin: 10px;
				border-radius: 10px;
				//border: 1px solid #fff3;
				height: 100%;
				overflow: hidden;
			}
		}
		.tabs {
			background-color: v(tabs-bg-color, #448);
			min-width: v(tabs-width, 200px);
			width: v(tabs-width, 200px);
			//box-shadow: v(panel-shadow);
			overflow: auto;
			padding: 10px 0;
			display: flex;
			gap: 5px;
			flex-direction: column;
			margin-left: 10px;
		}
		.screen {
			flex-grow: 1;
			padding: 10px 0;
			margin-left: 10px;
		}
		&.immersive {
			.nav, .list, .tabs {min-width: 0;width: 0;padding: 0; margin: 0;}
		}
		.immersive-bar {
			background-color: v(immersive-bar-bg-color, #448);
			min-width: v(immersive-bar-width, 30px);
			width: v(immersive-bar-width, 30px);
			//box-shadow: v(panel-shadow);
		}
	}
</style>