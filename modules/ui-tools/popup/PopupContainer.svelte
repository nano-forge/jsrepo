<script lang="ts">
	import {getPopupManager} from "./popup-manager.svelte";
	import Popup from "./Popup.svelte";
	import {onMount} from "svelte";

	let popupManager = getPopupManager()
	onMount(() => {
		window.addEventListener("click", () => {popupManager.close()}, true);
		window.addEventListener("contextmenu", () => popupManager.close(), true);
	})
</script>
{#if popupManager.popup}
	<Popup>
		<svelte:component this={popupManager.popup.component} data={popupManager.popup.data}/>
	</Popup>
{/if}

