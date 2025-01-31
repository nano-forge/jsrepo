<script lang="ts" generics="T">
	import {getEventManager} from "../event-manager.svelte.js";
	import {KeyStrokeEvents} from "../key-stroke-handler.ts";

	let {immersiveStatus = $bindable()}: { immersiveStatus: boolean } = $props();

	let eventManager = getEventManager();

	eventManager.subscribe(KeyStrokeEvents.ESCAPE, () => immersiveStatus = false);
	eventManager.subscribe(KeyStrokeEvents.CONTROL_SPACE, () => immersiveStatus = !immersiveStatus);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions, a11y_no_noninteractive_element_interactions -->
<main class:on={immersiveStatus} onclick={()=>immersiveStatus = !immersiveStatus}>
	<button>
		<i class="fa-fw fas"
		   class:fa-arrow-down-left-and-arrow-up-right-to-center={immersiveStatus}
		   class:fa-arrow-up-right-and-arrow-down-left-from-center={!immersiveStatus}></i>
	</button>
	<div></div>
</main>

<style lang="scss">

	@use "../mixins" as *;
	$var-scope: immersive-bar;


	main {
		align-items: flex-start;
		gap: 5px;
		padding-top: 10px;
		display: flex;
		flex-direction: column;
		height: 100%;
		cursor: pointer;

		button {
			align-self: center;
			@include button-reset;
			outline: none;
			i { color:v(icon-color, #fff);}
		}
		div {
			transform-origin: bottom left;
			transform: rotate(90deg);
			white-space: nowrap;
			font-weight: bold;
			font-size: 10px;
			text-transform: uppercase;
			line-height: 30px;
			translate: 0 -25px;
			color:v(text-color, #fff6);
			&:before {
				content:v(text, "Immersive Mode Off (Ctrl + Space)");
				transition: all .3s;
			}
		}

		&.on {
			button i { color:v(icon-color-on, #F90);}
			div:before { content:v(text-on, "Immersive Mode On (Ctrl + Space)");
				color:v(text-color-on, #fff9);
			}
		}
	}
</style>
