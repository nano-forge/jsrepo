<script lang="ts">

	import {Icon} from "../icon";
	import {tooltip} from "../tooltip/tooltip-action.svelte";
	import ColorField from "./ColorField.svelte";
	import SelectField from "./SelectField.svelte";
	import TextField from "./TextField.svelte";

	let {value = $bindable(), color = false}: {
		value?: {
			family: string,
			color?: string,
			icon: string
		},
		color?: boolean
	} = $props();

	if (!value) value = {family: "solid", color: "black", icon: "house"};
	let visualValue = $state(value);

	$effect(() => {
		value = visualValue;
	})

	let options = {
		"solid": "solid",
		"regular": "regular",
		"light": "light",
		"thin": "thin",
		"duotone": "duotone",
		"brands": "brands"
	};

</script>
<i class="{visualValue.family} {visualValue.icon}" style="color: {visualValue.color}"></i>
<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main>
	<SelectField bind:value={visualValue["family"]} {options}></SelectField>
	<TextField bind:value={visualValue["icon"]} placeholder="fa-house"></TextField>
	{#if color}
		<div style="width: 40px; min-width: 40px">
			<ColorField bind:value={visualValue["color"]}></ColorField>
		</div>
	{/if}
	<div class="preview">
		<i class="fa-{visualValue.family} fa-{visualValue.icon}"></i>
	</div>
	<a href="https://fontawesome.com/search" target="_blank" title="Search" use:tooltip={"Search icons"}>
		<i class={Icon.regular("magnifying-glass").with(Icon.FW).class}></i>
	</a>
</main>

<style lang="scss">
	@use "mixins" as *;

	main {
		display: flex;
		gap: 5px;
		flex-direction: row;
		a {@include button;}
		.preview {
			@include button(true);
		}
	}
</style>