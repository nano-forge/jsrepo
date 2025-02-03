<script lang="ts">
	import {type Snippet} from "svelte";
	import {getToastManager, Icon, CG_Button, ControlGroup} from "@nano-forge/ui-tools";
	import type {Api} from "../api";
	import {getAuthManager} from "../auth-manager.svelte";
	import {getConfig} from "../config-context";
	import {getEventManager} from "../event-manager.svelte";
	import {KeyStrokeEvents} from "../key-stroke-handler";
	import {getScreen} from "../screen.svelte";
	import FormErrors from "./FormErrors.svelte";

	let {
		children,
		Buttons,
		api,
		item = $bindable(),
		options = {},
		changeEvent,
		buttonOptions,
	}: {
		children: any,
		Buttons?: Snippet
		api: Api.AnyApi,
		item: any,
		options: {
			title?: (item: any) => string,
			info?: (item: any) => string,
			icon?: ((item: any) => Icon)
		}
		changeEvent?: symbol | Array<symbol>,
		buttonOptions?: { save?: boolean, delete?: boolean }
	} = $props();

	buttonOptions = {save: true, delete: true, ...(buttonOptions || {})};

	let screen = getScreen();
	let toastManager = getToastManager();
	let authManager = getAuthManager();
	let eventManager = getEventManager();
	let config = getConfig();

	let errors: Record<string, Array<{ message: string }>> | undefined = $state(undefined)

	screen.title = "Loading...";
	screen.info = "...";
	screen.loading = true;

	let snapshot: any;

	let loading = loadItem(screen.data.id)


	eventManager.subscribeComponent(
		KeyStrokeEvents.SAVE_KEYSTROKE,
		(event: { all?: boolean }) => {
			if ((screen.selected || event.all) && screen.changed) saveItem();
		}
	);

	$effect(() => {
		if (screen.loading === false) {
			screen.title = options.title ? options.title(item) : item.id;
			screen.info = options.info ? options.info(item) : item.id;
			screen.icon = options.icon ? options.icon(item) : item.id;
		}
	});

	$effect(() => {
		screen.changed = JSON.stringify(snapshot) !== JSON.stringify($state.snapshot(item));
	})

	screen.onClose = () => !screen.changed || confirm("The document has changes.\nAre you sure you want to close this document?");

	async function loadItem(id: string | number) {
		try {
			item = await api.getItem(id);
			snapshot = $state.snapshot(item);
			screen.loading = false;
		} catch (e) {
			toastManager.error("Item not found!")
			screen.close()
		}
	}
	async function saveItem() {
		try {
			errors = undefined;
			screen.loading = true;
			let reloaded = await api.save(item);
			item = reloaded;
			snapshot = $state.snapshot(item);
			screen.data = {id: reloaded.data.id};
			changeEvent && eventManager.fire(changeEvent, {event: "save", item});
			toastManager.success("Saved", `[${screen.title}] has been saved successfully`);
		} catch (e) {
			if (e instanceof config.apiErrorClass) {
				switch (e.response.status) {
					case 401:
						toastManager.error("UNAUTHORIZED", `You are not authorized, please sign in!`);
						await authManager.signOut();
						break;
					case 403:
						toastManager.error("FORBIDDEN", `You are not allowed to save the item`);
						break;
					case 422:
						toastManager.error("Validation Error", "Please check the form for errors");
						errors = (await e.response.json()).details;
						break;
					case 409:
						toastManager.error("DUPLICATE ENTRY", "The item must be unique");
						break;
					default:
						toastManager.error(e.message, "Could not save the item");
				}
			} else {
				toastManager.error("UNKNOWN ERROR", "Could not save the item");
			}
		}
		screen.loading = false;

	}
	async function deleteItem() {
		try {
			await api.delete(item.data.id);
			screen.close(true)
			changeEvent && eventManager.fire(changeEvent, {event: "delete", item});
		} catch (e) {
			toastManager.error("Error", "Could not delete the item");
		}
	}

</script>

<main>
	{#await loading}
		<div class="wrapper loading">
			<i class={Icon.thin("spinner").with(Icon.ANIM_PULSE).class}></i>
		</div>
	{:then _}
		{#if item}
			<div class="wrapper">
				<header>
					<div class="icon"><i class="fa-fw {screen.icon}"></i></div>
					<div class="label">
						<div class="title">{screen.title}</div>
						<div class="info">{screen.info}</div>
					</div>
					<ControlGroup>
						{#if Buttons}
							{@render Buttons()}
						{/if}
						{#if buttonOptions.save === true}
							<CG_Button icon={Icon.light("floppy-disk").color("lime")} onclick={()=>saveItem()} label="Save changes"/>
						{/if}

						{#if buttonOptions.delete === true && item.data.id}
							<CG_Button icon={Icon.light("trash-can").color("orangered")} onclick={()=>deleteItem()} label="Delete item"/>
						{/if}
					</ControlGroup>
				</header>
				<FormErrors errors={errors}/>
				<div class="form">
					{@render children()}
				</div>
				<div class="rest"></div>
			</div>
		{/if}
	{/await}

</main>


<style lang="scss">

	main {
		height: 100%;
		padding: 0;
		overflow: hidden;

		div.wrapper {
			height: 100%;
			display: flex;
			flex-direction: column;
		}
		div.loading {
			background-color: transparent;
			color: #fff9;
			padding: 20px;
			text-align: center;
			justify-content: center;
			font-size: 32px;
		}

		header {
			background-color: #226;
			display: flex;
			gap: 20px;
			color: white;
			padding: 20px;
			div.icon {
				font-size: 28px;
				color: #fffc;
			}
			div.label {
				flex-grow: 1;
				div.title {
					font-weight: 600;
				}
				div.info {
					font-size: 11px;
					font-weight: 200;
				}
			}
		}

		div.form {
			background-color: #f0f0ff;
			overflow: auto;
			display: flex;
			flex-wrap: wrap;
			gap: 10px;
			padding: 10px;
		}

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
</style>