<script lang="ts">
	import {getDialogManager} from "./dialog-manager.svelte";
	import {onMount, untrack} from "svelte";

	let dialogManager = getDialogManager();

	let isOpen = $state(false);
	$effect(() => {
		dialogManager.dialogs.length
		untrack(async () => {
			if (!isOpen && dialogManager.dialogs.length) {
				setTimeout(() => {isOpen = true}, 10)
			} else {
				isOpen = false
			}
		})
	})

</script>
{#if dialogManager.dialogs.length > 0}
	{#each dialogManager.dialogs as dialog, index}
		{#if index === dialogManager.dialogs.length - 1}
			<div class="dialog-overlay"></div>
		{/if}
		{@const Component = dialog.component}
		<Component {...dialog.data}/>
	{/each}
{/if}

<style lang="scss">
	@use "../mixins" as *;
	$var-scope: dialog;

	.dialog-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: v(z-index, 9000);
		transition: all .3s;
		background-color: v(backdrop-bg-color, #0008);
		backdrop-filter: v(backdrop-filter, blur(1.5px));
	}
</style>

