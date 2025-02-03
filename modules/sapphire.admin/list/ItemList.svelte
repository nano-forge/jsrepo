<script lang="ts">
	import type {ToString} from "@nano-forge/util";
	import {type Snippet, untrack} from "svelte";
	import {CG_Button, CG_Icon, CG_Input, CG_Select, ControlGroup, createMapper, getToastManager, Icon, Pager} from "@nano-forge/ui-tools";
	import {Api} from "../api";
	import {getAuthManager} from "../auth-manager.svelte";
	import {getEventManager} from "../event-manager.svelte";

	type Props = {
		Card: Snippet<[Api.Item<any>]>,
		label: string,
		icon?: ToString<Icon>,
		Buttons?: Snippet,
		Filter?: Snippet,
		api: Api.AnyApi,
		pageSize: number
		hasQuickSearch?: boolean
		reloadOn?: symbol | Array<symbol>,
		sorting: Array<string> | Record<string, string>,
		filter?: Record<string, any>,
	}
	let {api, Card, label, icon = Icon.light("list"), pageSize = 50, hasQuickSearch = false, reloadOn, Buttons, Filter, sorting, filter = $bindable()}: Props = $props();

	let toastManager = getToastManager();
	let authManager = getAuthManager();
	let eventManager = getEventManager();

	let list: Api.List<any> | undefined = $state();
	let pages: number = $state(0);
	let quickSearch: string = $state("");
	let showAdvancedOptions: boolean = $state(false)

	let sortingKeyLabel: Map<string | number, string> = $state(sorting ? (createMapper(sorting)).map : new Map());
	let order: string = $state(sorting ? sortingKeyLabel.entries().next().value![0].toString() : "")

	if (reloadOn) {
		reloadOn = Array.isArray(reloadOn) ? reloadOn : [reloadOn];
		reloadOn.forEach(event => eventManager.subscribeComponent(event, () => {if (list) goToPage(list.page)}));
	}

	async function goToPage(toPage: number) {
		if (toPage >= pages) toPage = pages - 1;
		if (toPage < 0) toPage = 0;
		try {
			list = await api.getList(toPage, pageSize, {search: quickSearch, filter: filter, order});
			// list.items.forEach(x => x.data["id"] = Math.random())

			pages = Math.ceil(list!.count / pageSize);
		} catch (e) {
			if (e instanceof Api.ApiException) {
				switch (e.response.status) {
					case 401:
						toastManager.error("UNAUTHORIZED", `You are not authorized, please sign in!`);
						await authManager.signOut();
						break;
					case 403:
						toastManager.error("FORBIDDEN", `You are not allowed to fetch the list`);
						break;
					default:
						toastManager.error("ERROR OCCURRED", `An error occurred while fetching the list (error code: ${e.response.status})`);
				}
			} else {
				toastManager.error("UNKNOWN ERROR OCCURRED", `An error occurred while fetching the list`);
			}
		}
	}

	$effect(() => {
		quickSearch;
		$state.snapshot(filter)
		order;
		untrack(() => goToPage(0))
	})

</script>

<main>
	{#if list}
		<header>
			<div class="title">
				{#if icon}
					<i class={icon.class} style="{icon.style}"></i>
				{/if}
				<div class="label">{label}</div>
				<div class="buttons">
					{#if Buttons || !hasQuickSearch && (Filter || sorting)}
						<ControlGroup small>
							{#if sorting || Filter}
								<CG_Button pressed={showAdvancedOptions} icon={Icon.light("rectangle-list").color("cyan")} onclick={()=>showAdvancedOptions = !showAdvancedOptions} label="Advanced options"/>
							{/if}
							{#if Buttons}
								{@render Buttons()}
							{/if}
						</ControlGroup>
					{/if}
				</div>
			</div>

			{#if hasQuickSearch}
				<div class="quickSearch">
					<ControlGroup small>
						<CG_Icon icon={Icon.light("magnifying-glass").color("cyan")} noborder label="quick search"/>
						<CG_Input bind:value={quickSearch} debounceTime={300} placeholder="quick search" grow/>
					</ControlGroup>
				</div>
			{/if}

			<div class="advanced-options" hidden={!showAdvancedOptions}>
				{#if Filter}
					{@render Filter()}
				{/if}
				{#if sorting}
					<ControlGroup small>
						<CG_Icon icon={Icon.light("arrow-down-a-z").color("cyan")} noborder label="Sorting"/>
						<CG_Select options={sortingKeyLabel} bind:value={order} placeholder="Sorting" grow/>
					</ControlGroup>
				{/if}
			</div>

		</header>

		<article>
			{#each list.items as item (item.data.id)}{@render Card(item)}{/each}
			<div class="rest"></div>
		</article>

		<footer>
			<Pager page={list.page} pages={Math.max(1, Math.ceil(list.count/pageSize))} onChange={page=>goToPage(page)} count={list.count}/>
		</footer>

	{:else}
		loading...
	{/if}
</main>

<style lang="scss">
	main {
		color: white;display: flex;
		flex-direction: column;
		height: 100%;
		header {
			padding: 10px;
			display: flex;
			gap: 10px;
			flex-direction: column;
			background-color: #226;
			div.title {
				font-size: 18px;
				font-weight: 300;
				display: flex;
				gap: 10px;
				align-items: center;
				i {font-size: 16px;}
				div.label {flex-grow: 1}
			}
			div.advanced-options {
				display: flex;
				flex-direction: column;
				gap: 5px;
				&[hidden] {
					display: none;
				}
			}
		}
		article {
			flex-direction: column;
			flex-grow: 1;
			display: flex;
			overflow: auto;
			background-color: #eef;
			div.rest {
				flex-grow: 1;
				box-shadow: inset 0 10px 10px 10px #9A9AC833;
				background: repeating-linear-gradient(
						-45deg,
						#f0f0ff,
						#f0f0ff 5px,
						#d9ddf3 5px,
						#d9ddf3 10px
				);
			}
		}
		footer {
			padding: 5px 10px;
			background-color: #226;
		}
	}
</style>