<script lang="ts">
	import {Icon} from "../icon.ts";
	import {tooltip} from "../tooltip/tooltip-action.svelte.js";

	let {value = $bindable(), placeholder = ""}: {
		value: string | number | undefined,
		placeholder?: string
	} = $props();
	let visible = $state(true);

</script>
<div class="container">
	{#if visible}
		<input type="password" {placeholder} autocomplete="current-password" bind:value={value}/>
	{:else}
		<input type="text" {placeholder} autocomplete="current-password" bind:value={value}>
	{/if}
	<div class="icon-container" onmousedown={() => visible = false} onmouseup={() => visible = true}>
		<i class={visible ? Icon.regular("eye").with(Icon.FW).class : Icon.regular("eye-slash").with(Icon.FW).class}></i>
	</div>
</div>

<style lang="scss">
	@use "mixins" as *;
	input {
		@include input;
	}
	.container {
		display: flex;
		flex-direction: row;
		gap: 5px;
	}
	.icon-container {
		@include button;
		display: flex;
		justify-content: center;
		align-items: center;
		color: #555599;
		cursor: pointer;
	}
</style>